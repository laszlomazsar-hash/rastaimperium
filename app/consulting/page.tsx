"use client";

import { useBlueprint } from "../../hooks/useBlueprint";

export default function ConsultingPage() {
  const { blueprint, loading } = useBlueprint();

  if (loading) return <p>Loading Rasta Imperium Blueprint...</p>;
  if (!blueprint) return <p>Error loading blueprint.</p>;

  const { flagship, midTier = [], workshops = [] } = blueprint.consulting;

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Consulting & Workshops</h1>
      <p>{blueprint.description}</p>

      <section>
        <h2>Flagship Service</h2>
        <h3>
          {flagship.name} (£{flagship.price})
        </h3>
        {Array.isArray(flagship.features) && flagship.features.length > 0 && (
          <ul>
            {flagship.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Mid-Tier Services</h2>
        <ul>
          {midTier.map((service) => (
            <li key={service.name}>
              <strong>{service.name}</strong> — £{service.price}
              {Array.isArray(service.features) && service.features.length > 0 && (
                <ul>
                  {service.features.map((feature) => (
                    <li key={`${service.name}-${feature}`}>{feature}</li>
                  ))}
                </ul>
              )}
              {service.duration && <p>Duration: {service.duration}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Workshops</h2>
        <ul>
          {workshops.map((workshop) => (
            <li key={workshop.name}>
              <strong>{workshop.name}</strong> — £{workshop.price}
              {workshop.duration && <span> ({workshop.duration})</span>}
              {Array.isArray(workshop.features) && workshop.features.length > 0 && (
                <ul>
                  {workshop.features.map((feature) => (
                    <li key={`${workshop.name}-${feature}`}>{feature}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Approved Sales Collateral</h2>
        <p>Need the latest one-pager, pricing matrix, deck narrative, or objection notes?</p>
        <p>
          <a href="/sales-assets">Open the sales assets hub</a>
        </p>
      </section>
    </main>
  );
}
