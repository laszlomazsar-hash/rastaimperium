document.addEventListener('DOMContentLoaded', () => {
  const snapshots = document.getElementById('live-snapshots');
  const timeline = document.getElementById('timeline-overview');
  const kpis = document.getElementById('live-kpis');

  const snapshotItems = [
    'Tick 001: Core initialized',
    'Tick 002: Adaptive loop running',
    'Tick 004: Anomaly guardrails verified',
  ];

  const timelineItems = [
    'Tick 001 → 005: Evolution snapshot',
    'Tick 006 → 010: Adaptive changes',
    'Tick 011 → 015: Audit heartbeat stable',
  ];

  const kpiItems = [
    { label: 'Uptime', value: '99.98%' },
    { label: 'Audit hash sync', value: '2.3s' },
    { label: 'Active nodes', value: '128' },
    { label: 'Policy drift', value: '0.00%' },
  ];

  if (snapshots) {
    snapshots.innerHTML += `<ul>${snapshotItems
      .map((item) => `<li>${item}</li>`)
      .join('')}</ul>`;
  }

  if (timeline) {
    timeline.innerHTML += `<ul class="timeline">${timelineItems
      .map((item) => {
        const [range, detail] = item.split(': ');
        return `<li><span>${range}</span>${detail}</li>`;
      })
      .join('')}</ul>`;
  }

  if (kpis) {
    kpis.innerHTML = kpiItems
      .map(
        (kpi) =>
          `<div class="stat"><strong>${kpi.value}</strong><span>${kpi.label}</span></div>`
      )
      .join('');
  }

  const formHandlers = [
    {
      id: 'instance-form',
      message: 'Instance request submitted (placeholder). Backend integration pending.',
    },
    {
      id: 'self-host-form',
      message: 'Self-host request submitted (placeholder). Backend integration pending.',
    },
    {
      id: 'consult-form',
      message: 'Consultation request submitted (placeholder). Backend integration pending.',
    },
  ];

  formHandlers.forEach(({ id, message }) => {
    const form = document.getElementById(id);
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert(message);
      });
    }
  });

  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') {
        event.preventDefault();
        return;
      }

      const target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', targetId);
      }
    });
  });
});
