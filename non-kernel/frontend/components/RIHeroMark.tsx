import RISeal from "./RISeal";

/**
 * Premium homepage identity treatment.
 * Canonical 3D LM raster + restrained CSS depth on pointer hover.
 * No WebGL, continuous spin, or large 3D dependencies.
 * prefers-reduced-motion yields a static mark.
 */
export default function RIHeroMark() {
  return (
    <div
      className="relative mx-auto w-full max-w-[22rem] text-center"
      aria-label="Rasta Imperium LM monogram — primary brand identity"
    >
      <div
        className="pointer-events-none absolute inset-8 rounded-full bg-[#D4AF37]/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto aspect-square w-full max-w-[18rem] overflow-hidden rounded-[2rem] border border-[rgba(242,214,117,0.28)] bg-[#090a09] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(242,214,117,0.12)] [perspective:900px] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:hover:[transform:perspective(900px)_rotateX(-2deg)_rotateY(4deg)_translateY(-3px)_scale(1.015)] motion-reduce:[transform:none]">
        <div
          className="absolute inset-3 rounded-[1.5rem] border border-[rgba(242,214,117,0.12)]"
          aria-hidden="true"
        />
        <img
          src="/images/logo-lm-3d.jpg"
          alt="Rasta Imperium LM monogram"
          width={1500}
          height={1500}
          loading="eager"
          decoding="async"
          className="h-full w-full rounded-[1.5rem] object-cover [transform:translateZ(18px)]"
        />
        <div
          className="absolute bottom-5 right-5 rounded-full border border-[rgba(242,214,117,0.4)] bg-[#090a09]/85 p-2 shadow-lg backdrop-blur-sm"
          aria-hidden="true"
        >
          <RISeal size={42} variant="gold" />
        </div>
      </div>
      <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.28em] text-[#B88718]">
        Identity · Witness · Verification
      </p>
    </div>
  );
}
