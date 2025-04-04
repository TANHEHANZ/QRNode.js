import express from "express";
import { pdf } from "./controllerPDF";

const app = express();
app.use(express.json({ limit: "50mb" }));
const PORT = 3200;

app.get("/prueba", (req, res) => {
  res.send("¡Hola Mundo con Node.js y Express!");
});
app.post("/qr-pdf", pdf);
// app.get("/qr", async (req, res) => {
//   try {
//     const url = req.query.url || "https://example.com";
//     const qr = await QRCode.toDataURL(url.toString());

//     // Generate and print QR in console
//     QRCode.toString(
//       url.toString(),
//       { type: "terminal" },
//       function (err, QRstring) {
//         if (err) throw err;
//         console.log(QRstring);
//       }
//     );

//     res.type("image/png");
//     res.send(`<img src="${qr}">`);
//   } catch (err) {
//     res.status(500).send("Error generating QR code");
//   }
// });

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
