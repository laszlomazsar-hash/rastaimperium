document.addEventListener('DOMContentLoaded', () => {
  const metrics = {
    page_load_time_ms: Math.round(performance.now()),
    animations_count: 11,
    interactive_elements: 7,
    scroll_depth_percent: 0,
    visible_elements: []
  };

  const eventLog = {
    onScroll: [],
    onAnimationFrame: [],
    onIntersectionChange: [],
    onHover: []
  };

  const endpoint = 'codex.monitoring.input';

  const sendTelemetry = (type, payload) => {
    const packet = {
      endpoint,
      type,
      payload,
      timestamp: Date.now()
    };
    if (eventLog[type]) {
      eventLog[type].push(packet);
    }
    window.codexObservability = {
      metrics,
      eventLog
    };
  };

  const parallaxNodes = document.querySelectorAll('[data-parallax-speed]');
  const pillarCards = document.querySelectorAll('.pillar-card');
  const cta = document.querySelector('.cta-button');

  const updateScrollDepth = () => {
    const scrollTop = window.scrollY;
    const scrollLimit =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const depth = scrollLimit > 0 ? Math.min(100, Math.round((scrollTop / scrollLimit) * 100)) : 0;

    metrics.scroll_depth_percent = depth;

    parallaxNodes.forEach((node) => {
      const speed = Number(node.getAttribute('data-parallax-speed')) || 0;
      const offset = Math.round(scrollTop * speed);
      node.style.transform = `translateY(${offset}px)`;
    });

    sendTelemetry('onScroll', {
      scroll_depth_percent: depth,
      hero_transform_y: [...parallaxNodes].map((node) => node.style.transform),
      pillar_card_positions: [...pillarCards].map((card) => card.getBoundingClientRect().top)
    });
  };

  window.addEventListener('scroll', updateScrollDepth, { passive: true });
  updateScrollDepth();

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        const card = entry.target;
        const index = [...pillarCards].indexOf(card);

        setTimeout(() => {
          card.classList.add('visible');
        }, index * 100);

        if (!metrics.visible_elements.includes(card.dataset.pillar)) {
          metrics.visible_elements.push(card.dataset.pillar);
        }

        sendTelemetry('onIntersectionChange', {
          pillar_card_visible: entry.isIntersecting,
          pillar_card_index: index,
          fade_in_progress: true
        });

        intersectionObserver.unobserve(card);
      });
    },
    { threshold: 0.2 }
  );

  pillarCards.forEach((card) => {
    intersectionObserver.observe(card);
    card.addEventListener('mouseenter', () => {
      sendTelemetry('onHover', { pillar_card_hovered: card.dataset.pillar });
    });
  });

  if (cta) {
    cta.addEventListener('mouseenter', () => {
      sendTelemetry('onHover', { cta_button_hovered: true });
    });
  }

  const animationStart = performance.now();
  const captureAnimationFrame = (now) => {
    const t = (now - animationStart) / 1000;
    const lionPulseScale = 1 + 0.08 * Math.sin((Math.PI * t) / 1.5);
    const crownFloatOffset = -10 * Math.sin((Math.PI * t) / 2);
    const ctaButtonShimmerPosition = ((t * 90) % 280) - 140;
    const pillarIconRotation = (t * 45) % 360;

    sendTelemetry('onAnimationFrame', {
      lion_pulse_scale: Number(lionPulseScale.toFixed(4)),
      crown_float_offset: Number(crownFloatOffset.toFixed(4)),
      cta_button_shimmer_position: Number(ctaButtonShimmerPosition.toFixed(2)),
      pillar_icon_rotation: Number(pillarIconRotation.toFixed(2))
    });

    requestAnimationFrame(captureAnimationFrame);
  };

  requestAnimationFrame(captureAnimationFrame);

  setInterval(() => {
    sendTelemetry('codex_system', {
      real_time: true,
      update_frequency_ms: 50,
      metrics
    });
  }, 50);
});
