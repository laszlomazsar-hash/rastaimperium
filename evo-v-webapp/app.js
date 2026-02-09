document.addEventListener("DOMContentLoaded", () => {
  const snapshots = [
    "Pulse check: Calm solar variance, 3.2% anomaly drift.",
    "Signal: New ecological scan scheduled for 19:00 UTC.",
    "Alert: Monitoring for emergent coordination patterns.",
  ];

  const timeline = [
    "Week 1: Baseline ecological survey published.",
    "Week 2: Model alignment audit completed.",
    "Week 3: Policy recommendations issued to partners.",
  ];

  const snapshotList = document.getElementById("live-snapshots");
  const timelineList = document.getElementById("timeline-overview");

  if (snapshotList) {
    snapshotList.innerHTML = snapshots
      .map((item) => `<li>${item}</li>`)
      .join("");
  }

  if (timelineList) {
    timelineList.innerHTML = timeline
      .map((item) => `<li>${item}</li>`)
      .join("");
  }

  const instanceForm = document.getElementById("instance-form");
  const consultForm = document.getElementById("consult-form");

  if (instanceForm) {
    instanceForm.addEventListener("submit", (event) => {
      event.preventDefault();
      alert("Thanks! We'll reach out with hosted instance details within 48 hours.");
      instanceForm.reset();
    });
  }

  if (consultForm) {
    consultForm.addEventListener("submit", (event) => {
      event.preventDefault();
      alert("Thanks! We'll respond to your consultation request shortly.");
      consultForm.reset();
    });
  }
});
