/* =============================================
   ANOJ RAWAL PORTFOLIO — MAIN JS
   Three.js · Animations · Interactions
   ============================================= */

'use strict';

// ============================================================
// LOADER
// ============================================================
const loader   = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');

window.addEventListener('DOMContentLoaded', () => {
  // Animate bar
  requestAnimationFrame(() => {
    loaderBar.style.width = '100%';
  });

  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    initReveal();
    initSkillBars();
    initCounters();
  }, 1600);
});
document.body.style.overflow = 'hidden';

// ============================================================
// CUSTOM CURSOR
// ============================================================
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let ringX = 0, ringY = 0;
let dotX  = 0, dotY  = 0;
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  dotX = e.clientX;
  dotY = e.clientY;
  cursorDot.style.left = dotX + 'px';
  cursorDot.style.top  = dotY + 'px';
});

// Ring follows with lag
(function animateCursor() {
  ringX += (mouse.x - ringX) * 0.12;
  ringY += (mouse.y - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
})();

// Hover effect on interactive elements
document.querySelectorAll('a, button, [data-tilt], .proj-card, .mini-card, .skill-block, .tl-card, .c-link, .terminal-wrap').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity  = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '1';
});

// ============================================================
// THREE.JS BACKGROUND
// ============================================================
(function initThree() {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // ---- STARFIELD ----
  const starCount = 3000;
  const starPos   = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) {
    starPos[i] = (Math.random() - 0.5) * 300;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ size: 0.12, color: 0xffffff, sizeAttenuation: true });
  const stars   = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // ---- COLORED PARTICLES ----
  const pCount = 700;
  const pPos   = new Float32Array(pCount * 3);
  const pCol   = new Float32Array(pCount * 3);

  for (let i = 0; i < pCount; i++) {
    pPos[i * 3]     = (Math.random() - 0.5) * 90;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 70;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    if (Math.random() > 0.5) {
      // cyan
      pCol[i * 3] = 0.133; pCol[i * 3 + 1] = 0.827; pCol[i * 3 + 2] = 0.933;
    } else {
      // violet
      pCol[i * 3] = 0.659; pCol[i * 3 + 1] = 0.333; pCol[i * 3 + 2] = 0.969;
    }
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.28, vertexColors: true,
    transparent: true, opacity: 0.75, sizeAttenuation: true
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ---- CENTRAL TORUS KNOT ----
  const tkGeo = new THREE.TorusKnotGeometry(5, 1.5, 100, 14);
  const tkMat = new THREE.MeshBasicMaterial({
    color: 0x22d3ee, wireframe: true, transparent: true, opacity: 0.3
  });
  const torusKnot = new THREE.Mesh(tkGeo, tkMat);
  torusKnot.position.set(18, 2, -8);
  scene.add(torusKnot);

  // ---- FLOATING SHAPES ----
  const shapeConfigs = [
    { geo: new THREE.OctahedronGeometry(1.8),    color: 0xa855f7, pos: [-22, 8, -12] },
    { geo: new THREE.TetrahedronGeometry(1.4),   color: 0x22d3ee, pos: [ 22, -10, -18] },
    { geo: new THREE.IcosahedronGeometry(1.4),   color: 0xf43f5e, pos: [-16, -9, -6] },
    { geo: new THREE.OctahedronGeometry(1.1),    color: 0x22d3ee, pos: [ 28,  6, -22] },
    { geo: new THREE.TetrahedronGeometry(1.2),   color: 0xa855f7, pos: [-8, 14, -20] },
  ];
  const floatingShapes = shapeConfigs.map(({ geo, color, pos }) => {
    const mat  = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.22 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    scene.add(mesh);
    return mesh;
  });

  // ---- MOUSE PARALLAX ----
  let camTargetX = 0, camTargetY = 0;

  document.addEventListener('mousemove', (e) => {
    camTargetX = (e.clientX / window.innerWidth  - 0.5) * 4;
    camTargetY = (e.clientY / window.innerHeight - 0.5) * -2.5;
  });

  // ---- ANIMATION LOOP ----
  const clock = new THREE.Clock();

  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    stars.rotation.y = t * 0.015;

    particles.rotation.y = t * 0.04;
    particles.rotation.x = t * 0.015;

    torusKnot.rotation.x = t * 0.35;
    torusKnot.rotation.y = t * 0.55;

    floatingShapes.forEach((s, i) => {
      s.rotation.x = t * (0.2 + i * 0.07);
      s.rotation.y = t * (0.3 + i * 0.06);
      s.position.y = shapeConfigs[i].pos[1] + Math.sin(t * 0.5 + i) * 1.5;
    });

    // Smooth camera follow mouse
    camera.position.x += (camTargetX - camera.position.x) * 0.04;
    camera.position.y += (camTargetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  })();

  // ---- RESIZE ----
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
})();

// ============================================================
// NAV — SCROLL BEHAVIOUR
// ============================================================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ============================================================
// HAMBURGER MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

document.querySelectorAll('.m-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

// ============================================================
// SMOOTH SCROLL FOR NAV LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ============================================================
// TYPING ANIMATION
// ============================================================
const phrases = [
  'secure APIs.',
  'backend systems.',
  'Django REST apps.',
  'PostgreSQL databases.',
  'auth frameworks.',
];

let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
const typeEl  = document.getElementById('typewriter');

function type() {
  if (!typeEl) return;
  const current = phrases[phraseIdx];

  if (deleting) {
    typeEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
    setTimeout(type, 50);
  } else {
    typeEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
    setTimeout(type, 80);
  }
}

setTimeout(type, 1800);

// ============================================================
// SCROLL REVEAL
// ============================================================
function initReveal() {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 120);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Stagger children in each section
  document.querySelectorAll('.about-cards .mini-card, .projects-grid .proj-card, .skills-layout .skill-block').forEach((el, i) => {
    el.dataset.delay = i;
  });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

// ============================================================
// SKILL BARS
// ============================================================
function initSkillBars() {
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.sb-fill').forEach(bar => {
          setTimeout(() => {
            bar.style.width = bar.dataset.w + '%';
          }, 200);
        });
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-block').forEach(el => skillObs.observe(el));
}

// ============================================================
// COUNTER ANIMATION
// ============================================================
function initCounters() {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.count);
        let current  = 0;
        const step   = Math.ceil(target / 40);
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current;
        }, 40);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach(el => counterObs.observe(el));
}

// ============================================================
// 3D CARD TILT EFFECT
// ============================================================
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) scale3d(1.02,1.02,1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });
});

// ============================================================
// ACTIVE NAV LINK ON SCROLL
// ============================================================
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav-link');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => sectionObs.observe(s));

// ============================================================
// CONSOLE GREETING
// ============================================================
console.log('%c👋 Hey there!', 'color: #22d3ee; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to my portfolio. Built with Three.js + vanilla JS.', 'color: #a855f7; font-size: 13px;');
console.log('%c— Anoj Rawal | https://github.com/Anoj-07', 'color: #475569; font-size: 12px;');
