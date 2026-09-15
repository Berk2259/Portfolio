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
        "rotate-[-8deg] top-0 left-0",
        "rotate-[6deg] top-3 left-3",
        "rotate-[-4deg] top-6 left-6",
        "rotate-[9deg] top-9 left-9",
    ];

    const expandedPositions = [
        "rotate-0 top-0 left-0",
        "rotate-0 top-0 left-[350px]",
        "rotate-0 top-[350px] left-0",
        "rotate-0 top-[350px] left-[350px]",
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
                            className={`absolute w-80 h-80 object-cover rounded-xl shadow-2xl ring-4 ring-black/40 transition-all duration-500 ease-in-out ${pos}`}
                            style={{ zIndex: expanded ? i : photos.length - i }}
                        />
                    );
                })}
            </div>
        </>
    );
}