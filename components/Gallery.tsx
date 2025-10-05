
"use client";
import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function Gallery({ images }: { images: string[] }) {
  const [active, setActive] = React.useState<string | null>(null);
  if (!images || images.length === 0) return null;
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((src, i) => (
          <button key={i} className="group overflow-hidden rounded-2xl border" onClick={() => setActive(src)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`gallery ${i + 1}`} className="h-40 w-full object-cover group-hover:opacity-95" />
          </button>
        ))}
      </div>
      {active && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setActive(null)}>
          <div className="relative max-h-[90vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow hover:bg-white" onClick={() => setActive(null)} aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <Image src={active} alt="enlarged image" width={1600} height={1200} className="h-auto w-full rounded-xl object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
