import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { PDFDocument as PDFLib } from "pdf-lib";

export const pdf = async (req: Request, res: Response) => {
  try {
    const {
      pdfBase64,
      url,
      position = { x: 0, y: 0 },
      widthQR = { w: 0, h: 0 },
    } = req.body;

    if (!pdfBase64) {
      res.status(400).send("No PDF data provided");
      return;
    }

    const qrImage = await QRCode.toDataURL(
      url || "No se registro la url del documento"
    );
    const pdfBuffer = Buffer.from(pdfBase64, "base64");
    const pdfDoc = await PDFLib.load(pdfBuffer);

    // Convert QR code to PNG format
    const qrImageBytes = Buffer.from(qrImage.split(",")[1], "base64");
    const qrImageEmbed = await pdfDoc.embedPng(qrImageBytes);

    // Add QR code to each page
    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      page.drawImage(qrImageEmbed, {
        x: position.x,
        y: height - position.y - 100, // Adjust size as needed
        width: widthQR.w || 100, // QR code width
        height: widthQR.h || 100, // QR code height
      });
    });

    const modifiedPdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=pdf-with-qr.pdf"
    );
    res.send(Buffer.from(modifiedPdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing PDF with QR code");
  }
};
