import express from "express";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";

const app = express();
app.use(express.json({ limit: "50mb" }));
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

app.post("/qr-pdf", async (req: Request, res: Response): Promise<void> => {
  try {
    const { pdfBase64, url } = req.body;

    if (!pdfBase64) {
      return res.status(400).send("No PDF data provided");
    }

    const qrImage = await QRCode.toDataURL(url || "https://example.com");
    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=qr-code-modified.pdf"
    );

    doc.pipe(res);

    // Add QR code
    const qrBuffer = Buffer.from(qrImage.split(",")[1], "base64");

    doc.fontSize(20).text("QR Code", 50, 50);
    doc.image(qrBuffer, {
      fit: [250, 250],
      align: "center",
      valign: "center",
    });

    doc.moveDown();
    doc.fontSize(12).text(url || "https://example.com", {
      align: "center",
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing PDF with QR code");
  }
});
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
