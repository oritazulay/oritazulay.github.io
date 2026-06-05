/* ================================================
   ORIT AZULAY – main.js
   ================================================ */

// ── Sticky header shadow ──────────────────────
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile hamburger ──────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close nav on outside click
document.addEventListener('click', e => {
  if (!header.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// ── Active nav link on scroll ─────────────────
const sections = document.querySelectorAll('section[id], div[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => observer.observe(s));

// ── Scroll fade-up animations ─────────────────
// Mark body so CSS animations activate only when JS is running
document.body.classList.add('js-loaded');

const fadeEls = document.querySelectorAll(
  '.service-card, .testimonial-card, .about-text, .about-image, ' +
  '.contact-info, .contact-form-wrap, .workshop-text, .workshop-image, ' +
  '.stat, .art-mini, .article-card'
);
fadeEls.forEach(el => el.classList.add('fade-up'));

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

fadeEls.forEach(el => fadeObserver.observe(el));

// ── Stagger service cards ─────────────────────
document.querySelectorAll('.service-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});
document.querySelectorAll('.testimonial-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});

// ── Contact form ──────────────────────────────
const form    = document.getElementById('contact-form');
const success = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name  = form.querySelector('#name').value.trim();
    const phone = form.querySelector('#phone').value.trim();

    // Validation
    if (!name || !phone) {
      [form.querySelector('#name'), form.querySelector('#phone')].forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#EF4444';
          field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
        }
      });
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'שולח...';

    const accessKey = form.querySelector('[name="access_key"]').value;

    // If access key is the placeholder, fall back to mailto
    if (!accessKey || accessKey === 'REPLACE_WITH_WEB3FORMS_KEY') {
      const service = form.querySelector('#service').value;
      const message = form.querySelector('#message').value.trim();
      const subject = encodeURIComponent(`פנייה מהאתר – ${service || 'כללי'}`);
      const body    = encodeURIComponent(`שם: ${name}\nטלפון: ${phone}\nנושא: ${service}\n\nהודעה:\n${message}`);
      window.location.href = `mailto:oritazulay@gmail.com?subject=${subject}&body=${body}`;
      form.style.display = 'none';
      success.style.display = 'block';
      return;
    }

    // Send via Web3Forms
    try {
      const data = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });
      const result = await response.json();

      if (result.success) {
        form.style.display = 'none';
        success.style.display = 'block';
      } else {
        throw new Error(result.message || 'שגיאה בשליחה');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'שליחה →';
      alert('אירעה שגיאה בשליחה. אנא נסו שנית או צרו קשר ישירות בטלפון.');
    }
  });
}

// ── Tool modals ───────────────────────────────
const modalData = {
  adlerian: {
    title: 'אימון אדלריאני',
    img: 'images/modal-adlerian.png',
    paragraphs: [
      'בבסיס הגישה האדלריאנית עומדת ההנחה שלכל אדם יש יכולת בחירה חופשית בכל רגע נתון בחייו.',
      'במהלך האימון אני מקשיבה לדרך שבה המתאמן מפרש את מציאות חייו ובמקומות שבהם הפרשנות מגבילה אותו אנו בוחנים יחד אפשרויות פרשנות נוספות.',
      'כאשר המתאמן מרגיש מחוזק ומודע יותר למגוון האפשרויות ולחופש הבחירה, הוא יכול להתחיל ולשנות את מציאות חייו וליצור את המציאות הרצויה לו.'
    ]
  },
  nlp: {
    title: 'NLP',
    subtitle: 'Neuro, Linguistic, Programming',
    img: 'images/modal-nlp.png',
    paragraphs: [
      'NLP היא שיטה המביאה מכלול טכניקות וכלים אבחוניים המבוססים על ההנחה הכללית שלכל התנהגות יש מבנה שניתן לדגום, ללמוד ולשנות.',
      'כאשר דפוס מסוים מחבל בנו ומעכב אותנו, נוכל לשנות אותו באמצעות שיטת ה-NLP.'
    ]
  },
  imagery: {
    title: 'דמיון מודרך',
    quote: '"בני אדם אינם שבויים של גורלם אלא רק של דמיונם" — פרנקלין רוזוולט',
    img: 'images/modal-guided-imagery.png',
    paragraphs: [
      'הדמיון המודרך הינו מונח המתאר מצב בו נעזרים בכוחו העצמתי של הדמיון לשם השגת מטרות באופן מודע.',
      'מחקרים מדעיים הוכיחו כי המוח האנושי מגיב באופן זהה לאירוע בין אם התרחש במציאות ובין אם היה דמיוני.',
      'כשאדם מדמיין שביכולתו לשנות מצב קיים, גדל הסיכוי שהוא יצליח לערוך את השינוי.'
    ]
  }
};

const overlay   = document.getElementById('tool-modal-overlay');
const modalInner = document.getElementById('tool-modal-inner');
const closeBtn  = document.getElementById('tool-modal-close');

function openModal(key) {
  const d = modalData[key];
  if (!d) return;

  let html = `<img class="tool-modal-img" src="${d.img}" alt="${d.title}"/>`;
  html += `<h2 class="tool-modal-title" id="tool-modal-title">${d.title}</h2>`;
  if (d.subtitle) html += `<p class="tool-modal-subtitle">${d.subtitle}</p>`;
  if (d.quote) {
    html += `<blockquote class="tool-modal-quote">${d.quote}</blockquote>`;
  }
  html += `<div class="tool-modal-text">`;
  d.paragraphs.forEach(p => { html += `<p>${p}</p>`; });
  html += `</div>`;

  modalInner.innerHTML = html;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.tool-tag-btn').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.modal));
});

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Smooth scroll polyfill for older Safari ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
