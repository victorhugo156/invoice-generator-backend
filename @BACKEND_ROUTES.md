# Backend Routes Reference

## Overview

This file lists the suggested backend routes for the invoice automation project based on the PRD. These routes are grouped by feature so you can implement them step by step during your studies.

## Auth Routes

### `POST /auth/register`
- Purpose: Create a new user account.
- Body:
```json
{
  "name": "Victor Hugo",
  "email": "victor@email.com",
  "password": "123456"
}
```
- Response:
```json
{
  "user": {
    "id": "user_id",
    "name": "Victor Hugo",
    "email": "victor@email.com"
  },
  "token": "jwt_token"
}
```

### `POST /auth/login`
- Purpose: Authenticate an existing user.
- Body:
```json
{
  "email": "victor@email.com",
  "password": "123456"
}
```
- Response:
```json
{
  "user": {
    "id": "user_id",
    "name": "Victor Hugo",
    "email": "victor@email.com"
  },
  "token": "jwt_token"
}
```

### `GET /auth/me`
- Purpose: Return the authenticated user data.
- Headers:
```http
Authorization: Bearer <token>
```

## Profile Routes

### `GET /profile`
- Purpose: Return the user profile and company information used for invoice generation.

### `PUT /profile`
- Purpose: Create or update the user profile and company details.
- Body:
```json
{
  "phone": "0400000000",
  "address": "Sydney, Australia",
  "abn": "12 345 678 901",
  "employeeId": "EMP-001",
  "hourlyRate": 45,
  "invoicePrefix": "INV",
  "companyName": "Printforce",
  "companyAddress": "Company address",
  "companyAbn": "98 765 432 100",
  "companyContactEmail": "finance@company.com",
  "hrEmail": "hr@printforce.com.au"
}
```

## OCR Routes

### `POST /ocr/extract`
- Purpose: Upload a screenshot and extract worked hours with Gemini OCR.
- Content-Type: `multipart/form-data`
- Form data:
  - `file`: image file
- Response:
```json
{
  "screenshotFileName": "timesheet.png",
  "screenshotMimeType": "image/png",
  "totalHours": 76,
  "confidence": 97,
  "dailyHours": [
    {
      "date": "2026-03-01",
      "hours": 8
    }
  ]
}
```

## Invoice Routes

### `GET /invoices/next-number`
- Purpose: Return the next invoice number for preview/finalization.
- Response:
```json
{
  "invoiceNumber": "INV-0001"
}
```

### `POST /invoices/preview`
- Purpose: Calculate invoice totals before saving the invoice.
- Body:
```json
{
  "extractedHours": 76,
  "dailyHours": [
    {
      "date": "2026-03-01",
      "hours": 8
    }
  ],
  "hourlyRate": 45,
  "extraHours": 2,
  "bonusAmount": 100,
  "extraServiceLabel": "Weekend support",
  "extraServiceAmount": 50,
  "confidence": 97,
  "issueDate": "2026-03-26T00:00:00.000Z",
  "periodStart": "2026-03-01T00:00:00.000Z",
  "periodEnd": "2026-03-14T00:00:00.000Z",
  "notes": "Fortnightly invoice"
}
```
- Response:
```json
{
  "invoiceNumber": "INV-0001",
  "totalHours": 78,
  "hourlyRate": 45,
  "subtotalAmount": 3510,
  "bonusAmount": 100,
  "extraServiceAmount": 50,
  "totalAmount": 3660
}
```

### `POST /invoices`
- Purpose: Save a draft or final invoice.
- Body:
```json
{
  "extractedHours": 76,
  "dailyHours": [
    {
      "date": "2026-03-01",
      "hours": 8
    }
  ],
  "hourlyRate": 45,
  "extraHours": 2,
  "bonusAmount": 100,
  "extraServiceLabel": "Weekend support",
  "extraServiceAmount": 50,
  "confidence": 97,
  "issueDate": "2026-03-26T00:00:00.000Z",
  "periodStart": "2026-03-01T00:00:00.000Z",
  "periodEnd": "2026-03-14T00:00:00.000Z",
  "notes": "Fortnightly invoice",
  "status": "draft"
}
```
- Response:
```json
{
  "invoice": {
    "id": "invoice_id",
    "invoiceNumber": "INV-0001",
    "status": "draft"
  },
  "mailto": "mailto:hr@printforce.com.au?subject=..."
}
```

### `GET /invoices`
- Purpose: List all invoices for the authenticated user.

### `GET /invoices/:id`
- Purpose: Return a single invoice by id.

### `PATCH /invoices/:id`
- Purpose: Update a draft invoice before finalization.

## Suggested Route Order For Study

1. `POST /auth/register`
2. `POST /auth/login`
3. `GET /auth/me`
4. `PUT /profile`
5. `GET /profile`
6. `POST /invoices/preview`
7. `POST /invoices`
8. `GET /invoices`
9. `GET /invoices/:id`
10. `PATCH /invoices/:id`
11. `POST /ocr/extract`

## Notes

- Most routes except register and login should require authentication.
- OCR and invoice preview should happen before invoice finalization.
- You may decide to split profile into separate `users` and `companies` routes later if your data model grows.
- If you want a simpler first version, you can postpone `GET /invoices/:id` and `PATCH /invoices/:id` until after the main flow is working.
