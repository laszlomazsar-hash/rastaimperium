export function AlertWidget({ alerts }: { alerts: string[] }) {
  if (!alerts.length) {
    return (
      <section>
        <h3>Alerts</h3>
        <p>No anomalies detected.</p>
      </section>
    );
  }

  return (
    <section>
      <h3>Alerts</h3>
      <ul>
        {alerts.map((alert) => (
          <li key={alert}>⚠️ {alert}</li>
        ))}
      </ul>
    </section>
  );
}
