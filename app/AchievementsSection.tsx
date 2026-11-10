"use client";

import { useState } from "react";
import { localize } from "@/app/i18n";

export type Achievement = {
    id: string;
    title: string;
    title_en: string | null;
    subtitle: string | null;
    subtitle_en: string | null;
    description: string | null;
    description_en: string | null;
    year: string | null;
    tags: string | null;
    tags_en: string | null;
    color: string | null;
    role?: string | null;
    role_en?: string | null;
    highlights?: string | null;
    highlights_en?: string | null;
};

export type AchievementPhoto = {
    id: string;
    achievement_id: string;
    image_url: string;
};

const ACH_COLORS: Record<string, string> = {
    orange: "#f97316",
    green: "#10b981",
    blue: "#6366f1",
    purple: "#c026d3",
};

export default function AchievementsSection({
    achievements,
    achievementPhotos,
    locale,
}: {
    achievements: Achievement[];
    achievementPhotos: AchievementPhoto[];
    locale: string;
}) {
    const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
    const [flippingCards, setFlippingCards] = useState<Record<string, boolean>>({});
    const [activeGalleryId, setActiveGalleryId] = useState<string | null>(null);
    const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>("");

    if (!achievements || achievements.length === 0) return null;

    function toggleFlip(id: string) {
        setFlippedCards((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
        setFlippingCards((prev) => ({ ...prev, [id]: true }));
        setTimeout(() => {
            setFlippingCards((prev) => ({ ...prev, [id]: false }));
        }, 700);
    }

    function openGallery(achievementId: string, initialPhotoUrl?: string) {
        const photos = achievementPhotos.filter((p) => p.achievement_id === achievementId);
        setActiveGalleryId(achievementId);
        setSelectedPhotoUrl(initialPhotoUrl || photos[0]?.image_url || "");

        const galEl = document.getElementById("galleryExpandSection");
        if (galEl) {
            galEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function closeGallery() {
        setActiveGalleryId(null);
    }

    // 1 + 3 BİRLEŞİK: HASSAS TILT & FARE TAKİBİ
    function handleTilt(e: React.MouseEvent<HTMLDivElement>, id: string) {
        if (flippedCards[id]) return;

        const cardScene = e.currentTarget;
        const rect = cardScene.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Abartısız, sakin 3D eğim (maksimum 7 derece)
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        const wrapper = cardScene.querySelector<HTMLElement>(".tilt-wrapper");
        if (wrapper) {
            wrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            wrapper.style.boxShadow = `0 15px 35px -10px rgba(0, 0, 0, 0.7)`;
        }

        // Işık koordinatlarını hem arkadaki buğuya hem öndeki buzlu cama aktar
        cardScene.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
        cardScene.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
    }

    function resetTilt(e: React.MouseEvent<HTMLDivElement>, id: string) {
        if (flippedCards[id]) return;
        const cardScene = e.currentTarget;
        const wrapper = cardScene.querySelector<HTMLElement>(".tilt-wrapper");
        if (wrapper) {
            wrapper.style.transform = `rotateX(0deg) rotateY(0deg) translateY(0px)`;
            wrapper.style.boxShadow = `none`;
        }
    }

    const activeAchievement = achievements.find((a) => a.id === activeGalleryId);
    const activePhotos = activeGalleryId
        ? achievementPhotos.filter((p) => p.achievement_id === activeGalleryId)
        : [];

    return (
        <div className="space-y-10 relative">

            {/* BÖLÜM BAŞLIĞI */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-semibold text-purple-200 mb-3 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        <span>{locale === "en" ? "COMMUNITY & ACHIEVEMENTS" : "ETKİNLİK ARŞİVİ & TOPLULUK"}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        {locale === "en" ? "Events &" : "Etkinlikler &"}{" "}
                        <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                            {locale === "en" ? "Achievements" : "Başarılar"}
                        </span>
                    </h2>
                    <p className="text-sm md:text-base text-zinc-400 mt-2 max-w-lg">
                        {locale === "en"
                            ? "Hackathons, tech summits, workshops and developer community experiences."
                            : "Katıldığım hackathonlar, teknoloji zirveleri, atölyeler ve topluluk deneyimleri."}
                    </p>
                </div>
            </div>

            {/* SİNEMATİK GENİŞLEYEN GALERİ (EXPAND) */}
            {activeGalleryId && activeAchievement && (
                <div
                    id="galleryExpandSection"
                    className="transition-all duration-500 bg-[#121217]/95 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6"
                >
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                                📷 {locale === "en" ? "Cinema Gallery" : "Sinematik Sahne Galerisi"}
                            </span>
                            <span className="text-xs text-zinc-300 font-semibold">
                                {localize(activeAchievement, "title", locale)}
                            </span>
                        </div>
                        <button
                            onClick={closeGallery}
                            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-bold transition-all flex items-center gap-1.5"
                        >
                            ✕ {locale === "en" ? "Close" : "Kapat"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8 space-y-3">
                            <div className="w-full h-96 md:h-[34rem] rounded-2xl overflow-hidden bg-black/80 border border-white/10 relative">
                                <img
                                    src={selectedPhotoUrl || activePhotos[0]?.image_url}
                                    alt="Etkinlik Sahnesi"
                                    className="w-full h-full object-cover transition-all duration-300"
                                />
                            </div>

                            {activePhotos.length > 1 && (
                                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                                    {activePhotos.map((p) => (
                                        <img
                                            key={p.id}
                                            src={p.image_url}
                                            onClick={() => setSelectedPhotoUrl(p.image_url)}
                                            alt=""
                                            className={`w-20 h-14 rounded-xl object-cover cursor-pointer transition-all shrink-0 border-2 ${selectedPhotoUrl === p.image_url
                                                ? "border-purple-400 scale-105"
                                                : "border-white/20 hover:border-white/50 opacity-70 hover:opacity-100"
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-4 space-y-4">
                            <h3 className="text-xl font-bold text-white leading-snug">
                                {localize(activeAchievement, "title", locale)}
                            </h3>
                            {activeAchievement.subtitle && (
                                <p className="text-xs font-semibold text-purple-400">
                                    {localize(activeAchievement, "subtitle", locale)}
                                </p>
                            )}
                            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                                {localize(activeAchievement, "description", locale)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 3'LÜ KART GRID'İ (1 + 3 BİRLEŞİK IŞIK EFEKTİ) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {achievements.map((ach) => {
                    const photos = achievementPhotos.filter((p) => p.achievement_id === ach.id);
                    const coverPhoto = photos[0]?.image_url || "/icon.png";
                    const isFlipped = !!flippedCards[ach.id];
                    const isFlipping = !!flippingCards[ach.id];

                    const title = localize(ach, "title", locale) || ach.title;
                    const subtitle = localize(ach, "subtitle", locale);
                    const description = localize(ach, "description", locale);
                    const role = localize(ach as any, "role", locale) || subtitle;
                    const highlightsRaw = localize(ach as any, "highlights", locale);
                    const highlights = highlightsRaw
                        ? highlightsRaw.split("\n").filter((l: string) => l.trim().length > 0)
                        : [];

                    const tags =
                        (locale === "en" && ach.tags_en ? ach.tags_en : ach.tags)
                            ?.split(",")
                            .map((t) => t.trim())
                            .filter((t) => t.length > 0) ?? [];

                    const accent = ACH_COLORS[ach.color ?? "purple"] ?? ACH_COLORS.purple;

                    return (
                        <div
                            key={ach.id}
                            className={`card-scene h-[490px] w-full ${isFlipped ? "is-flipped" : ""} ${isFlipping ? "is-flipping" : ""}`}
                            style={{ ["--accent-glow" as any]: `${accent}48` }}
                            onMouseMove={(e) => handleTilt(e, ach.id)}
                            onMouseLeave={(e) => resetTilt(e, ach.id)}
                        >
                            <div className="tilt-wrapper w-full h-full">

                                <div className={`flip-inner w-full h-full ${isFlipped ? "flipped" : ""}`}>

                                    {/* ================= ÖN YÜZ ================= */}
                                    <article className="flip-front bg-[#111116] border border-white/[0.08] flex flex-col justify-between relative shadow-2xl">

                                        {/* 1. EFEKT: ARKADAN SIZAN YUMUŞAK MOR BUĞU (artık ön yüzle birlikte döner) */}
                                        <div className="ambient-halo-glow" />

                                        {/* 3. EFEKT: ÖN YÜZDEKİ SAF BUZLU CAM YANSIMASI */}
                                        <div className="glass-frosted-sheen" />

                                        <div className="flex-1 min-h-0 overflow-hidden">
                                            {/* Üst Resim */}
                                            <div
                                                onClick={() => openGallery(ach.id, coverPhoto)}
                                                className="h-56 bg-zinc-900 relative cursor-pointer group overflow-hidden"
                                                title={locale === "en" ? "Open Photo Gallery" : "Galeriyi Aç"}
                                            >
                                                <img
                                                    src={coverPhoto}
                                                    alt={title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-transparent" />

                                                {/* Kategori Rozeti */}
                                                <span
                                                    className="absolute top-3.5 left-3.5 text-xs font-semibold bg-black/60 backdrop-blur-md px-3 py-1 rounded-full shadow-lg border"
                                                    style={{ color: accent, borderColor: `${accent}55` }}
                                                >
                                                    {localize(ach, "category", locale) || (locale === "en" ? "Event" : "Etkinlik")}
                                                </span>

                                                {/* Yıl Rozeti */}
                                                {ach.year && (
                                                    <span className="absolute top-3.5 right-3.5 text-xs text-indigo-300 border border-indigo-400/30 bg-black/60 px-2.5 py-0.5 rounded-full shadow-lg">
                                                        {ach.year}
                                                    </span>
                                                )}

                                                {/* Fotoğraf Sayacı */}
                                                <span className="absolute bottom-3 right-3 text-[11px] font-medium text-white/90 bg-black/80 hover:bg-purple-900 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all shadow-md">
                                                    <span>📷</span> {photos.length} {locale === "en" ? "Photos ↗" : "Fotoğraf ↗"}
                                                </span>
                                            </div>

                                            {/* Gövde Metinleri */}
                                            <div className="p-6 space-y-2">
                                                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                                                    {title}
                                                </h3>
                                                {subtitle && (
                                                    <p className="text-xs font-medium" style={{ color: accent }}>
                                                        ⚡ {subtitle}
                                                    </p>
                                                )}
                                                {description && (
                                                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                                                        {description}
                                                    </p>
                                                )}

                                                {/* Etiketler */}
                                                {tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                        {tags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/5"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Alt Bar: 3D Flip Butonu */}
                                        <div className="p-4 border-t border-white/5 shrink-0">
                                            <button
                                                onClick={() => toggleFlip(ach.id)}
                                                className="w-full py-3 px-3.5 rounded-xl bg-purple-600/70 hover:bg-purple-600 text-purple-100 hover:text-white font-semibold transition-all flex items-center justify-center gap-1.5 border border-purple-500/30 text-xs"
                                            >
                                                <span></span> {locale === "en" ? "Details" : "Detaylar"}
                                            </button>
                                        </div>
                                    </article>

                                    {/* ================= ARKA YÜZ (FLIP DETAY) ================= */}
                                    <div className="flip-back p-6 flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between pb-3 border-b border-white/10">
                                                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                                                    <span>⚡</span> {locale === "en" ? "Behind the Scenes" : "Sahne Arkası & Rolüm"}
                                                </span>
                                                <button
                                                    onClick={() => toggleFlip(ach.id)}
                                                    className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/10 transition-colors"
                                                >
                                                    ← {locale === "en" ? "Flip Back" : "Ön Yüze Dön"}
                                                </button>
                                            </div>

                                            {/* Rol Alanı */}
                                            {role && (
                                                <div className="p-3 rounded-xl bg-black/40 border" style={{ borderColor: `${accent}33` }}>
                                                    <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                                                        {locale === "en" ? "My Role:" : "Üstlendiğim Rol:"}
                                                    </div>
                                                    <div className="text-sm font-bold text-white mt-0.5">
                                                        {role}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Kazanımlar / Highlights */}
                                            {highlights.length > 0 ? (
                                                <div className="space-y-2 text-xs text-zinc-300">
                                                    {highlights.map((h: string, idx: number) => (
                                                        <div key={idx} className="flex items-start gap-2">
                                                            <span className="font-bold" style={{ color: accent }}>{idx + 1}.</span>
                                                            <span>{h}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-zinc-400 leading-relaxed">
                                                    {description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Arka Yüz Butonu */}
                                        <div className="pt-3 border-t border-white/10">
                                            <button
                                                onClick={() => toggleFlip(ach.id)}
                                                className="w-full py-3.5 px-3.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-zinc-300 hover:text-white font-semibold transition-all text-xs border border-white/10"
                                            >
                                                {locale === "en" ? "Close" : "Kapat"}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}