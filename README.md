

https://github.com/user-attachments/assets/1c963845-1041-4f87-98be-e91dcecf2e89

# 🏦 Loan Management Ledger & Installment Tracker

[![Live Demo](https://img.shields.io/badge/Netlify-Live%20Demo-00C7B7?style=for-the-badge&logo=netlify)](https://YOUR-SITE.netlify.app)
![AI-Assisted](https://img.shields.io/badge/Developed%20with-AI%20Assist-8A2BE2?style=for-the-badge&logo=openai)

A responsive, full-stack loan management dashboard designed to track daily and weekly installment collections, calculate dynamic interest rates, and generate exportable accounting reports.

## 🤖 AI-Assisted Development
This project was built leveraging Generative AI tools (ChatGPT / Gemini) to accelerate the software development lifecycle:
- **Architectural Design & Logic**: Promoted optimal state management and dynamic repayment algorithms (daily vs. weekly schedule models).
- **Code Optimization & Debugging**: Leveraged AI for rapid troubleshooting of async Firebase transactions, module scope handling, and library integrations.
- **Localization & Features**: Assisted in setting up structured JSON dictionary mappings for multi-language (i18n) rendering across English, Telugu, Hindi, and Tamil.

---

## 🔗 Quick Links
- **Live Site:** [https://loan-ledger-management.netlify.app/](https://loan-ledger-management.netlify.app/)
- **Repository:** [https://github.com/Mohansaibevara/Loan-Management-Ledger-Installment-Tracker.git](https://github.com/Mohansaibevara/Loan-Management-Ledger-Installment-Tracker.git)

---

## ✨ Key Features
- **Real-Time Data Syncing**: Instant database updates using Firebase Firestore `onSnapshot` listeners.
- **Dynamic Repayment Schedules**: Auto-calculates daily (100 days @ 1%/day) and weekly (15 weeks @ 7%/week) payment plans.
- **Multilingual Support (i18n)**: Instant UI translation for English, Telugu (తెలుగు), Hindi (हिन्दी), and Tamil (தமிழ்).
- **Export & Import Suite**: 
  - Export full ledgers and single client statements to **Excel (`.xlsx`)** and **PDF (`.pdf`)**.
  - Bulk import client records directly from Excel with client deduplication logic.

---

## 🛠️ Tech Stack & Libraries
- **Frontend**: HTML5, CSS3, JavaScript (ES6 Modules)
- **Backend & Auth**: Firebase Firestore, Firebase Authentication
- **AI Tools**: ChatGPT / Gemini (Prompt Engineering, Code Refactoring, Debugging)
- **Plugins**: SheetJS (`xlsx.full.min.js`), jsPDF (`jspdf.umd.min.js`)
