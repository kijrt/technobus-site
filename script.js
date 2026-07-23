// ---------- mobile nav ----------
const burger = document.getElementById('burger');
const nav = document.querySelector('.nav');
burger.addEventListener('click', () => {
  nav.classList.toggle('open');
});
document.querySelectorAll('.navlinks a').forEach(a => {
  a.addEventListener('click', () => nav.classList.remove('open'));
});

// ---------- contact form ----------
const form = document.getElementById('order-form');
const msg = document.getElementById('form-msg');
const btn = document.getElementById('form-submit-btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  msg.className = 'form-msg';

  const data = {
    from: form.from.value.trim(),
    to: form.to.value.trim(),
    date: form.date.value.trim(),
    vehicle: form.vehicle.value.trim(),
    phone: form.phone.value.trim(),
  };

  if (!data.phone) {
    msg.textContent = 'Вкажіть номер телефону.';
    msg.className = 'form-msg err';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Надсилаємо…';

  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    if (!res.ok || !result.ok) {
      throw new Error(result.error || 'Помилка відправки');
    }

    msg.textContent = 'Заявку надіслано! Ми зателефонуємо найближчим часом.';
    msg.className = 'form-msg ok';
    form.reset();

    // ==========================================================
    // GOOGLE ADS CONVERSION EVENT — розкоментуйте після підключення
    // тега Google Ads і вставте свій conversion ID / label.
    //
    // if (typeof gtag === 'function') {
    //   gtag('event', 'conversion', {
    //     'send_to': 'AW-XXXXXXXXX/XXXXXXXXXXXXXXXXX'
    //   });
    // }
    // ==========================================================

  } catch (err) {
    msg.textContent = 'Не вдалося надіслати заявку. Зателефонуйте нам напряму: +38 044 500-12-34';
    msg.className = 'form-msg err';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Надіслати заявку';
  }
});
