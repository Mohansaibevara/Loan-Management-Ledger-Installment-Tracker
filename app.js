import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Multi-language Dictionaries
const translations = {
  en: {
    loginTitle: "Loan Ledger Login",
    loginSubtitle: "Enter credentials to access the ledger",
    usernameLabel: "Username / Email",
    passwordLabel: "Password",
    loginBtn: "Login to Portal",
    appTitle: "Loan Management Ledger",
    appSubtitle: "Daily & Weekly Installment Repayment Tracker",
    importExcel: "📥 Import Excel",
    exportExcel: "📊 Export Excel",
    exportPdf: "📄 Export PDF",
    addBorrower: "+ Add New Borrower",
    logout: "Logout",
    metricPrincipal: "Total Active Principal",
    metricCollection: "Total Expected Collection",
    metricInterest: "Monthly Interest Accrued",
    searchPlaceholder: "Search by borrower name or phone number across multiple loans...",
    tableHeader: "Transactions & Active Loans",
    thDate: "Date & Time Taken",
    thName: "Name",
    thPhone: "Phone",
    thPrincipal: "Principal",
    thInterest: "Interest",
    thSchedule: "Schedule / Pay",
    thMonthly: "Monthly",
    thProgress: "Progress",
    thStatus: "Status",
    thActions: "Actions",
    modalAddTitle: "Add New Loan Transaction",
    labelBorrowerName: "Borrower Name",
    labelPhone: "Phone Number",
    labelPrincipal: "Principal Amount (₹)",
    labelRate: "Interest Rate (% per month)",
    labelSchedule: "Repayment Frequency",
    optDaily: "Daily (100 Days @ 1%/day)",
    optWeekly: "Weekly Once (15 Weeks @ 7%/week)",
    btnCancel: "Cancel",
    btnSaveLoan: "Save Loan",
    modalEditDateTitle: "Edit Date & Time Taken",
    labelSelectDateTime: "Select Correct Date & Time",
    btnUpdateDate: "Update Date",
    statInstallmentAmt: "Installment Amount:",
    statCollectedSoFar: "Collected So Far:",
    statMissedDue: "Missed / Due Amount:",
    ledgerHint: "Check off installment payments. Unchecked elapsed intervals highlight as DUE.",
    closeLedger: "Close Ledger",
    profileTotalLoansLabel: "Total Loans Taken",
    profileActiveLoansLabel: "Active / Running Loans",
    profileTotalPrincipalLabel: "Total Principal Borrowed",
    profileBreakdown: "Associated Loans Breakdown:",
    exportProfilePdf: "📄 Download Profile PDF",
    closeProfile: "Close Profile",
    btnConfirm: "Confirm",
    statusUpToDate: "Up to Date",
    statusFullyPaid: "Fully Paid",
    running: "Running"
  },
  te: {
    loginTitle: "లోన్ లెడ్జర్ లాగిన్",
    loginSubtitle: "లెడ్జర్‌ను యాక్సెస్ చేయడానికి వివరాలను నమోదు చేయండి",
    usernameLabel: "యూజర్ పేరు / ఈమెయిల్",
    passwordLabel: "పాస్‌వర్డ్",
    loginBtn: "పోర్టల్‌లోకి లాగిన్ అవ్వండి",
    appTitle: "లోన్ మేనేజ్‌మెంట్ లెడ్జర్",
    appSubtitle: "రోజువారీ & వారాంతపు వాయిదాల ట్రాకర్",
    importExcel: "📥 ఎక్సెల్ దిగుమతి",
    exportExcel: "📊 ఎక్సెల్ ఎగుమతి",
    exportPdf: "📄 పిడిఎఫ్ ఎగుమతి",
    addBorrower: "+ కొత్త రుణగ్రహీతను జోడించు",
    logout: "లాగ్ అవుట్",
    metricPrincipal: "మొత్తం యాక్టివ్ ప్రిన్సిపల్",
    metricCollection: "మొత్తం ఆశించిన వసూలు",
    metricInterest: "నెలవారీ వడ్డీ",
    searchPlaceholder: "రుణగ్రహీత పేరు లేదా ఫోన్ నంబర్ ద్వారా వెతకండి...",
    tableHeader: "లావాదేవీలు & యాక్టివ్ లోన్లు",
    thDate: "తీసుకున్న తేదీ & సమయం",
    thName: "పేరు",
    thPhone: "ఫోన్",
    thPrincipal: "అసలు",
    thInterest: "వడ్డీ",
    thSchedule: "షెడ్యూల్ / చెల్లింపు",
    thMonthly: "నెలవారీ",
    thProgress: "పురోగతి",
    thStatus: "స్థితి",
    thActions: "చర్యలు",
    modalAddTitle: "కొత్త లోన్ లావాదేవీని జోడించు",
    labelBorrowerName: "రుణగ్రహీత పేరు",
    labelPhone: "ఫోన్ నంబర్",
    labelPrincipal: "అసలు మొత్తం (₹)",
    labelRate: "వడ్డీ రేటు (% నెలకు)",
    labelSchedule: "తిరిగి చెల్లించే పౌణ్యపున్యం",
    optDaily: "రోజువారీ (100 రోజులు @ 1%/రోజు)",
    optWeekly: "వారానికోసారి (15 వారాలు @ 7%/వారం)",
    btnCancel: "రద్దు చేయి",
    btnSaveLoan: "లోన్ భద్రపరుచు",
    modalEditDateTitle: "తేదీ & సమయాన్ని సవరించండి",
    labelSelectDateTime: "సరైన తేదీ & సమయాన్ని ఎంచుకోండి",
    btnUpdateDate: "తేదీని అప్‌డేట్ చేయి",
    statInstallmentAmt: "వాయిదా మొత్తం:",
    statCollectedSoFar: "ఇప్పటివరకు వసూలు అయింది:",
    statMissedDue: "చెల్లించవలసిన మొత్తం:",
    ledgerHint: "వాయిదాలను చెక్ చేయండి. గడువు ముగిసినవి DUE గా చూపుతాయి.",
    closeLedger: "లెడ్జర్ మూసివేయి",
    profileTotalLoansLabel: "మొత్తం తీసుకున్న లోన్లు",
    profileActiveLoansLabel: "యాక్టివ్ లోన్లు",
    profileTotalPrincipalLabel: "మొత్తం తీసుకున్న అసలు",
    profileBreakdown: "సంబంధిత లోన్ల వివరాలు:",
    exportProfilePdf: "📄 ప్రొఫైల్ పిడిఎఫ్ డౌన్‌లోడ్",
    closeProfile: "ప్రొఫైల్ మూసివేయి",
    btnConfirm: "నిర్ధారించండి",
    statusUpToDate: "సక్రమంగా ఉంది",
    statusFullyPaid: "పూర్తిగా చెల్లించబడింది",
    running: "నడుస్తోంది"
  },
  hi: {
    loginTitle: "ऋण बही लॉगिन",
    loginSubtitle: "बहीखाता एक्सेस करने के लिए विवरण दर्ज करें",
    usernameLabel: "उपयोगकर्ता नाम / ईमेल",
    passwordLabel: "पासवर्ड",
    loginBtn: "पोर्टल पर लॉगिन करें",
    appTitle: "ऋण प्रबंधन बहीखाता",
    appSubtitle: "दैनिक और साप्ताहिक किस्त पुनर्भुगतान ट्रैकर",
    importExcel: "📥 एक्सेल आयात करें",
    exportExcel: "📊 एक्सेल निर्यात करें",
    exportPdf: "📄 पीडीएफ निर्यात करें",
    addBorrower: "+ नया उधारकर्ता जोड़ें",
    logout: "लॉग आउट",
    metricPrincipal: "कुल सक्रिय मूलधन",
    metricCollection: "कुल अपेक्षित संग्रह",
    metricInterest: "मासिक अर्जित ब्याज",
    searchPlaceholder: "उधारकर्ता के नाम या फोन नंबर से खोजें...",
    tableHeader: "लेन-देन और सक्रिय ऋण",
    thDate: "ऋण लेने की तिथि और समय",
    thName: "नाम",
    thPhone: "फ़ोन",
    thPrincipal: "मूलधन",
    thInterest: "ब्याज",
    thSchedule: "अनुसूची / भुगतान",
    thMonthly: "मासिक",
    thProgress: "प्रगति",
    thStatus: "स्थिति",
    thActions: "कार्रवाई",
    modalAddTitle: "नया ऋण लेन-देन जोड़ें",
    labelBorrowerName: "उधारकर्ता का नाम",
    labelPhone: "फ़ोन नंबर",
    labelPrincipal: "मूल राशि (₹)",
    labelRate: "ब्याज दर (% प्रति माह)",
    labelSchedule: "पुनर्भुगतान आवृत्ति",
    optDaily: "दैनिक (100 दिन @ 1%/दिन)",
    optWeekly: "साप्ताहिक (15 सप्ताह @ 7%/सप्ताह)",
    btnCancel: "रद्द करें",
    btnSaveLoan: "ऋण सहेजें",
    modalEditDateTitle: "दिनांक और समय संपादित करें",
    labelSelectDateTime: "सही तिथि और समय चुनें",
    btnUpdateDate: "दिनांक अपडेट करें",
    statInstallmentAmt: "किस्त राशि:",
    statCollectedSoFar: "अब तक एकत्र:",
    statMissedDue: "बकाया राशि:",
    ledgerHint: "किस्त भुगतान की जाँच करें। बिना चेक किए गए अंतराल DUE के रूप में हाइलाइट होते हैं।",
    closeLedger: "बहीखाता बंद करें",
    profileTotalLoansLabel: "कुल लिए गए ऋण",
    profileActiveLoansLabel: "सक्रिय ऋण",
    profileTotalPrincipalLabel: "कुल मूलधन उधार",
    profileBreakdown: "संबंधित ऋण विवरण:",
    exportProfilePdf: "📄 प्रोफ़ाइल पीडीएफ डाउनलोड करें",
    closeProfile: "प्रोफ़ाइल बंद करें",
    btnConfirm: "पुष्टि करें",
    statusUpToDate: "अद्यतन (साफ)",
    statusFullyPaid: "पूर्ण भुगतान",
    running: "चालू"
  },
  ta: {
    loginTitle: "கடன் கணக்கு உள்நுழைவு",
    loginSubtitle: "கணக்கை அணுக நற்சான்றிதழ்களை உள்ளிடவும்",
    usernameLabel: "பயனர் பெயர் / மின்னஞ்சல்",
    passwordLabel: "கடவுச்சொல்",
    loginBtn: "உள்நுழைய",
    appTitle: "கடன் மேலாண்மை கணக்கு",
    appSubtitle: "தினசரி & வாராந்திர தவணை கண்காணிப்பாளர்",
    importExcel: "📥 எக்செல் இறக்குமதி",
    exportExcel: "📊 எக்செல் ஏற்றுமதி",
    exportPdf: "📄 PDF ஏற்றுமதி",
    addBorrower: "+ புதிய கடன் வாங்குபவரைச் சேர்",
    logout: "வெளியேறு",
    metricPrincipal: "மொத்த செயலில் உள்ள அசல்",
    metricCollection: "எதிர்பார்க்கப்படும் வசூல்",
    metricInterest: "மாதாந்திர வட்டி",
    searchPlaceholder: "பெயர் அல்லது தொலைபேசி எண் மூலம் தேடவும்...",
    tableHeader: "பரிவர்த்தனைகள் & செயலில் உள்ள கடன்கள்",
    thDate: "எடுக்கப்பட்ட தேதி & நேரம்",
    thName: "பெயர்",
    thPhone: "தொலைபேசி",
    thPrincipal: "அசல்",
    thInterest: "வட்டி",
    thSchedule: "அட்டவணை / தவணை",
    thMonthly: "மாதாந்திரம்",
    thProgress: "முன்னேற்றம்",
    thStatus: "நிலை",
    thActions: "செயல்கள்",
    modalAddTitle: "புதிய கடன் பரிவர்த்தனை சேர்க்க",
    labelBorrowerName: "பெயர்",
    labelPhone: "தொலைபேசி எண்",
    labelPrincipal: "அசல் தொகை (₹)",
    labelRate: "வட்டி விகிதம் (% மாதம்)",
    labelSchedule: "தவணை முறை",
    optDaily: "தினசரி (100 நாட்கள் @ 1%/நாள்)",
    optWeekly: "வாராந்திரம் (15 வாரங்கள் @ 7%/வாரம்)",
    btnCancel: "ரத்து செய்",
    btnSaveLoan: "சேமி",
    modalEditDateTitle: "தேதி & நேரத்தைத் திருத்து",
    labelSelectDateTime: "சரியான தேதியைத் தேர்ந்தெடுக்கவும்",
    btnUpdateDate: "தேதியை மாற்று",
    statInstallmentAmt: "தவணை தொகை:",
    statCollectedSoFar: "இதுவரை வசூலிக்கப்பட்டது:",
    statMissedDue: "செலுத்த வேண்டிய தொகை:",
    ledgerHint: "தவணைகளைச் சரிபார்க்கவும். தவறவிட்டவை DUE எனக் காட்டும்.",
    closeLedger: "மூடு",
    profileTotalLoansLabel: "மொத்த கடன்கள்",
    profileActiveLoansLabel: "நடப்பு கடன்கள்",
    profileTotalPrincipalLabel: "மொத்த அசல் கடன்",
    profileBreakdown: "கடன் விவரங்கள்:",
    exportProfilePdf: "📄 சுயவிவர PDF பதிவிறக்கு",
    closeProfile: "சுயவிவரத்தை மூடு",
    btnConfirm: "உறுதிப்படுத்து",
    statusUpToDate: "சரியாக உள்ளது",
    statusFullyPaid: "முழுமையாக செலுத்தப்பட்டது",
    running: "நடப்பில் உள்ளது"
  }
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.textContent = t[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) {
      el.placeholder = t[key];
    }
  });
}

document.getElementById('langSelect').addEventListener('change', (e) => {
  setLanguage(e.target.value);
});

const firebaseConfig = {
  apiKey: "AIzaSyB9bi0uFN0u8ZfG5skhvpV3VqUpBjPlM2I",
  authDomain: "loan-management-dashboard.firebaseapp.com",
  projectId: "loan-management-dashboard",
  storageBucket: "loan-management-dashboard.firebasestorage.app",
  messagingSenderId: "416989781777",
  appId: "1:416989781777:web:cc69cfc0222626a5c3b6b0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginContainer = document.getElementById('loginContainer');
const appContainer = document.getElementById('appContainer');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.style.display = 'none';
  try {
    await signInWithEmailAndPassword(auth, usernameInput.value.trim(), passwordInput.value.trim());
  } catch (error) {
    loginError.textContent = "Invalid Email or Password";
    loginError.style.display = 'block';
  }
});

logoutBtn.addEventListener('click', () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginContainer.style.display = 'none';
    appContainer.style.display = 'flex';
    listenToLoans();
  } else {
    appContainer.style.display = 'none';
    loginContainer.style.display = 'flex';
    usernameInput.value = '';
    passwordInput.value = '';
  }
});

let loanDataStore = {};
let currentLedgerLoanId = null;
let activeProfilePhone = null;
let activeProfileName = null;
let activeDateTextElement = null;

const modalOverlay = document.getElementById('modalOverlay');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const borrowerForm = document.getElementById('borrowerForm');
const borrowerTableBody = document.getElementById('borrowerTableBody');

const editModalOverlay = document.getElementById('editModalOverlay');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');
const editDateForm = document.getElementById('editDateForm');

const ledgerModalOverlay = document.getElementById('ledgerModalOverlay');
const closeLedgerModalBtn = document.getElementById('closeLedgerModalBtn');
const ledgerGrid = document.getElementById('ledgerGrid');

const borrowerProfileModalOverlay = document.getElementById('borrowerProfileModalOverlay');
const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');

const confirmModalOverlay = document.getElementById('confirmModalOverlay');
const confirmTitle = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');
const confirmOkBtn = document.getElementById('confirmOkBtn');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');

function showCustomConfirm({ title, message, confirmText = "Confirm", isDanger = false, onConfirm, onCancel }) {
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;
  confirmOkBtn.textContent = confirmText;
  confirmOkBtn.className = isDanger ? 'btn-danger' : 'btn-primary';

  confirmModalOverlay.style.display = 'flex';

  confirmOkBtn.onclick = () => {
    confirmModalOverlay.style.display = 'none';
    if (onConfirm) onConfirm();
  };

  confirmCancelBtn.onclick = () => {
    confirmModalOverlay.style.display = 'none';
    if (onCancel) onCancel();
  };
}

function listenToLoans() {
  onSnapshot(collection(db, "loans"), (snapshot) => {
    loanDataStore = {};
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const loanId = docSnap.id;
      const startDate = data.startDate ? new Date(data.startDate) : new Date();

      loanDataStore[loanId] = {
        id: loanId,
        name: data.name,
        phone: data.phone,
        principal: Number(data.principal),
        rate: Number(data.rate),
        schedule: data.schedule,
        startDate: startDate,
        isCompleted: data.isCompleted || false,
        paidDays: data.paidDays || {}
      };
    });

    renderFilteredLoans();
    updateDashboardTotals();
  });
}

searchInput.addEventListener('input', () => {
  renderFilteredLoans();
});

function renderFilteredLoans() {
  borrowerTableBody.innerHTML = '';
  const filterText = searchInput.value.toLowerCase().trim();

  for (const id in loanDataStore) {
    const loan = loanDataStore[id];
    const matchName = loan.name.toLowerCase().includes(filterText);
    const matchPhone = loan.phone.toLowerCase().includes(filterText);

    if (!filterText || matchName || matchPhone) {
      renderRowInTable(loan);
    }
  }
}

function renderRowInTable(loan) {
  const isWeekly = loan.schedule === 'weekly';
  const installmentPay = isWeekly ? loan.principal * 0.07 : loan.principal * 0.01;
  const maxSlots = isWeekly ? 15 : 100;
  const monthlyInterest = (loan.principal * loan.rate) / 100;
  const currentDateTime = formatDateTime(loan.startDate);
  const t = translations[currentLang];

  const newRow = document.createElement('tr');
  newRow.setAttribute('data-id', loan.id);
  newRow.setAttribute('data-principal', loan.principal);
  newRow.setAttribute('data-rate', loan.rate);

  newRow.innerHTML = `
    <td>
      <div class="date-cell-content">
        <span class="date-text"><strong>${currentDateTime}</strong></span>
        <span class="inline-edit-icon" title="Edit Date & Time">✏️</span>
      </div>
    </td>
    <td>
      <button class="btn-profile-link" title="View Borrower Loan History">${loan.name}</button>
    </td>
    <td>${loan.phone}</td>
    <td>₹${loan.principal.toLocaleString('en-IN')}</td>
    <td>${loan.rate}%/mo</td>
    <td>₹${installmentPay.toLocaleString('en-IN')} / ${isWeekly ? 'weekly' : 'daily'}</td>
    <td>₹${monthlyInterest.toLocaleString('en-IN')}</td>
    <td class="progress-cell">0 / ${maxSlots}</td>
    <td class="status-cell"><span class="badge badge-paid">${t.statusUpToDate}</span></td>
    <td>
      <div class="action-group">
        <button class="action-btn btn-ledger">Ledger</button>
        <button class="action-btn btn-complete" title="Mark Complete">✓</button>
        <button class="action-btn btn-delete" title="Delete Borrower">🗑️</button>
      </div>
    </td>
  `;

  newRow.querySelector('.inline-edit-icon').onclick = function() { openEditModal(this); };
  newRow.querySelector('.btn-profile-link').onclick = function() { openBorrowerProfileModal(loan.phone, loan.name); };
  newRow.querySelector('.btn-ledger').onclick = function() { openLedgerModal(loan.id); };
  newRow.querySelector('.btn-complete').onclick = function() { markLoanCompleted(loan.id); };
  newRow.querySelector('.btn-delete').onclick = function() { deleteLoan(loan.id); };

  borrowerTableBody.appendChild(newRow);
  updateRowProgressAndStatus(loan);
}

function openBorrowerProfileModal(phone, name) {
  activeProfilePhone = phone;
  activeProfileName = name;
  document.getElementById('profileModalTitle').textContent = `Loan History Profile: ${name} (${phone})`;
  
  const borrowerLoans = Object.values(loanDataStore).filter(loan => loan.phone.trim() === phone.trim());
  
  let totalPrincipal = 0;
  let activeCount = 0;

  borrowerLoans.forEach(loan => {
    totalPrincipal += loan.principal;
    const isWeekly = loan.schedule === 'weekly';
    const totalSlots = isWeekly ? 15 : 100;
    let paidCount = Object.keys(loan.paidDays || {}).length;
    
    if (!loan.isCompleted && paidCount < totalSlots) {
      activeCount++;
    }
  });

  document.getElementById('profileTotalLoans').textContent = borrowerLoans.length;
  document.getElementById('profileActiveLoans').textContent = activeCount;
  document.getElementById('profileTotalPrincipal').textContent = `₹${totalPrincipal.toLocaleString('en-IN')}`;

  const listContainer = document.getElementById('profileLoansList');
  listContainer.innerHTML = '';
  const t = translations[currentLang];

  borrowerLoans.forEach((loan, index) => {
    const isWeekly = loan.schedule === 'weekly';
    const totalSlots = isWeekly ? 15 : 100;
    let paidCount = Object.keys(loan.paidDays || {}).length;
    let isCompleted = loan.isCompleted || paidCount === totalSlots;

    const itemCard = document.createElement('div');
    itemCard.className = 'borrower-loan-item-card';

    itemCard.innerHTML = `
      <div>
        <strong>Loan #${index + 1}: ₹${loan.principal.toLocaleString('en-IN')} (${isWeekly ? 'Weekly' : 'Daily'})</strong>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Taken: ${formatDateTime(loan.startDate)}</div>
      </div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <span class="badge ${isCompleted ? 'badge-completed' : 'badge-paid'}">${isCompleted ? t.statusFullyPaid : t.running}</span>
        <button class="action-btn" style="padding: 4px 10px;" onclick="window.openSpecificLedger('${loan.id}')">View Ledger</button>
      </div>
    `;
    listContainer.appendChild(itemCard);
  });

  borrowerProfileModalOverlay.style.display = 'flex';
}

window.openSpecificLedger = function(loanId) {
  borrowerProfileModalOverlay.style.display = 'none';
  openLedgerModal(loanId);
};

closeProfileModalBtn.addEventListener('click', () => {
  borrowerProfileModalOverlay.style.display = 'none';
});

function updateRowProgressAndStatus(loan) {
  const row = borrowerTableBody.querySelector(`tr[data-id="${loan.id}"]`);
  if (!row) return;

  const isWeekly = loan.schedule === 'weekly';
  const totalSlots = isWeekly ? 15 : 100;
  const t = translations[currentLang];

  const now = new Date();
  const startDate = new Date(loan.startDate);
  now.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  const diffTime = Math.max(0, now - startDate);
  const intervalDays = isWeekly ? 7 : 1;
  const elapsedSlots = Math.min(totalSlots, Math.floor(diffTime / (1000 * 60 * 60 * 24 * intervalDays)) + 1);

  let paidCount = 0;
  let missedCount = 0;

  for (let slot = 1; slot <= totalSlots; slot++) {
    const isChecked = !!loan.paidDays[slot];
    const isPastSlot = slot <= elapsedSlots;
    const isMissed = isPastSlot && !isChecked && !loan.isCompleted;

    if (isChecked) paidCount++;
    else if (isMissed) missedCount++;
  }

  row.querySelector('.progress-cell').textContent = `${paidCount} / ${totalSlots}`;
  const statusTd = row.querySelector('.status-cell');
  
  if (loan.isCompleted || paidCount === totalSlots) {
    statusTd.innerHTML = `<span class="badge badge-completed">${t.statusFullyPaid}</span>`;
  } else if (missedCount > 0) {
    statusTd.innerHTML = `<span class="badge badge-overdue">${missedCount} Due</span>`;
  } else {
    statusTd.innerHTML = `<span class="badge badge-paid">${t.statusUpToDate}</span>`;
  }
}

function updateDashboardTotals() {
  let sumPrincipal = 0;
  let sumExpectedInstallments = 0;
  let sumMonthlyInterest = 0;

  for (const id in loanDataStore) {
    const loan = loanDataStore[id];
    const principal = loan.principal || 0;
    const rate = loan.rate || 0;

    sumPrincipal += principal;
    sumMonthlyInterest += (principal * rate) / 100;

    if (loan.schedule === 'weekly') {
      sumExpectedInstallments += (principal * 0.07);
    } else {
      sumExpectedInstallments += (principal * 0.01);
    }
  }

  document.getElementById('totalPrincipal').textContent = `₹${sumPrincipal.toLocaleString('en-IN')}`;
  document.getElementById('totalDailyPay').textContent = `₹${sumExpectedInstallments.toLocaleString('en-IN')}`;
  document.getElementById('totalMonthlyInterest').textContent = `₹${sumMonthlyInterest.toLocaleString('en-IN')}`;
}

function formatDateTime(dateObj) {
  return dateObj.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });
}

openModalBtn.addEventListener('click', () => modalOverlay.style.display = 'flex');
closeModalBtn.addEventListener('click', () => modalOverlay.style.display = 'none');
closeEditModalBtn.addEventListener('click', () => editModalOverlay.style.display = 'none');
closeLedgerModalBtn.addEventListener('click', () => ledgerModalOverlay.style.display = 'none');

borrowerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('nameInput').value;
  const phone = document.getElementById('phoneInput').value;
  const principal = parseFloat(document.getElementById('principalInput').value);
  const rate = parseFloat(document.getElementById('rateInput').value);
  const schedule = document.getElementById('scheduleInput').value;

  await addDoc(collection(db, "loans"), {
    name,
    phone,
    principal,
    rate,
    schedule,
    startDate: new Date().toISOString(),
    isCompleted: false,
    paidDays: {}
  });

  borrowerForm.reset();
  modalOverlay.style.display = 'none';
});

function openEditModal(iconElement) {
  const parentContainer = iconElement.closest('.date-cell-content');
  activeDateTextElement = parentContainer.querySelector('.date-text');
  const row = iconElement.closest('tr');
  currentLedgerLoanId = row.getAttribute('data-id');
  editModalOverlay.style.display = 'flex';
}

editDateForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const editDateTimeInput = document.getElementById('editDateTimeInput');

  if (editDateTimeInput.value && currentLedgerLoanId) {
    const selectedDate = new Date(editDateTimeInput.value);
    await updateDoc(doc(db, "loans", currentLedgerLoanId), {
      startDate: selectedDate.toISOString()
    });
  }
  editDateForm.reset();
  editModalOverlay.style.display = 'none';
});

function markLoanCompleted(id) {
  const loan = loanDataStore[id];
  if (!loan) return;

  const maxSlots = loan.schedule === 'weekly' ? 15 : 100;
  showCustomConfirm({
    title: "Complete Loan",
    message: `Mark loan for "${loan.name}" as fully completed (100% Paid)?`,
    confirmText: "Mark Completed",
    isDanger: false,
    onConfirm: async () => {
      const paidDays = {};
      for (let slot = 1; slot <= maxSlots; slot++) paidDays[slot] = true;
      await updateDoc(doc(db, "loans", id), {
        isCompleted: true,
        paidDays: paidDays
      });
    }
  });
}

function deleteLoan(id) {
  const loan = loanDataStore[id];
  if (!loan) return;

  showCustomConfirm({
    title: "Delete Borrower",
    message: `Are you sure you want to permanently delete "${loan.name}" from records?`,
    confirmText: "Delete",
    isDanger: true,
    onConfirm: async () => {
      await deleteDoc(doc(db, "loans", id));
    }
  });
}

function openLedgerModal(id) {
  currentLedgerLoanId = id;
  const loan = loanDataStore[id];
  if (!loan) return;

  const typeLabel = loan.schedule === 'weekly' ? '15-Week' : '100-Day';
  document.getElementById('ledgerBorrowerTitle').textContent = `${typeLabel} Ledger: ${loan.name}`;
  renderLedgerGrid(loan);
  ledgerModalOverlay.style.display = 'flex';
}

function renderLedgerGrid(loan) {
  ledgerGrid.innerHTML = '';
  const isWeekly = loan.schedule === 'weekly';
  const totalSlots = isWeekly ? 15 : 100;
  const installmentAmount = isWeekly ? (loan.principal * 0.07) : (loan.principal * 0.01);

  const now = new Date();
  const startDate = new Date(loan.startDate);
  now.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  const diffTime = Math.max(0, now - startDate);
  const intervalDays = isWeekly ? 7 : 1;
  const elapsedSlots = Math.min(totalSlots, Math.floor(diffTime / (1000 * 60 * 60 * 24 * intervalDays)) + 1);

  let paidCount = 0;
  let missedCount = 0;

  for (let slot = 1; slot <= totalSlots; slot++) {
    const isChecked = !!loan.paidDays[slot];
    const isPastSlot = slot <= elapsedSlots;
    const isMissed = isPastSlot && !isChecked && !loan.isCompleted;

    if (isChecked) paidCount++;
    else if (isMissed) missedCount++;

    const slotDate = new Date(loan.startDate);
    const dayOffset = (slot - 1) * (isWeekly ? 7 : 1);
    slotDate.setDate(slotDate.getDate() + dayOffset);
    const formattedSlotDate = slotDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' });

    const slotBox = document.createElement('div');
    slotBox.className = `day-box ${isChecked ? 'paid' : (isMissed ? 'missed' : '')}`;

    const labelPrefix = isWeekly ? 'Wk' : 'Day';

    slotBox.innerHTML = `
      <span class="day-number">${labelPrefix} ${slot}</span>
      <span class="day-date">${formattedSlotDate}</span>
      <input type="checkbox" ${isChecked ? 'checked' : ''}>
      <span class="day-amount">${isMissed ? 'DUE' : '₹' + installmentAmount.toLocaleString('en-IN')}</span>
    `;

    const checkbox = slotBox.querySelector('input');
    checkbox.addEventListener('change', (e) => {
      handleSlotToggle(loan.id, slot, e.target);
    });

    ledgerGrid.appendChild(slotBox);
  }

  document.getElementById('statDailyAmount').textContent = `₹${installmentAmount.toLocaleString('en-IN')} (${isWeekly ? 'Weekly' : 'Daily'})`;
  document.getElementById('statCollected').textContent = `₹${(paidCount * installmentAmount).toLocaleString('en-IN')} (${paidCount}/${totalSlots} ${isWeekly ? 'Wks' : 'Days'})`;
  document.getElementById('statDue').textContent = `₹${(missedCount * installmentAmount).toLocaleString('en-IN')} (${missedCount} ${isWeekly ? 'Wks' : 'Days'})`;

  updateRowProgressAndStatus(loan);
}

function handleSlotToggle(loanId, slot, checkboxElement) {
  const loan = loanDataStore[loanId];
  const slotLabel = loan && loan.schedule === 'weekly' ? `Week ${slot}` : `Day ${slot}`;

  if (!checkboxElement.checked) {
    checkboxElement.checked = true;

    showCustomConfirm({
      title: `Uncheck Payment ${slotLabel}`,
      message: `Are you sure you want to uncheck ${slotLabel}? This will remove the recorded payment.`,
      confirmText: "Uncheck",
      isDanger: true,
      onConfirm: () => {
        checkboxElement.checked = false;
        toggleSlotPayment(loanId, slot, false);
      },
      onCancel: () => {
        checkboxElement.checked = true;
      }
    });
  } else {
    toggleSlotPayment(loanId, slot, true);
  }
}

async function toggleSlotPayment(loanId, slot, isChecked) {
  if (loanDataStore[loanId]) {
    const updatedPaidDays = { ...loanDataStore[loanId].paidDays };
    if (isChecked) {
      updatedPaidDays[slot] = true;
    } else {
      delete updatedPaidDays[slot];
    }
    
    const isCompleted = !isChecked && loanDataStore[loanId].isCompleted ? false : loanDataStore[loanId].isCompleted;

    await updateDoc(doc(db, "loans", loanId), {
      paidDays: updatedPaidDays,
      isCompleted: isCompleted
    });
  }
}

document.getElementById('exportAllExcelBtn').addEventListener('click', () => {
  const rows = [];
  rows.push(["Loan Management System Ledger Report"]);
  rows.push(["Generated on:", new Date().toLocaleString('en-IN')]);
  rows.push([]);
  rows.push(["Date & Time Taken", "Borrower Name", "Phone", "Principal (INR)", "Interest Rate (%/mo)", "Schedule", "Monthly Interest (INR)", "Status"]);

  for (const id in loanDataStore) {
    const loan = loanDataStore[id];
    const isWeekly = loan.schedule === 'weekly';
    const totalSlots = isWeekly ? 15 : 100;
    let paidCount = Object.keys(loan.paidDays || {}).length;
    let status = loan.isCompleted || paidCount === totalSlots ? "Fully Paid" : "Running";

    rows.push([
      formatDateTime(loan.startDate),
      loan.name,
      loan.phone,
      loan.principal,
      loan.rate,
      loan.schedule,
      (loan.principal * loan.rate) / 100,
      status
    ]);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "System Ledger");
  XLSX.writeFile(workbook, "System_Loan_Ledger.xlsx");
});

document.getElementById('exportAllPdfBtn').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const docPdf = new jsPDF();

  docPdf.setFontSize(16);
  docPdf.text("Loan Management System Ledger", 14, 20);
  docPdf.setFontSize(10);
  docPdf.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 26);

  const tableRows = [];
  for (const id in loanDataStore) {
    const loan = loanDataStore[id];
    const isWeekly = loan.schedule === 'weekly';
    const totalSlots = isWeekly ? 15 : 100;
    let paidCount = Object.keys(loan.paidDays || {}).length;
    let status = loan.isCompleted || paidCount === totalSlots ? "Fully Paid" : "Running";

    tableRows.push([
      formatDateTime(loan.startDate),
      loan.name,
      loan.phone,
      `Rs.${loan.principal.toLocaleString('en-IN')}`,
      `${loan.rate}%`,
      loan.schedule,
      status
    ]);
  }

  docPdf.autoTable({
    startY: 32,
    head: [['Date Taken', 'Name', 'Phone', 'Principal', 'Interest', 'Schedule', 'Status']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [44, 101, 161] }
  });

  docPdf.save("System_Loan_Ledger.pdf");
});

document.getElementById('exportSingleExcelBtn').addEventListener('click', () => {
  if (!currentLedgerLoanId || !loanDataStore[currentLedgerLoanId]) return;
  const loan = loanDataStore[currentLedgerLoanId];

  const isWeekly = loan.schedule === 'weekly';
  const totalSlots = isWeekly ? 15 : 100;
  const installmentAmount = isWeekly ? (loan.principal * 0.07) : (loan.principal * 0.01);

  const rows = [];
  rows.push([`Individual Loan Ledger: ${loan.name}`]);
  rows.push(["Phone:", loan.phone, "Principal:", loan.principal]);
  rows.push(["Schedule:", loan.schedule, "Date Taken:", formatDateTime(loan.startDate)]);
  rows.push([]);
  rows.push(["Installment #", "Due Date", "Payment Status", "Installment Amount (INR)"]);

  for (let slot = 1; slot <= totalSlots; slot++) {
    const isChecked = !!loan.paidDays[slot];
    const slotDate = new Date(loan.startDate);
    const dayOffset = (slot - 1) * (isWeekly ? 7 : 1);
    slotDate.setDate(slotDate.getDate() + dayOffset);
    
    rows.push([
      `${isWeekly ? 'Week' : 'Day'} ${slot}`,
      slotDate.toLocaleDateString('en-IN'),
      isChecked ? "Paid" : "Due / Unpaid",
      installmentAmount
    ]);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Borrower Ledger");
  XLSX.writeFile(workbook, `${loan.name.replace(/\s+/g, '_')}_Ledger.xlsx`);
});

document.getElementById('exportSinglePdfBtn').addEventListener('click', () => {
  if (!currentLedgerLoanId || !loanDataStore[currentLedgerLoanId]) return;
  const loan = loanDataStore[currentLedgerLoanId];

  const { jsPDF } = window.jspdf;
  const docPdf = new jsPDF();

  const isWeekly = loan.schedule === 'weekly';
  const totalSlots = isWeekly ? 15 : 100;
  const installmentAmount = isWeekly ? (loan.principal * 0.07) : (loan.principal * 0.01);

  docPdf.setFontSize(16);
  docPdf.text(`Borrower Ledger: ${loan.name}`, 14, 20);
  docPdf.setFontSize(10);
  docPdf.text(`Phone: ${loan.phone} | Principal: Rs.${loan.principal.toLocaleString('en-IN')} | Frequency: ${loan.schedule}`, 14, 26);
  docPdf.text(`Date Taken: ${formatDateTime(loan.startDate)}`, 14, 32);

  const tableRows = [];
  for (let slot = 1; slot <= totalSlots; slot++) {
    const isChecked = !!loan.paidDays[slot];
    const slotDate = new Date(loan.startDate);
    const dayOffset = (slot - 1) * (isWeekly ? 7 : 1);
    slotDate.setDate(slotDate.getDate() + dayOffset);

    tableRows.push([
      `${isWeekly ? 'Week' : 'Day'} ${slot}`,
      slotDate.toLocaleDateString('en-IN'),
      isChecked ? "Paid" : "Unpaid / Due",
      `Rs.${installmentAmount.toLocaleString('en-IN')}`
    ]);
  }

  docPdf.autoTable({
    startY: 38,
    head: [['Installment', 'Due Date', 'Status', 'Amount']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [91, 156, 191] }
  });

  docPdf.save(`${loan.name.replace(/\s+/g, '_')}_Ledger.pdf`);
});

document.getElementById('exportProfilePdfBtn').addEventListener('click', () => {
  if (!activeProfilePhone) return;
  const borrowerLoans = Object.values(loanDataStore).filter(loan => loan.phone.trim() === activeProfilePhone.trim());
  if (borrowerLoans.length === 0) return;

  const { jsPDF } = window.jspdf;
  const docPdf = new jsPDF();

  docPdf.setFontSize(16);
  docPdf.text(`Borrower Profile History: ${activeProfileName}`, 14, 20);
  docPdf.setFontSize(10);
  docPdf.text(`Phone Number: ${activeProfilePhone} | Total Loans Taken: ${borrowerLoans.length}`, 14, 26);

  const tableRows = [];
  borrowerLoans.forEach((loan, index) => {
    const isWeekly = loan.schedule === 'weekly';
    const totalSlots = isWeekly ? 15 : 100;
    let paidCount = Object.keys(loan.paidDays || {}).length;
    let status = loan.isCompleted || paidCount === totalSlots ? "Fully Paid" : "Running";

    tableRows.push([
      `Loan #${index + 1}`,
      formatDateTime(loan.startDate),
      `Rs.${loan.principal.toLocaleString('en-IN')}`,
      `${loan.rate}%/mo`,
      loan.schedule,
      status,
      `${paidCount}/${totalSlots} Paid`
    ]);
  });

  docPdf.autoTable({
    startY: 34,
    head: [['Loan Ref', 'Date Taken', 'Principal', 'Interest', 'Schedule', 'Status', 'Progress']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [44, 101, 161] }
  });

  docPdf.save(`${activeProfileName.replace(/\s+/g, '_')}_Profile_History.pdf`);
});

const importExcelBtn = document.getElementById('importExcelBtn');
const excelFileInput = document.getElementById('excelFileInput');

importExcelBtn.addEventListener('click', () => {
  excelFileInput.click();
});

excelFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(event) {
    try {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      let importedCount = 0;
      let skippedCount = 0;
      
      const existingLoans = Object.values(loanDataStore);

      for (let i = 4; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row && row.length >= 6) {
          const name = String(row[1] || '').trim();
          const phone = String(row[2] || '').trim();
          const principal = parseFloat(row[3]);
          const rate = parseFloat(row[4]);
          const schedule = String(row[5]).toLowerCase().includes('week') ? 'weekly' : 'daily';
          const rowDateStr = row[0] ? new Date(row[0]).toISOString() : null;

          if (name && !isNaN(principal)) {
            const isDuplicate = existingLoans.some(loan => {
              const matchesBasic = loan.name.toLowerCase() === name.toLowerCase() &&
                                   loan.phone === phone &&
                                   loan.principal === principal;
              if (!matchesBasic) return false;
              
              if (rowDateStr) {
                return new Date(loan.startDate).getTime() === new Date(rowDateStr).getTime();
              }
              return false;
            });

            if (!isDuplicate) {
              await addDoc(collection(db, "loans"), {
                name: name,
                phone: phone,
                principal: principal,
                rate: isNaN(rate) ? 2.0 : rate,
                schedule: schedule,
                startDate: rowDateStr || new Date().toISOString(),
                isCompleted: false,
                paidDays: {}
              });
              importedCount++;
            } else {
              skippedCount++;
            }
          }
        }
      }

      showCustomConfirm({
        title: "Database Import Complete",
        message: `Successfully imported ${importedCount} new loan record(s) to the database. Skipped ${skippedCount} duplicate entry(ies).`,
        confirmText: "OK",
        isDanger: false
      });
    } catch (err) {
      console.error("Import error:", err);
      showCustomConfirm({
        title: "Import Error",
        message: "Failed to parse and import the Excel file. Please ensure it matches the ledger template format.",
        confirmText: "OK",
        isDanger: true
      });
    } finally {
      excelFileInput.value = '';
    }
  };

  reader.readAsArrayBuffer(file);
});