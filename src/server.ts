import express from "express";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"


const app = express();

app.use(express.json())

app.post('/feedbacks', async (req, res) => {

  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b11db28687d23f",
      pass: "8aa51a4e8fcf1e"
    }
  });

  const { type, comment, screenshot } = req.body

  const feedback = await prisma.feedback.create({
    data: {
      type,
      comment,
      screenshot
    }
  })

  await transport.sendMail({
    from: "Equipe Feedget <oi@feedget.com>",
    to: "Junio Resende <junioresende23@gmail.com>",
    subject: "Novo feedback",
    html: [
      `<div style="font-family: sans-serif; font-size: 16px; color: #222;">`,
      `<p>Tipo de feedback: ${type}</p>`,
      `<p>Comentário do feedback: ${comment}</p>`,
      `</div>`
    ].join("\n")
  })

  return res.status(201).send({ data: feedback })
})

app.listen(3333, () => {
  console.log("🚀 HTTP server listening on port 3333...")
});