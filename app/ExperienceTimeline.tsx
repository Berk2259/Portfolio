"use client";

import { useEffect, useRef, useState } from "react";

type Experience = {
    id: string;
    company: string;
    position: string | null;
    start_date: string | null;
    end_date: string | null;
    description: string | null;
    work_type: string | null;
    highlight: string | null;
};

type ExperiencePhoto = {
    id: string;
    experience_id: string;
    image_url: string;
};

type ExperienceSkillLink = {
    id: string;
    experience_id: string;
    skill_id: string;
};

type Skill = {
    id: string;
    name: string;
    logo_url: string | null;
};

const PALETTE = [
    { c1: "#818cf8", c2: "#a855f7" }, // indigo -> purple
    { c1: "#a3e635", c2: "#10b981" }, // lime -> emerald
    { c1: "#f87171", c2: "#fb923c" }, // red -> orange
    { c1: "#38bdf8", c2: "#6366f1" }, // sky -> indigo
];

function pickIcon(text: string) {
    const t = text.toLowerCase();
    if (/(mobil|flutter|android|ios|app)/.test(t)) return "📱";
    if (/(veri|sql|database|backend|api)/.test(t)) return "🗄️";
    if (/(web|frontend|react|wordpress)/.test(t)) return "💻";
    if (/(staj|intern)/.test(t)) return "🎓";
    return "💼";
}

function isOngoing(endDate: string | null) {
    if (!endDate || !endDate.trim()) return true;
    return /halen|devam|present|current/i.test(endDate);
}

function parseMonthYear(value: string | null): { y: number; m: number } | null {
    if (!value) return null;
    const match = value.trim().match(/^(\d{1,2})[./-](\d{4})$/);
    if (!match) return null;
    return { m: Number(match[1]), y: Number(match[2]) };
}

function formatDuration(start: string | null, end: string | null) {
    const s = parseMonthYear(start);
    if (!s) return null;

    let e: { y: number; m: number };
    if (isOngoing(end)) {
        const now = new Date();
        e = { y: now.getFullYear(), m: now.getMonth() + 1 };
    } else {
        const parsed = parseMonthYear(end);
        if (!parsed) return null;
        e = parsed;
    }

    let months = (e.y - s.y) * 12 + (e.m - s.m) + 1;
    if (months < 1) months = 1;
    const y = Math.floor(months / 12);
    const m = months % 12;
    const parts: string[] = [];
    if (y > 0) parts.push(`${y} yıl`);
    if (m > 0 || y === 0) parts.push(`${m} ay`);
    return parts.join(" ");
}

function PolaroidPhoto({
    photos,
    alt,
    tilt,
    c1,
    c2,
    workType,
}: {
    photos: ExperiencePhoto[];
    alt: string;
    tilt: number;
    c1: string;
    c2: string;
    workType?: string | null;
}) {
    const [index, setIndex] = useState(0);
    if (!photos || photos.length === 0) return null;

    return (
        <div
            onClick={
                photos.length > 1
                    ? () => setIndex((prev) => (prev + 1) % photos.length)
                    : undefined
            }
            className={`relative w-full max-w-[300px] bg-white pt-4 px-4 pb-14 rounded-md transition-transform duration-500 ease-out hover:!rotate-0 hover:scale-[1.03] hover:-translate-y-1 ${photos.length > 1 ? "cursor-pointer" : ""
                }`}
            style={{
                transform: `rotate(${tilt}deg)`,
                boxShadow: `0 0 0 2px rgba(255,255,255,0.55), 0 20px 40px -14px ${c1}55, 0 8px 20px -4px rgba(0,0,0,0.65)`,
            }}
        >
            {/* washi-tape sticker */}
            <span
                className="absolute -top-3.5 right-4 w-16 h-6 rounded-sm opacity-90"
                style={{
                    background: `repeating-linear-gradient(45deg, ${c1}, ${c1} 6px, ${c2} 6px, ${c2} 12px)`,
                    transform: "rotate(8deg)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
            />

            <span
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
                style={{
                    background: `radial-gradient(circle at 35% 30%, #fff, ${c1} 60%, ${c2})`,
                    boxShadow: "0 3px 6px rgba(0,0,0,0.4)",
                }}
            />

            {workType && (
                <span
                    className="absolute -left-3.5 bottom-2 flex items-center gap-1.5 bg-[#16151c] border border-white/10 text-zinc-300 text-[11px] font-semibold px-2.5 py-1.5 rounded-full shadow-lg"
                    style={{ transform: "rotate(-4deg)" }}
                >
                    📍 {workType}
                </span>
            )}
            <img
                src={photos[index].image_url}
                alt={alt}
                className="block w-full aspect-[4/3] object-cover rounded-sm border-2 border-black/70"
            />
            <p
                className="absolute left-2.5 right-2.5 bottom-2.5 text-center text-gray-800 text-sm"
                style={{ fontFamily: "'Segoe Print','Comic Sans MS',cursive" }}
            >
                {alt}
            </p>
            {photos.length > 1 && (
                <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-medium rounded-full px-2 py-0.5">
                    +{photos.length - 1}
                </span>
            )}
        </div>
    );
}

function TimelineItem({
    exp,
    photos,
    index,
    skills,
}: {
    exp: Experience;
    photos: ExperiencePhoto[];
    index: number;
    skills: Skill[];
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(true);
                });
            },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const { c1, c2 } = PALETTE[index % PALETTE.length];
    const ongoing = isOngoing(exp.end_date);
    const duration = formatDuration(exp.start_date, exp.end_date);
    const icon = pickIcon(`${exp.position ?? ""} ${exp.company ?? ""}`);
    const cardOnLeft = index % 2 === 0;
    const tilt = index % 2 === 0 ? -3 : 2.4;

    const bullets =
        exp.description
            ?.split("•")
            .map((s) => s.trim())
            .filter((s) => s.length > 0) ?? [];

    const card = (
               <div
            className="relative w-full max-w-[900px] rounded-[20px] border border-white/8 p-[2px] transition-all duration-700 ease-out"
            style={{
                background:
                    "linear-gradient(160deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01))",
                opacity: active ? 1 : 0,
                transform: active ? "translateY(0)" : "translateY(28px)",
            }}
        >
            <div className="relative overflow-hidden rounded-[18px] px-7 py-6">
                <div
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: `linear-gradient(90deg, ${c1}, ${c2})` }}
                />
                <div className="flex items-center justify-between gap-2.5 flex-wrap mb-0.5">
                    <div className="flex items-center gap-2">
                        <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
                            style={{
                                background: `linear-gradient(135deg, ${c1}, ${c2})`,
                                opacity: 0.9,
                            }}
                        >
                            {icon}
                        </span>
                        <span className="font-bold text-white text-[17.5px]">
                            {exp.position || exp.company}
                        </span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        {exp.start_date && (
                            <span
                                className="text-[13px] font-bold text-white rounded-full px-3 py-1.5 whitespace-nowrap"
                                style={{
                                    background: `linear-gradient(90deg, ${c1}, ${c2})`,
                                }}
                            >
                                {exp.start_date} – {ongoing ? "Halen" : exp.end_date}
                            </span>
                        )}
                        {duration && (
                            <span className="text-sm font-medium text-zinc-300">{duration}</span>
                        )}
                    </div>
                </div>
                <p className="text-[12.5px] text-zinc-400 mt-1 mb-4">
                    {exp.company}
                    {exp.work_type && ` • ${exp.work_type}`}
                </p>
                {bullets.length > 0 && (
                    <ul className="space-y-2.5">
                        {bullets.map((b, i) => (
                            <li
                                key={i}
                                className="relative pl-[22px] text-[14.5px] leading-[1.75] text-zinc-300"
                            >
                                <span
                                    className="absolute left-0 top-[5px] w-3 h-3 rounded bg-center bg-no-repeat opacity-85"
                                    style={{
                                        backgroundColor: c1,
                                        backgroundImage:
                                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E\")",
                                        backgroundSize: "8px",
                                    }}
                                />
                                {b}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );

    const hasSidePanel = skills.length > 0 || Boolean(exp.highlight);

    const sidePanel = hasSidePanel && (
        <div className="flex flex-col gap-5 w-[400px] pt-1">
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-4">
                    {skills.map((skill) => (
                        <div key={skill.id} className="flex flex-col items-center gap-2">
                            <span
                                className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden"
                                style={{
                                    backgroundColor: `${c1}1a`,
                                    border: `1px solid ${c1}4d`,
                                }}
                            >
                                {skill.logo_url ? (
                                    <img
                                        src={skill.logo_url}
                                        alt={skill.name}
                                        className="w-9 h-9 object-contain"
                                    />
                                ) : (
                                    <span className="text-2xl">💠</span>
                                )}
                            </span>
                            <span className="text-[11.5px] text-zinc-400">{skill.name}</span>
                        </div>
                    ))}
                </div>
            )}

            {exp.highlight && (
                <div
                    className="rounded-2xl px-5 py-4"
                    style={{
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderLeft: `3px solid ${c1}`,
                    }}
                >
                    <p
                        className="text-[9.5px] tracking-[0.12em] uppercase font-bold mb-3.5"
                        style={{ color: c1 }}
                    >
                        Öne Çıkan Başarı
                    </p>
                    <ul className="flex flex-col gap-3">
                        {exp.highlight
                            ?.split("\n")
                            .map((line) => line.trim())
                            .filter((line) => line.length > 0)
                            .map((line, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <span
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                                        style={{
                                            background: `linear-gradient(135deg, ${c1}, ${c2})`,
                                        }}
                                    >
                                        {i + 1}
                                    </span>
                                    <span className="text-[13.5px] text-zinc-300 leading-relaxed">
                                        {line}
                                    </span>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );

    const photo = photos.length > 0 && (
        <div
            className={`transition-all duration-700 ease-out delay-100 flex items-center gap-10 ${cardOnLeft ? "flex-row" : "flex-row-reverse"
                }`}
            style={{
                opacity: active ? 1 : 0,
                transform: active ? "translateY(0)" : "translateY(28px)",
            }}
        >
            <PolaroidPhoto
                photos={photos}
                alt={exp.company}
                tilt={tilt}
                c1={c1}
                c2={c2}
                workType={exp.work_type}
            />
            {sidePanel}
        </div>
    );

    return (
        <div
            ref={ref}
            className="relative grid grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] gap-10 mb-24 last:mb-0"
        >
            {/* connector */}
            <div
                className="absolute top-1/2 -translate-y-1/2 h-[2px] w-10 transition-opacity duration-500 delay-300 hidden md:block"
                style={{
                    opacity: active ? 0.55 : 0,
                    ...(cardOnLeft
                        ? {
                            right: "calc(50% + 32px)",
                            background: `linear-gradient(270deg, ${c1}, transparent)`,
                        }
                        : {
                            left: "calc(50% + 32px)",
                            background: `linear-gradient(90deg, ${c1}, transparent)`,
                        }),
                }}
            />

            <div className="h-full flex items-center justify-center">
                {cardOnLeft ? card : photo}
            </div>

            <div className="h-full flex items-center justify-center relative">
                <div
                    className="relative w-4 h-4 rounded-full border transition-all duration-500 z-10"
                    style={{
                        background: active
                            ? `linear-gradient(135deg, ${c1}, ${c2})`
                            : "#111015",
                        borderColor: active ? "transparent" : "rgba(255,255,255,0.1)",
                        boxShadow: active ? "0 0 0 5px rgba(255,255,255,0.04)" : "none",
                        transform: active ? "scale(1.06)" : "scale(1)",
                    }}
                >
                    {ongoing && active && (
                        <span
                            className="absolute -inset-1.5 rounded-full animate-[expPulseRing_2.2s_ease-out_infinite]"
                            style={{ border: `1.5px solid ${c1}` }}
                        />
                    )}
                </div>
            </div>

            <div className="h-full flex items-center justify-start">
                {cardOnLeft ? photo : card}
            </div>
        </div>
    );
}

export default function ExperienceTimeline({
    experiences,
    experiencePhotos,
    experienceSkills,
    skills,
}: {
    experiences: Experience[];
    experiencePhotos: ExperiencePhoto[];
    experienceSkills: ExperienceSkillLink[];
    skills: Skill[];
}) {
    const railRef = useRef<HTMLDivElement>(null);
    const fillRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function updateRail() {
            const rail = railRef.current;
            const fill = fillRef.current;
            if (!rail || !fill) return;
            const rect = rail.getBoundingClientRect();
            const vh = window.innerHeight;
            const total = rect.height;
            const scrolled = Math.min(Math.max(vh * 0.6 - rect.top, 0), total);
            fill.style.height = `${(scrolled / total) * 100}%`;
        }
        window.addEventListener("scroll", updateRail);
        updateRail();
        return () => window.removeEventListener("scroll", updateRail);
    }, []);

    if (!experiences || experiences.length === 0) return null;

    return (
        <div className="relative" ref={railRef}>
            <div className="absolute left-1/2 -translate-x-1/2 top-1.5 bottom-1.5 w-0.5 bg-white/5">
                <div
                    ref={fillRef}
                    className="absolute left-0 top-0 w-full h-0 transition-[height] duration-500 ease-out"
                    style={{
                        background: "linear-gradient(to bottom, #a855f7, #6366f1)",
                    }}
                />
            </div>

            {experiences.map((exp, i) => (
                <TimelineItem
                    key={exp.id}
                    exp={exp}
                    photos={experiencePhotos.filter(
                        (p) => p.experience_id === exp.id
                    )}
                    skills={experienceSkills
                        .filter((es) => es.experience_id === exp.id)
                        .map((es) => skills.find((s) => s.id === es.skill_id))
                        .filter((s): s is Skill => Boolean(s))}
                    index={i}
                />
            ))}
        </div>
    );
}
