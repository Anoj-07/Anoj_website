/* =============================================
   BLOG PAGE — JS
   Filter · Newsletter
   ============================================= */

'use strict';

// ============================================================
// CATEGORY FILTER
// ============================================================
const filterBtns   = document.querySelectorAll('.filter-btn');
const blogCards    = document.querySelectorAll('#blogGrid .blog-card');
const featuredPost = document.querySelector('.featured-post');
const emptyState   = document.getElementById('emptyState');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    let visible  = 0;

    // Featured post filter
    if (featuredPost) {
      const tags = (featuredPost.dataset.tags || '').split(',');
      const show = filter === 'all' || tags.some(t => t.trim() === filter);
      featuredPost.classList.toggle('hidden', !show);
      if (show) visible++;
    }

    // Grid cards filter
    blogCards.forEach(card => {
      const tags = (card.dataset.tags || '').split(',');
      const show = filter === 'all' || tags.some(t => t.trim() === filter);
      card.classList.toggle('hidden', !show);

      if (show) {
        visible++;
        // Re-trigger reveal animation
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      }
    });

    emptyState.style.display = visible === 0 ? 'block' : 'none';
  });
});

// ============================================================
// NEWSLETTER FORM
// ============================================================
const nlForm = document.getElementById('nlForm');
if (nlForm) {
  nlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email  = nlForm.querySelector('input[type="email"]').value;
    const btn    = nlForm.querySelector('button');
    const origTxt = btn.innerHTML;

    btn.innerHTML = '✓ Subscribed!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = origTxt;
      btn.style.background = '';
      btn.disabled = false;
      nlForm.reset();
    }, 3000);
  });
}
