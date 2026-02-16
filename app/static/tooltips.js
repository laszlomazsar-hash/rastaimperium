document.addEventListener('DOMContentLoaded', function () {
  const terms = document.querySelectorAll('.term');

  if (!terms.length) {
    return;
  }

  terms.forEach((term) => {
    term.addEventListener('click', function (event) {
      if (window.innerWidth > 768) {
        return;
      }

      event.preventDefault();
      terms.forEach((other) => {
        if (other !== term) {
          other.classList.remove('active');
        }
      });
      term.classList.toggle('active');
    });

    term.addEventListener('mouseenter', function () {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'tooltip_hover', { term: term.textContent.trim().slice(0, 60) });
      }
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.term')) {
      terms.forEach((term) => term.classList.remove('active'));
    }
  });
});
