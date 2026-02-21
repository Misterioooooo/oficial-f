// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== FORMULARIO DE PAGO =====
function enviarPago(e) {
  e.preventDefault();
  const nombre = document.getElementById('pNombre').value;
  const servicio = document.getElementById('pServicio').value;
  const dia = document.getElementById('pDia').value;
  const mes = document.getElementById('pMes').value;
  const metodo = document.querySelector('input[name="metodo"]:checked');
  const nota = document.getElementById('pNota').value;

  if (!metodo) {
    alert('Por favor selecciona un método de pago.');
    return;
  }

  const msg = `💜 *PAGO DE SERVICIO - FLORES*\n\n` +
    `👤 *Nombre:* ${nombre}\n` +
    `📦 *Servicio:* ${servicio}\n` +
    `📅 *Fecha de pago:* Día ${dia} — ${mes}\n` +
    `💳 *Método de pago:* ${metodo.value}\n` +
    (nota ? `📝 *Comprobante/Nota:* ${nota}\n` : '') +
    `\n✅ Por favor confirmar recepción del pago. ¡Gracias!`;

  const url = `https://wa.me/59167236144?text=${encodeURIComponent(msg)}`;

  const formOk = document.getElementById('formOk');
  formOk.classList.add('show');

  setTimeout(() => {
    window.open(url, '_blank');
    document.getElementById('pagoForm').reset();
    setTimeout(() => formOk.classList.remove('show'), 3000);
  }, 800);
}

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.plan-card, .stream-card, .cc, .pi-card, .elec-card, .hgw-cat, .prev-card, .cat-feat').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `all 0.5s ease ${i * 0.05}s`;
  observer.observe(el);
});

// ===== ACTIVE NAV ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? '#c084fc' : '';
  });
});

console.log('%c💜 Flores — Internet & Tecnología Bolivia', 'color:#c084fc;font-size:16px;font-weight:bold');