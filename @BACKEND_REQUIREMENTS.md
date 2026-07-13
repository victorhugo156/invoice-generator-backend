# Backend Requirements Summary

## Functional Requirements

### Account and Profile
- The backend must support user account creation.
- The backend must support user authentication.
- The backend must store personal information required for invoice generation.
- The backend must store company information required for invoice generation.

### Image Processing
- The backend must accept uploaded timesheet screenshot images.
- The backend must integrate with Google Gemini 1.5 Flash for OCR processing.
- The backend must extract `totalHours` from uploaded screenshots.
- The backend must extract `dailyHours` from uploaded screenshots.
- The backend must provide a `confidence` score for the OCR result.
- The backend must allow the frontend to fetch OCR results for user review before invoice finalization.

### Invoice Management
- The backend must generate invoice data from extracted hours and user profile information.
- The backend must automatically increment the invoice number based on the last session or latest saved invoice.
- The backend must calculate total pay dynamically from hours and pay rate.
- The backend must support manual override of extracted hours.
- The backend must support extra hours adjustments.
- The backend must support bonus adjustments.
- The backend must support extra service description and amount adjustments.
- The backend must support manual override of pay rates.
- The backend must support invoice preview data before final save/export.
- The backend must persist invoice records in Postgres.

### Export and Communication
- The backend must provide all invoice data required for PDF generation by the frontend.
- The backend must generate a `mailto:` payload with pre-filled recipient, subject, and body for HR communication.
- The backend must support the email flow used by an external tool that attaches the generated PDF.

## Business Rules

- The default HR recipient email is `hr@printforce.com.au` unless overridden by the user or company configuration.
- The invoice number must always be unique per invoice.
- The next invoice number must be based on the last generated or stored invoice number.
- Total pay must be calculated using the formula `Hours * Rate`.
- Final invoice total may include:
  - extracted worked hours
  - manual extra hours
  - bonus amount
  - extra service amount
- Users must be able to review and edit extracted values before invoice finalization.
- Uploaded images must be processed for OCR and must not be stored permanently on the server.
- Invoice generation depends on the user having completed registration/profile information needed for invoice output.
- OCR should prioritize the `Page Total` value when determining total worked hours.
- The backend is responsible for returning structured data for a 3-step workflow: upload, review, and success/finalize.

## Non Functional Requirements

- OCR extraction should complete in under 5 seconds under normal conditions.
- The system should help achieve more than 95% accuracy for extracting `Page Total` hours from screenshots.
- The backend must be implemented with Node.js, TypeScript, Fastify, and Zod.
- The backend must use Postgres as its database.
- The backend must support Docker-based local database setup.
- The API should be suitable for a mobile-first frontend flow.
- The system must protect user privacy by avoiding permanent storage of uploaded screenshots.
- The API should return validation-friendly and frontend-friendly structured responses.
- The backend should be organized in a way that supports future enhancements such as:
  - secure multi-user auth
  - historical invoice storage
  - expense tracking
