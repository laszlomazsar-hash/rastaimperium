# Formal Measure ↔ Runtime Bridge

This note defines how the formal measure model is implemented in executable runtime code (`src/codex/measure_runtime_bridge.py`).

## 1) Runtime representation choice

We use a **weighted particle set** (`RuntimeParticleSet`) as the executable representation.

Why this choice:
- Directly represents arbitrary non-Gaussian / multi-modal distributions.
- Supports sequential updates with generic likelihood functions.
- Can be projected back into a finite formal measure without lossy parametric assumptions.

## 2) Projection maps (formal → runtime and runtime → formal)

### Formal → runtime
`MeasureRuntimeBridge.project_formal_to_runtime`:
1. Validate finite support + mass shape.
2. Normalize formal masses to probability weights.
3. Sample `particle_count` particles from support (weighted sampling).
4. Initialize runtime weights uniformly (`1/N`).

### Runtime → formal
`MeasureRuntimeBridge.project_runtime_to_formal`:
1. Normalize runtime weights.
2. Aggregate mass by identical state vector.
3. Emit `FormalMeasure(support, mass)`.

## 3) Normalization and update/resampling rules

### Normalization
`MeasureRuntimeBridge.normalize` enforces non-negative weights summing to 1.

### Update rule
`MeasureRuntimeBridge.update`:
1. For each particle: `w_i <- w_i * max(0, likelihood(x_i))`.
2. Normalize all weights.
3. Compute effective sample size (ESS):
   `ESS = 1 / Σ_i (w_i^2)`.
4. If `ESS < ess_resample_ratio * N`, trigger systematic resampling.

### Resampling rule
Systematic resampling is used to reduce weight degeneracy while preserving expected posterior mass.
After resampling, all particle weights are reset to `1/N`.

## 4) Approximation error metric and acceptance bounds

### Error metric
`MeasureRuntimeBridge.approximation_error` uses **total variation distance** over finite support:

`TV(μ, ν) = 0.5 * Σ_x |μ(x) - ν(x)|`

### Acceptance bounds
`ApproximationBounds` defines deployment gates:
- `max_total_variation = 0.05`
- `min_effective_sample_ratio = 0.50` (ESS/N)

`MeasureRuntimeBridge.within_acceptance_bounds` requires both:
1. `TV <= 0.05`
2. `ESS/N >= 0.50`

If either bound is violated, caller should increase particle count, improve likelihood calibration, or shorten update intervals.
