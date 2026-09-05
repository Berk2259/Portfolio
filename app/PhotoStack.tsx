"use client";

import { useState } from "react";

type Photo = {
    id: string;
    image_url: string;
};

export default function PhotoStack({ photos }: { photos: Photo[] }) {
    const [expanded, setExpanded] = useState(false);

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
        <div
            onClick={() => setExpanded(!expanded)}
            className="relative hidden md:block w-[700px] h-[700px] shrink-0 mt-4 cursor-pointer"
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
    );
}