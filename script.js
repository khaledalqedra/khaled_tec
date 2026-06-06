/* ── NAVIGATION ────────────────────────────────── */
const icons = document.querySelectorAll('.nav-icon[data-page]');
const pages = document.querySelectorAll('.page');

icons.forEach(icon => {
  icon.addEventListener('click', e => {
    e.preventDefault();
    const target = icon.dataset.page;
    icons.forEach(i => i.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));
    icon.classList.add('active');
    const page = document.getElementById('page-' + target);
    if (page) {
      page.classList.add('active');
      page.style.animation = 'none';
      page.offsetHeight;
      page.style.animation = '';
    }
  });
});

/* ── TOAST ─────────────────────────────────────── */
function showToast(msg, type = 'success', duration = 4000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'show ' + type;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.className = ''; }, duration);
}

/* ── CONTACT FORM → Express backend ───────────── */
const API_URL = 'http://localhost:3000/api/contact'; // change to your deployed URL

document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form    = e.target;
  const btn     = document.getElementById('formBtn');
  const btnTxt  = document.getElementById('formBtnText');
  const spinner = document.getElementById('formBtnSpinner');

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !subject || !message) {
    showToast('Please fill in all fields.', 'error');
    return;
  }

  btn.disabled = true;
  btnTxt.textContent = 'Sending…';
  spinner.style.display = 'inline';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });

    if (!res.ok) throw new Error('Server error ' + res.status);

    showToast('Message sent! I\'ll get back to you soon.', 'success');
    form.reset();
  } catch (err) {
    console.error(err);
    showToast('Failed to send. Please email me directly.', 'error');
  } finally {
    btn.disabled = false;
    btnTxt.textContent = 'Send Message';
    spinner.style.display = 'none';
  }
});
