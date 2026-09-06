# Railway deployment workflow fix

- [x] Review the current Railway workflow and CLI deployment contract.
- [x] Root cause: multi-service project → `railway up` requires `--service`.
- [x] Restore CLI force-redeploy workflow with service input + `RAILWAY_SERVICE` secret fallback.
- [x] Clear errors when token or service is missing/ambiguous.
- [ ] Set repository secret `RAILWAY_SERVICE` to the production service name (one-time, in GitHub Settings → Secrets).
- [ ] Optional: re-run **Actions → Railway Deploy → Run workflow** with the service name to verify CLI path.

Primary auto path remains Railway native GitHub integration after `build-static-site.yml` refreshes `backend/static/`.

# Thanks & Praise page

- [x] Add a polished Thanks & Praise page preserving the user’s spiritual intent and sovereign-architecture themes.
- [x] Add the page to the primary navigation and relevant footer links.
- [x] Validate the new route, TypeScript, production build, and responsive-safe presentation.
- [x] Commit and push the page update to GitHub.

# Visual regression investigation

- [x] Update the approved visual-regression route inventory for the newly added Thanks & Praise route.
- [x] Re-run the visual regression suite and inspect the generated screenshots/diffs for genuine layout issues.
- [x] Verify the Thanks & Praise page at desktop and mobile widths, including overflow and navigation wrapping.
- [x] Document the final root cause and validation result in audit-findings.md.
- [x] Remove conflict-marker contamination from generated static files and re-run the remote visual workflow.
- [x] Separately investigate the seven remaining legacy visual failures, including the mobile Governance/Codex client-side exception and Codex IV article-region mismatch.
- [x] Resolve the remaining desktop Blueprint visual mismatch.
- [x] Resolve the remaining mobile homepage visual mismatch.
- [x] Resolve the remaining Contact visual mismatch.
- [x] Resolve the remaining desktop and mobile Technology/Verification visual mismatches.
- [x] Rebuild the static export and verify all visual-regression captures pass.
- [x] Fix the reported mobile client-side exception and verify the affected route in production.
