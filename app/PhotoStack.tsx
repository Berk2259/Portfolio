"use client";

import { useRef, useState } from "react";

type Photo = {
    id: string;
    image_url: string;
};

export default function PhotoStack({ photos }: { photos: Photo[] }) {
    const [expanded, setExpanded] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const drag = useRef({ startX: 0, scrollLeft: 0 });

    function handleMouseDown(e: React.MouseEvent) {
        const el = scrollRef.current;
        if (!el) return;
        drag.current = { startX: e.pageX, scrollLeft: el.scrollLeft };

        function handleMouseMove(ev: MouseEvent) {
            if (!el) return;
            const delta = ev.pageX - drag.current.startX;
            el.scrollLeft = drag.current.scrollLeft - delta;
        }

        function handleMouseUp() {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }

    const collapsedPositions = [
        "rotate-[-4deg] -translate-x-2 -translate-y-2",
        "rotate-[6deg] translate-x-8 -translate-y-4",
        "rotate-[-7deg] -translate-x-12 translate-y-8",
        "rotate-[10deg] translate-x-16 translate-y-14",
    ];

    const expandedPositions = [
        "rotate-0 -translate-x-44 -translate-y-44",
        "rotate-0 translate-x-44 -translate-y-44",
        "rotate-0 -translate-x-44 translate-y-44",
        "rotate-0 translate-x-44 translate-y-44",
    ];

    if (!photos || photos.length === 0) return null;

    return (
        <>
            {/* Mobil/tablet: yatay kaydırmalı galeri */}
            <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                className="flex lg:hidden gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide cursor-grab active:cursor-grabbing select-none"
            >
                {photos.map((photo) => (
                    <img
                        key={photo.id}
                        src={photo.image_url}
                        alt="Galeri fotoğrafı"
                        draggable={false}
                        className="w-44 h-44 sm:w-52 sm:h-52 shrink-0 snap-start object-cover rounded-xl shadow-xl ring-2 ring-white/10"
                    />
                ))}
            </div>

            {/* Masaüstü: döndürülmüş kart yığını */}
            <div
                onClick={() => setExpanded(!expanded)}
                className="relative hidden lg:block w-[700px] h-[700px] shrink-0 mt-4 cursor-pointer"
            >
                {photos.map((photo, i) => {
                    const pos = expanded
                        ? expandedPositions[i % expandedPositions.length]
                        : collapsedPositions[i % collapsedPositions.length];
                    return (
                        <img
                            key={photo.id}
                            src={photo.image_url}
                            alt="Galeri fotoğrafı"
                            className={`absolute inset-0 m-auto w-80 h-80 object-cover rounded-xl shadow-2xl ring-4 ring-black/40 transition-all duration-500 ease-in-out ${pos}`}
                            style={{ zIndex: expanded ? i : photos.length - i }}
                        />
                    );
                })}
            </div>
        </>
    );
}