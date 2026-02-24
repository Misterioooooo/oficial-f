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

// ===== HERO SLIDES =====
const heroTrack = document.getElementById('heroTrack');
const heroPrev = document.getElementById('heroPrev');
const heroNext = document.getElementById('heroNext');
if (heroTrack && heroTrack.children.length > 1) {
  // Infinite loop using clones at both ends (no visible jump on mobile/desktop).
  const originalSlides = Array.from(heroTrack.children);
  const totalRealSlides = originalSlides.length;
  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[totalRealSlides - 1].cloneNode(true);

  heroTrack.insertBefore(lastClone, heroTrack.firstChild);
  heroTrack.appendChild(firstClone);

  let currentSlide = 1; // Start on first real slide (after prepended clone)
  let isAnimating = false;
  let autoTimer = null;

  const applyTransform = (index, withTransition = true) => {
    heroTrack.style.transition = withTransition ? 'transform 0.8s ease' : 'none';
    heroTrack.style.transform = `translateX(-${index * 100}%)`;
  };

  const moveTo = (index) => {
    if (isAnimating) return;
    isAnimating = true;
    currentSlide = index;
    applyTransform(currentSlide, true);
  };

  const moveToNext = () => moveTo(currentSlide + 1);
  const moveToPrev = () => moveTo(currentSlide - 1);

  const startAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(moveToNext, 5000);
  };

  const restartAuto = () => startAuto();

  // Initial position on first real slide
  applyTransform(currentSlide, false);

  if (heroPrev) {
    heroPrev.addEventListener('click', () => {
      moveToPrev();
      restartAuto();
    });
  }
  if (heroNext) {
    heroNext.addEventListener('click', () => {
      moveToNext();
      restartAuto();
    });
  }

  heroTrack.addEventListener('transitionend', () => {
    // If we reached end clone, snap to first real slide.
    if (currentSlide === totalRealSlides + 1) {
      currentSlide = 1;
      applyTransform(currentSlide, false);
    }
    // If we reached start clone, snap to last real slide.
    if (currentSlide === 0) {
      currentSlide = totalRealSlides;
      applyTransform(currentSlide, false);
    }
    isAnimating = false;
  });

  startAuto();
}

// ===== FORMULARIO DE PAGO =====
const metodoInfo = document.getElementById('metodoInfo');
const metodoRadios = document.querySelectorAll('input[name="metodo"]');
const diaSelect = document.getElementById('pDia');

if (diaSelect) {
  for (let i = 1; i <= 31; i += 1) {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = String(i);
    diaSelect.appendChild(opt);
  }
}

function getMetodoDetalle(metodo) {
  switch (metodo) {
    case 'Tigo Money':
      return {
        resumen: 'Número Tigo Money: 67236144',
        extra: '<p><strong>Tigo Money:</strong> 67236144</p>'
      };
    case 'QR Bancario':
      return {
        resumen: 'QR Bancario (Banco Union)',
        extra: '<p><strong>QR Bancario:</strong> escanea el código para pagar.</p><img src="imagenes/WhatsApp Image 2026-02-21 at 22.44.17.jpeg" alt="QR Bancario" class="metodo-qr"/>'
      };
    case 'Transferencia bancaria':
      return {
        resumen: 'Cuenta bancaria: 10000027518105',
        extra: '<p><strong>Transferencia bancaria:</strong> 10000027518105</p>'
      };
    case 'Efectivo':
      return {
        resumen: 'Pago en efectivo',
        extra: '<p><strong>Efectivo:</strong> pago directo en persona.</p>'
      };
    default:
      return {
        resumen: '',
        extra: '<p>Selecciona un método para ver los datos de pago.</p>'
      };
  }
}

function actualizarMetodoInfo() {
  if (!metodoInfo) return;

  const seleccionado = document.querySelector('input[name="metodo"]:checked');
  const metodo = seleccionado ? seleccionado.value : '';
  const detalle = getMetodoDetalle(metodo);

  metodoInfo.innerHTML = detalle.extra;
  metodoInfo.classList.toggle('show', !!metodo);
}

metodoRadios.forEach(radio => radio.addEventListener('change', actualizarMetodoInfo));
actualizarMetodoInfo();

function enviarPago(e) {
  e.preventDefault();
  const nombre = document.getElementById('pNombre').value;
  const carnet = document.getElementById('pCarnet').value;
  const servicio = document.getElementById('pServicio').value;
  const dia = document.getElementById('pDia').value;
  const mes = document.getElementById('pMes').value;
  const metodo = document.querySelector('input[name="metodo"]:checked');
  const nota = document.getElementById('pNota').value;

  if (!metodo) {
    alert('Por favor selecciona un método de pago.');
    return;
  }

  const detalleMetodo = getMetodoDetalle(metodo.value);

  const msg = `💜 *PAGO DE SERVICIO - FLORES*\n\n` +
    `👤 *Nombre:* ${nombre}\n` +
    `🪪 *Carnet de identidad:* ${carnet}\n` +
    `📦 *Servicio:* ${servicio}\n` +
    `📅 *Fecha de pago:* Día ${dia} — ${mes}\n` +
    `💳 *Método de pago:* ${metodo.value}\n` +
    (detalleMetodo.resumen ? `📌 *Dato de pago:* ${detalleMetodo.resumen}\n` : '') +
    (nota ? `📝 *Comprobante/Nota:* ${nota}\n` : '') +
    `\n✅ Por favor confirmar recepción del pago. ¡Gracias!`;

  const url = `https://wa.me/59167236144?text=${encodeURIComponent(msg)}`;

  const formOk = document.getElementById('formOk');
  formOk.classList.add('show');

  setTimeout(() => {
    window.open(url, '_blank');
    document.getElementById('pagoForm').reset();
    actualizarMetodoInfo();
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
