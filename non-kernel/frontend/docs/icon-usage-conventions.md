# Icon Usage Conventions (Migrated App Routes)

This document defines deterministic icon usage for `app/**/page.tsx`, `layout.tsx`, and `template.tsx` route files.

## 1) Semantic key naming

Use semantic keys in the icon map instead of direct emoji literals inside route files.

- ✅ Preferred key style: `domain.intent.variant`
  - `nav.dashboard.primary`
  - `status.verification.success`
  - `action.launch.external`
- Keep keys stable and descriptive; avoid presentational names like `blue-star`.
- Reuse existing semantic keys whenever they represent the same user intent.

## 2) Allowed size tokens

Use the frontend icon component size tokens only:

- `xs`
- `sm`
- `md`
- `lg`
- `xl`

Do not hardcode pixel sizes in migrated route files unless there is a documented accessibility exception.

## 3) Add new icon-map entry vs reuse existing

Reuse an existing map entry when:

- the meaning and user intent are equivalent,
- only surrounding text/context differs,
- size or placement can be handled via existing size tokens.

Add a new map entry when all are true:

1. The intended meaning is new (not just a visual preference).
2. Reusing an existing key would create semantic ambiguity.
3. Product/content owner confirms the new distinction is intentional.

When adding a new entry, keep naming semantic and align with route domain prefixes.

## 4) Lint/check enforcement

Run:

```bash
npm run check:route-emojis
```

The check fails when direct emoji characters are detected in migrated route files and should be run before merge.

## 5) Deferred scope

Motion/animation upgrades are intentionally out of scope for this change and should be delivered in a separate PR after icon infrastructure is stable.
