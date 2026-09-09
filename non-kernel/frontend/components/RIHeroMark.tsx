import RISeal from "./RISeal";

/**
 * Premium identity treatment for the homepage only.
 * The raster 3D mark remains the canonical artwork; CSS supplies restrained depth.
 * No WebGL, dependency, or animation is required.
 */
export default function RIHeroMark() {
  return (
    <div className="ri-hero-mark" aria-label="Rasta Imperium LM identity mark">
      <div className="ri-hero-mark__halo" aria-hidden="true" />
      <div className="ri-hero-mark__stage">
        <img
          src="/images/logo-lm-3d.jpg"
          alt="Rasta Imperium LM monogram"
          width={1500}
          height={1500}
          loading="eager"
          decoding="async"
          className="ri-hero-mark__image"
        />
        <div className="ri-hero-mark__seal" aria-hidden="true">
          <RISeal size={58} variant="gold" />
        </div>
      </div>
      <p className="ri-hero-mark__caption" aria-hidden="true">
        IDENTITY · WITNESS · VERIFICATION
      </p>
    </div>
  );
}
