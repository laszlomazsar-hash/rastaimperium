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
  const telemetryRenderState = new WeakSet();

  const setupInteractionOverlay = () => {
    const overlay = document.createElement('div');
    overlay.id = 'interaction-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';

    const colors = {
      onScroll: 'rgba(253, 185, 19, 0.3)',
      onHover: 'rgba(0, 150, 57, 0.5)',
      onIntersectionChange: 'rgba(0, 150, 57, 0.5)',
      codex_system: 'rgba(253, 185, 19, 0.25)',
      onAnimationFrame: 'rgba(227, 30, 36, 0.35)'
    };

    const drawEvent = (x, y, type) => {
      const circle = document.createElement('div');
      circle.style.position = 'absolute';
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;
      circle.style.width = '16px';
      circle.style.height = '16px';
      circle.style.borderRadius = '50%';
      circle.style.background = colors[type] || 'rgba(255, 255, 255, 0.65)';
      circle.style.opacity = '0.7';
      circle.style.pointerEvents = 'none';
      circle.style.transition = 'all 1.2s ease-out';
      overlay.appendChild(circle);
      setTimeout(() => circle.remove(), 1200);
    };

    const scrollLine = document.createElement('div');
    scrollLine.style.position = 'fixed';
    scrollLine.style.top = '0';
    scrollLine.style.left = '0';
    scrollLine.style.height = '4px';
    scrollLine.style.background = colors.onScroll;
    scrollLine.style.width = '0%';
    scrollLine.style.zIndex = '10000';
    overlay.appendChild(scrollLine);

    const updateScrollLine = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollLine.style.width = `${percent}%`;
    };

    const getTargetCenter = (payload) => {
      const target =
        payload?.pillar_card_hovered ||
        payload?.pillar_card_index ||
        (payload?.cta_button_hovered ? 'cta-button' : null);

      if (typeof target === 'number') {
        const cards = document.querySelectorAll('.pillar-card');
        const card = cards[target];
        if (card) {
          const rect = card.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }
      }

      if (target) {
        const el = document.querySelector(`[data-pillar="${target}"], .${target}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }
      }

      return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    };

    document.body.appendChild(overlay);
    window.addEventListener('scroll', updateScrollLine, { passive: true });
    updateScrollLine();

    return (packet) => {
      if (telemetryRenderState.has(packet)) {
        return;
      }
      telemetryRenderState.add(packet);

      const center = getTargetCenter(packet.payload);
      drawEvent(center.x, center.y, packet.type);
    };
  };

  const renderTelemetry = setupInteractionOverlay();

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

    renderTelemetry(packet);

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
