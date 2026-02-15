"use client";

const plans = [
  { name: "Entry", price: "£47/mo" },
  { name: "Mid-Tier", price: "£12k–£18k modules" },
  { name: "High-Ticket", price: "£25k–£35k consulting" },
];

export default function ConsultingCheckout() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Consulting Checkout</h1>
      <ul>
        {plans.map((plan) => (
          <li key={plan.name}>
            {plan.name}: {plan.price}
          </li>
        ))}
      </ul>
    </main>
  );
}
