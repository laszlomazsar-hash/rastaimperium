"use client";

import { useRef, useState } from "react";

type MotionStudy = {
  id: string;
  index: string;
  title: string;
  eyebrow: string;
  description: string;
  source: string;
  poster: string;
  duration: string;
};

const motionStudies: MotionStudy[] = [
  {
    id: "kernel-roots",
    index: "01",
    title: "Kernel / roots",
    eyebrow: "EVO-V system image",
    description: "A visual passage from the EVO-V codex to kernel structure, connected roots, and an accountable future-city horizon.",
    source: "/motion-codex/kernel-roots.mp4",
    poster: "/motion-codex/kernel-roots-poster.jpg",
    duration: "8 s loop",
  },
  {
    id: "evo-v-book-release",
    index: "02",
    title: "EVO-V publication",
    eyebrow: "Codex release",
    description: "A publication-led study introducing the EVO-V volume and its governance-oriented visual language.",
    source: "/motion-codex/evo-v-book-release.mp4",
    poster: "/motion-codex/evo-v-book-release-poster.jpg",
    duration: "8 s loop",
  },
  {
    id: "kernel-explainer",
    index: "03",
    title: "What is a kernel?",
    eyebrow: "Concept sequence",
    description: "A concise motion explainer for the kernel framing: a durable structure that gives a future system an accountable centre.",
    source: "/motion-codex/kernel-explainer.mp4",
    poster: "/motion-codex/kernel-explainer-poster.jpg",
    duration: "6 s loop",
  },
  {
    id: "civilization-kernel",
    index: "04",
    title: "Civilization kernel",
    eyebrow: "System horizon",
    description: "A blue-spectrum systems study that connects codex, dashboard, architecture, and shared roots across a coherent whole.",
    source: "/motion-codex/civilization-kernel.mp4",
    poster: "/motion-codex/civilization-kernel-poster.jpg",
    duration: "8 s loop",
  },
  {
    id: "rastafarai-codex",
    index: "05",
    title: "RastafarAI Codex",
    eyebrow: "Editorial identity",
    description: "A luminous editorial sequence for the RastafarAI Codex, placing human discernment and symbolic intelligence at the centre.",
    source: "/motion-codex/rastafarai-codex.mp4",
    poster: "/motion-codex/rastafarai-codex-poster.jpg",
    duration: "8 s loop",
  },
  {
    id: "visionary-codex",
    index: "06",
    title: "Visionary codex",
    eyebrow: "Mythic interface",
    description: "A warm, ceremonial visual study that extends the codex language into a more symbolic and imaginative system horizon.",
    source: "/motion-codex/visionary-codex.mp4",
    poster: "/motion-codex/visionary-codex-poster.jpg",
    duration: "8 s loop",
  },
];

export function MotionCodexGallery() {
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);

  function toggleMotion(study: MotionStudy) {
    const video = videoRefs.current[study.id];
    if (!video) return;

    if (playingId === study.id) {
      video.pause();
      setPlayingId(null);
      return;
    }

    Object.entries(videoRefs.current).forEach(([id, element]) => {
      if (id !== study.id) element?.pause();
    });

    video.play().then(() => setPlayingId(study.id)).catch(() => setPlayingId(null));
  }

  return (
    <section className="border-y border-[#B8860B]/15 bg-[#070807]" aria-labelledby="motion-codex-heading">
      <div className="container-page py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">Motion Codex / 01</p>
            <h2 id="motion-codex-heading" className="mt-5 max-w-xl text-3xl leading-tight text-zinc-100 sm:text-4xl">
              A moving language for the EVO-V system horizon.
            </h2>
          </div>
          <div className="max-w-2xl border-l border-[#B8860B]/25 pl-5 sm:pl-7">
            <p className="text-lg leading-8 text-zinc-300">
              These studies translate the codex, kernel, and civilizational ideas into short portrait sequences. Select a study to play it; only one loop runs at a time.
            </p>
            <p className="mt-4 font-courier text-xs uppercase tracking-[0.18em] text-zinc-500">
              Six supplied motion studies · muted · user-controlled
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {motionStudies.map((study) => {
            const isPlaying = playingId === study.id;

            return (
              <article
                key={study.id}
                className={`group overflow-hidden border bg-[#0b0c0b] transition duration-300 ${isPlaying ? "border-[#D4AF37]/80 shadow-xl shadow-[#B8860B]/10" : "border-zinc-800 hover:-translate-y-1 hover:border-[#B8860B]/60"}`}
              >
                <div className="relative aspect-[9/14] overflow-hidden bg-black">
                  <video
                    ref={(element) => {
                      videoRefs.current[study.id] = element;
                    }}
                    className="h-full w-full object-cover"
                    poster={study.poster}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={`${study.title} motion study`}
                    onPlay={() => setPlayingId(study.id)}
                    onPause={() => {
                      if (playingId === study.id) setPlayingId(null);
                    }}
                  >
                    <source src={study.source} type="video/mp4" />
                  </video>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" aria-hidden="true" />
                  <div className="absolute left-5 right-5 top-5 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em]">
                    <span className="font-courier text-[#F2D675]">{study.index}</span>
                    <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[0.62rem] text-zinc-300 backdrop-blur">{study.duration}</span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                    <p className="max-w-[11rem] text-xs font-semibold uppercase tracking-[0.18em] text-zinc-200">{study.eyebrow}</p>
                    <button
                      type="button"
                      onClick={() => toggleMotion(study)}
                      className="shrink-0 rounded-full border border-[#D4AF37]/70 bg-black/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#F2D675] transition hover:border-[#F2D675] hover:bg-[#D4AF37] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D675] focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.97]"
                      aria-pressed={isPlaying}
                      aria-label={`${isPlaying ? "Pause" : "Play"} ${study.title} motion study`}
                    >
                      {isPlaying ? "Pause" : "Play"}
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl text-zinc-100">{study.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{study.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
