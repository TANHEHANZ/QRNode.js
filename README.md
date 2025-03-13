# QR Document Signing Server

A Node.js server that adds digital signatures to PDF documents using QR codes. This server allows you to embed QR codes and verification text as digital stamps on PDF documents.

## Features

- PDF Document Signing with QR Codes
- Customizable QR Code Positioning
- Vertical Text Stamps
- Timestamp Generation
- Container-based Sizing for Consistent Stamps
- Base64 PDF Processing

## API Endpoints

### POST /qr-pdf

Adds a QR code signature to a PDF document.

**Request Body:**

```json
{
  "pdfBase64": "base64_encoded_pdf_string",
  "url": "https://verification-url.com",
  "position": {
    "x": 50,
    "y": 50
  },
  "containerSize": {
    "width": 200,
    "height": 100
  },
  "selloText": "Document Verification"
}
```

ejecutar servidor

```bash

npm start

```
