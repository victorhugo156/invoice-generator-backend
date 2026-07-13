# Product Requirements Document (PRD): Fortnightly Invoice Automator

## 1. Project Overview
**Project Name:** Fortnightly Invoice Automator  
**Status:** v1.0 (Production)  
**Owner:** Victor Hugo  

The **Fortnightly Invoice Automator** is a specialized productivity tool designed to streamline the manual process of generating tax invoices. It uses AI-powered Vision  to read "web clock" screenshots, extract worked hours, calculate total pay based on a predefined rate, and generate a professional PDF-ready invoice for HR submission.

---

## 2. Target Audience
*   **Primary User:** Employees.
*   **Stakeholders:** HR/Payroll Department at Printforce (Receivers of the invoice).

---

## 3. Problem Statement
Manually calculating hours from a web clock screenshot and re-typing that data into a professional invoice template is time-consuming and prone to human error. There is a need for a "one-click" solution that handles extraction, calculation, and formatting in a single flow.

---

## 4. Goals & Objectives
*   **Accuracy:** Achieve >95% accuracy in extracting "Page Total" hours from screenshots.
*   **Efficiency:** Reduce the time to generate an invoice from 10 minutes to under 60 seconds.
*   **Professionalism:** Ensure the output invoice meets Australian tax invoice standards.
*   **Simplicity:** A mobile-first, zero-friction UI for quick uploads.

---

## 5. User Stories
1.  **As a user**, I want to upload a screenshot of my timesheet so I don't have to type in my hours manually.
2.  **As a user**, I want to review and edit the extracted hours to ensure the AI didn't make a mistake.
3.  **As a user**, I want to see a live preview of my invoice before I send it.
4.  **As a user**, I want to automatically generate an email to HR with the invoice details pre-filled.

---

## 6. Functional Requirements

### 6.1 Image Processing (AI)
*   Integrate with **Google Gemini 1.5 Flash** for OCR (Optical Character Recognition).
*   Extract `totalHours` and `dailyHours` from uploaded images.
*   Provide a `confidence` score for the extraction.

### 6.2 Invoice Management
*   Automatically increment the `Invoice Number` based on the last session.
*   Calculate `Total Pay` dynamically (`Hours` * `Rate`).
*   Support manual overrides for extra hours, bonus, extra service provided and pay rates.

### 6.3 Export & Communication
*   **Print-to-PDF:** Optimized CSS to hide UI elements (buttons, headers) during printing.
*   **Email Integration:** Generate a `mailto:` link with pre-filled Subject, Body, and Recipient (`hr@printforce.com.au`), communicating with an external AI tool to automate the process, since web browsers are not allowed to attach documents into the email body.

### 6.4 UI/UX
*   3-Step Workflow: **Upload** -> **Review** -> **Success**.
*   Mobile-responsive design using Tailwind CSS.
*   Loading states during AI processing.

---

## 7. Technical Stack
*   **Frontend:** React 19, TypeScript.
*   **Styling:** Tailwind CSS (Utility-first styling).
*   **AI SDK:** `@google/genai` (Gemini API).
*   **Icons:** Font Awesome / Lucide React.
*   **Build Tool:** Vite.
*   **Backend:** Node.js, TypeScript, Fastify, Zod.
*   **Database:** Postgres, Docker

---

## 8. User Flow
1.  **Account creation:** User creates an account.
2.  **Register:** User enter with personal information and company information for Invoice generation.
3.  **Landing:** User sees a large "Upload Screenshot" button.
4.  **Upload:** User selects a file or takes a photo (mobile).
5.  **Processing:** AI extracts data; user sees a "Reading Timesheet..." spinner.
6.  **Review:** User verifies the extracted hours and pay rate.
7.  **Finalize:** User clicks "Download PDF".
8.  **Save:** User save pdf into his device.
9.  **Email:** External tool is called that attach the pdf into the email and fill it up the `mail to` with the address provided bu the user.

---

## 9. Non-Functional Requirements
*   **Performance:** AI extraction should complete in < 5 seconds.
*   **Privacy:** Images are processed via API and not stored permanently on a server.
*   **Accessibility:** High contrast text and clear button states.

---

## 10. Future Enhancements (v2.0)
*   **Database Integration:** Store historical invoices in Firebase to track yearly earnings.
*   **Auth:** Secure login for multiple users.
*   **Expense Tracking:** Ability to upload receipts alongside timesheets.
*   **Dark Mode:** Aesthetic preference for late-night invoicing.
