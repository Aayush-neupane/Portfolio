import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import nodemailer from 'nodemailer'

dotenv.config()

const app = express()
const { NODE_ENV, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL, CLIENT_ORIGIN } = process.env

app.set('trust proxy', 1)
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(
  cors({
    origin: CLIENT_ORIGIN || false,
    credentials: true,
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)
app.use(express.json({ limit: '1mb' }))

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
  }),
)

const isConfigured = Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && CONTACT_TO_EMAIL)

app.post('/api/contact', async (req, res) => {
  const { name, email, message, website } = req.body || {}

  if (website) {
    return res.status(400).json({ error: 'Spam check failed.' })
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' })
  }

  const cleanName = String(name).trim()
  const cleanEmail = String(email).trim()
  const cleanMessage = String(message).trim()

  if (cleanName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please provide a valid name and email address.' })
  }

  if (cleanMessage.length < 10 || cleanMessage.length > 2000) {
    return res.status(400).json({ error: 'Message must be between 10 and 2000 characters.' })
  }

  if (!isConfigured) {
    return res.status(503).json({
      error: 'Contact form is not configured yet. Please email contact@alshanrijal.com.np directly.',
    })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })

    const mailOptions = {
      from: `${cleanName} <${SMTP_USER}>`,
      replyTo: cleanEmail,
      to: CONTACT_TO_EMAIL,
      subject: `Portfolio enquiry from ${cleanName}`,
      text: cleanMessage,
      html: `<p><strong>Name:</strong> ${escapeHtml(cleanName)}</p><p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p><p>${escapeHtml(cleanMessage).replace(/\n/g, '<br />')}</p>`,
    }

    await transporter.sendMail(mailOptions)
    return res.json({ success: true, message: 'Message sent' })
  } catch (error) {
    console.error('SMTP send failed', error)
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' })
  }
})

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const port = Number(process.env.PORT || 3001)
app.listen(port, () => {
  if (NODE_ENV !== 'production') {
    console.log(`API running at http://localhost:${port}`)
  }
})
