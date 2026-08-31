# Remaining legacy baseline differences

Source run: [Visual Regression run 33397488561](https://github.com/laszlomazsar-hash/rastaimperium/actions/runs/33397488561).

The desktop `/blueprint/` diff is 7.603% changed and shows the hero copy and blueprint diagram region highlighted across most of the image, indicating a substantial baseline/export mismatch rather than a small anti-aliasing shift. The mobile `/` diff is 0.838% changed and is concentrated around the hero artwork and hero copy, consistent with a small responsive/asset-rendering drift. Both are unrelated to `/thanks-and-praise/`, which passed.

The desktop `/contact/` diff is 0.362% changed and is concentrated in the right-side “A focused path” note and nearby text, with no evidence of a broad structural shift. The desktop `/technology/verification/` diff is 0.360% changed and is concentrated around the five verification principle labels, consistent with text anti-aliasing, font metrics, or a small typography baseline difference rather than a broken page composition.

The mobile `/technology/verification/` diff is 1.587% changed and highlights the five verification principle labels while the heading and explanatory paragraph remain in place. This points to a typography/rendering mismatch or changed label styling, not a viewport overflow or missing-content failure.

Overall classification: `/blueprint/` is the only large composition/asset mismatch; the homepage artwork drift is small; Contact and Technology/Verification are small typography/text-region differences. None of these five captures is the Thanks & Praise route, and none shows the client-side exception previously seen on Governance/Codex.
