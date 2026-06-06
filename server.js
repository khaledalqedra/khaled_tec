require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const nodemailer = require('nodemailer');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' })); // restrict to your domain in production
app.use(express.json());

/* ── email transporter (Gmail via STARTTLS) ────── */
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // STARTTLS on 587 — more reliable on cloud hosts than 465
  auth: {
    user: process.env.MAIL_USER,                    // your Gmail address
    pass: (process.env.MAIL_PASS || '').replace(/\s/g, '') // strip spaces from App Password
  },
  connectionTimeout: 10000, // fail fast (10s) instead of hanging
  greetingTimeout: 10000
});

/* ── POST /api/contact ──────────────────────────── */
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    await transporter.sendMail({
      from:    `"Portfolio Contact" <${process.env.MAIL_USER}>`,
      to:      process.env.MAIL_USER,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <h2>New message from your portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr/>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `
    });

    console.log(`Contact form submission from ${name} <${email}>`);
    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Mail error:', err.message);
    // TODO: remove `detail` before final — temporary debugging aid
    res.status(500).json({ error: 'Failed to send email.', detail: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
