import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { PDFDocument as PDFLib, rgb, degrees } from "pdf-lib";

export const pdf = async (req: Request, res: Response) => {
  try {
    const {
      pdfBase64,
      url,
      position = { x: 0, y: 0 },
      widthQR = { w: 0, h: 0 },
      selloText = "Documento firmado Digitalmente",
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
    const currentDate = new Date().toLocaleString();
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const qrWidth = widthQR.w || 100;
      const qrHeight = widthQR.h || 100;

      // Draw QR code
      page.drawImage(qrImageEmbed, {
        x: position.x,
        y: height - position.y - qrHeight,
        width: qrWidth,
        height: qrHeight,
      });

      page.drawText(selloText, {
        x: position.x + 30,
        y: height - position.y + 10,
        size: 18,
        color: rgb(0, 0, 0),
        rotate: degrees(90),
        maxWidth: 180,
      });

      page.drawText(`Generado: ${currentDate}`, {
        x: position.x + qrWidth - 20,
        y: height - position.y + 10,

        size: 8,
        color: rgb(0, 0, 0),
        rotate: degrees(90),
        maxWidth: 300,
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
