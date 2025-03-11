import express from "express";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";

const app = express();

const PORT = 3200;

app.get("/prueba", (req, res) => {
  res.send("¡Hola Mundo con Node.js y Express!");
});

app.get("/qr", async (req, res) => {
  try {
    const url = req.query.url || "https://example.com";
    const qr = await QRCode.toDataURL(url.toString());

    // Generate and print QR in console
    QRCode.toString(
      url.toString(),
      { type: "terminal" },
      function (err, QRstring) {
        if (err) throw err;
        console.log(QRstring);
      }
    );

    res.type("image/png");
    res.send(`<img src="${qr}">`);
  } catch (err) {
    res.status(500).send("Error generating QR code");
  }
});

app.get("/qr-pdf", async (req, res) => {
  try {
    const url = req.query.url || "https://example.com";
    const qrImage = await QRCode.toDataURL(url.toString());

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=qr-code.pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Your QR Code", 50, 50);

    const qrBuffer = Buffer.from(qrImage.split(",")[1], "base64");

    doc.image(qrBuffer, {
      fit: [250, 250],
      align: "center",
      valign: "center",
    });

    doc.moveDown();
    doc.fontSize(12).text(url.toString(), {
      align: "center",
    });

    doc.end();
  } catch (err) {
    res.status(500).send("Error generating PDF with QR code");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
