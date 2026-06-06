# Khaled Alqedra — Portfolio

A single-page portfolio with a working contact form connected to a Node.js / Express backend.

## File structure

```
khaled_tec/
├── khaled_tec.html.html   # The page (HTML only — CSS & JS are external now)
├── styles.css             # All styles
├── script.js              # Navigation, toast, contact-form fetch()
├── server.js              # Express backend — POST /api/contact (sends email)
├── package.json           # Backend dependencies
├── .env                   # Your secrets (Gmail user + app password) — NOT committed
├── .gitignore
└── cv/
    └── Khaled_Alqedra_CV.pdf   # ← add your CV here for the Download button
```

## Run the backend

```bash
# 1. Install dependencies (already done if node_modules exists)
npm install

# 2. Set your Gmail App Password in .env
#    Google Account → Security → 2-Step Verification → App Passwords
#    Copy the 16-char password into .env as MAIL_PASS
#    (Your normal Gmail login password will NOT work — it must be an App Password.)

# 3. Start the server
npm start         # or: npm run dev   (auto-restarts on changes)
```

Server runs at http://localhost:3000

## Open the frontend

Just open `khaled_tec.html.html` in your browser, go to the **Contact** page,
and submit the form. The message will be emailed to you.

> The frontend posts to `http://localhost:3000/api/contact`.
> When you deploy the backend, update `API_URL` at the top of `script.js`.

## API

`POST /api/contact`

```json
{ "name": "...", "email": "...", "subject": "...", "message": "..." }
```

Responses: `200 { success: true }` · `400 { error }` (validation) · `500 { error }` (mail failure)
