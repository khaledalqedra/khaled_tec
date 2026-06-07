require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { Resend } = require('resend');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' })); // restrict to your domain in production
app.use(express.json());

/* ── Resend email client (sends over HTTPS) ────── */
const resend = new Resend(process.env.RESEND_API_KEY);

// Where the contact messages get delivered (your inbox)
const MAIL_TO = process.env.MAIL_TO || 'khaledalqedra4@gmail.com';

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
    const { error } = await resend.emails.send({
      from:    'Portfolio Contact <onboarding@resend.dev>', // Resend's shared sender (no domain needed)
      to:      MAIL_TO,
      replyTo: email, // hitting "reply" answers the visitor directly
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

    if (error) throw new Error(error.message || JSON.stringify(error));

    console.log(`Contact form submission from ${name} <${email}>`);
    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Mail error:', err.message);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
