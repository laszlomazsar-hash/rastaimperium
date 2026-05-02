# Structural Dynamics as a Hybrid System

This note replaces purely continuous-map assumptions with a hybrid-system formulation so theorem statements reflect the actual structural dynamics (continuous parameter adaptation plus discrete topology changes).

## 1) State decomposition: discrete topology mode + continuous parameters

Let the overall state be
\[
z = (q, x) \in \mathcal{Z} := \mathcal{Q} \times \mathbb{R}^n,
\]
where:

- \(q \in \mathcal{Q}\) is a **discrete mode** encoding topology class (e.g., graph structure/model architecture family).
- \(x \in \mathbb{R}^n\) is the **continuous state** encoding within-topology parameters.

Interpretation:

- Changes in \(x\) describe smooth adaptation while topology class is fixed.
- Changes in \(q\) describe structural events (split/merge/prune) that may also reset/transform \(x\).

## 2) Separate flow map and jump map

### Flow dynamics (between structural events)

Define flow set \(C \subseteq \mathcal{Z}\) and flow map
\[
F: C \rightrightarrows \mathbb{R}^n,
\]
with hybrid inclusion
\[
\dot q = 0, \qquad \dot x \in F(q,x), \qquad (q,x) \in C.
\]
Thus topology mode remains fixed during flow.

### Jump dynamics (structural events)

Define jump set \(D \subseteq \mathcal{Z}\) and jump map
\[
G: D \rightrightarrows \mathcal{Z},
\]
with jump inclusion
\[
(q^+, x^+) \in G(q,x), \qquad (q,x) \in D.
\]

Encode structural operators as branches of \(G\):

- **Split:** \((q^+,x^+) \in G_{\mathrm{split}}(q,x)\)
- **Merge:** \((q^+,x^+) \in G_{\mathrm{merge}}(q,x)\)
- **Prune:** \((q^+,x^+) \in G_{\mathrm{prune}}(q,x)\)

and set
\[
G(q,x) = G_{\mathrm{split}}(q,x) \cup G_{\mathrm{merge}}(q,x) \cup G_{\mathrm{prune}}(q,x)
\]
(on states where each branch is admissible).

## 3) Regularity assumptions for jump map

To support existence/robustness statements, assume:

1. **Closed graph:** \(\operatorname{gph} G\) is closed in \(\mathcal{Z}\times\mathcal{Z}\).
2. **Outer semicontinuity (OSC):** \(G\) is OSC on \(D\).
3. **Local boundedness:** \(G\) is locally bounded on \(D\).
4. **Nonemptiness on jump set:** \(G(z)\neq\varnothing\) for all \(z\in D\).

Likewise, for flow dynamics assume standard hybrid regularity (closed \(C\), OSC and locally bounded \(F\), nonempty convex values when required by the result).

## 4) Proposition A (hybrid reformulation)

### Proposition A (Hybrid structural-dynamics well-posedness)

Consider the hybrid system
\[
\mathcal{H}:\quad
\begin{cases}
\dot q = 0,\ \dot x \in F(q,x), & (q,x)\in C,\\
(q^+,x^+)\in G(q,x), & (q,x)\in D.
\end{cases}
\]
Assume:

- \(C,D\subseteq\mathcal{Z}\) are closed.
- \(F\) is OSC, locally bounded on \(C\), and has nonempty (convex, if needed) values.
- \(G\) is OSC, locally bounded on \(D\), has closed graph, and nonempty values on \(D\).

Then \(\mathcal{H}\) is well-posed in the hybrid-systems sense: from each initial state in \(\overline{C}\cup D\), there exists at least one hybrid arc satisfying the flow/jump inclusions; limits of graph-convergent solution sequences remain solutions of \(\mathcal{H}\).

### Why this replaces the old proposition

A proposition stated only with a continuous map \(T\) on a continuous state space cannot represent split/merge/prune transitions without collapsing discrete topology changes into an artificial continuous surrogate. The hybrid form above models both regimes directly and aligns theorem assumptions with actual structural dynamics.
