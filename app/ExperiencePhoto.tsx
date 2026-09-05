"use client";

import { useState } from "react";

type Photo = {
  id: string;
  image_url: string;
};

export default function ExperiencePhoto({
  photos,
  alt,
}: {
  photos: Photo[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  function handleClick() {
    setIndex((prev) => (prev + 1) % photos.length);
  }

  return (
    <div
      onClick={photos.length > 1 ? handleClick : undefined}
      className={`relative hidden md:block w-140 h-70 rounded-lg overflow-hidden ring-2 ring-white/10 ${
        photos.length > 1 ? "cursor-pointer" : ""
      }`}
    >
      <img
        src={photos[index].image_url}
        alt={alt}
        className="w-full h-full object-cover"
      />

      {photos.length > 1 && (
        <span className="absolute top-2 right-2 bg-black/70 text-white text-xs font-medium rounded-full px-2 py-0.5">
          +{photos.length - 1}
        </span>
      )}

      {photos.length > 1 && (
        <div className="absolute bottom-2 right-2 flex gap-1">
          {photos.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === index ? "bg-black" : "bg-black/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}