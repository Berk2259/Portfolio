"use client";

import { useEffect, useState } from "react";

type Project = {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    project_url: string | null;
    github_url?: string | null;
    tech_stack?: string | null;
    terminal_log?: string | null;
    terminal_build_cmd?: string | null;
    terminal_second_cmd?: string | null;
    terminal_second_log?: string | null;
};

type ProjectPhoto = {
    id: string;
    project_id: string;
    image_url: string;
};

type Segment = { text: string; cls: string };

function buildSegments(project: Project, os: "mac" | "win"): Segment[] {
    const prompt = os === "win" ? "PS C:\\Projects> " : "$ ";
    const ext = os === "win" ? "config" : "log";
    const fileName =
        project.title
            .toLowerCase()
            .replace(/[^a-z0-9ığüşöç]+/gi, "_")
            .slice(0, 24) + `.${ext}`;
    const catCmd = os === "win" ? `Get-Content ${fileName}` : `cat ${fileName}`;

    const bullets =
        (project.terminal_log?.trim()
            ? project.terminal_log.split("\n")
            : project.description?.split(/[•\n]/) ?? []
        )
            .map((d) => d.trim())
            .filter((d) => d.length > 0)
            .map((d) => (d.length > 55 ? d.slice(0, 52) + "..." : d)) ?? [];
    const tags =
        project.tech_stack
            ?.split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0) ?? [];

    const buildCmd = project.terminal_build_cmd?.trim() || "npm run build";

    const seg: Segment[] = [];
    seg.push({ text: prompt, cls: "text-emerald-400 font-bold" });
    seg.push({ text: `${buildCmd}\n`, cls: "" });

    const commitLines = bullets.length > 0 ? bullets : [project.title];
    commitLines.forEach((line) => {
        seg.push({ text: line + "\n", cls: "" });
    });
    seg.push({ text: "\n", cls: "" });

    if (project.terminal_second_cmd?.trim()) {
        seg.push({ text: "\n", cls: "" });
        seg.push({ text: prompt, cls: "text-emerald-400 font-bold" });
        seg.push({ text: project.terminal_second_cmd.trim() + "\n", cls: "" });

        const secondLines =
            project.terminal_second_log
                ?.split("\n")
                .map((l) => l.trim())
                .filter((l) => l.length > 0) ?? [];

        secondLines.forEach((line) => {
            seg.push({ text: line + "\n", cls: "" });
        });
    }

    seg.push({ text: "\n", cls: "" });
    seg.push({ text: prompt, cls: "text-emerald-400 font-bold" });
    seg.push({ text: catCmd + "\n", cls: "" });
    seg.push({ text: "> proje: ", cls: "text-zinc-500" });
    seg.push({ text: project.title + "\n", cls: "text-violet-300" });
    if (tags.length > 0) {
        seg.push({ text: "> teknolojiler: ", cls: "text-zinc-500" });
        seg.push({ text: tags.join(", ") + "\n", cls: "text-violet-300" });
    }
    seg.push({ text: "> durum: ", cls: "text-zinc-500" });
    seg.push({ text: "tamamlandı ✓", cls: "text-emerald-400 font-bold" });

    return seg;
}

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const PROGRESS_STEPS = 20;

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

function typeSpeedFor(ch: string) {
    if (ch === "\n") return 120;
    if (",.;:".includes(ch)) return 90;
    return 14 + Math.random() * 22;
}

function progressBar(step: number) {
    const filled = "▓".repeat(step);
    const empty = "░".repeat(PROGRESS_STEPS - step);
    const pct = Math.round((step / PROGRESS_STEPS) * 100);
    return { filled, empty, pct };
}

function Terminal({ project, title }: { project: Project; title: string }) {
    const [os, setOs] = useState<"mac" | "win">("mac");
    const [phase, setPhase] = useState<"spinner" | "progress" | "typing" | "done">(
        "spinner"
    );
    const [spinnerIdx, setSpinnerIdx] = useState(0);
    const [progressStep, setProgressStep] = useState(0);
    const [revealed, setRevealed] = useState(0);

    const segments = buildSegments(project, os);
    const flatChars: { ch: string; segIdx: number }[] = [];
    segments.forEach((seg, si) => {
        for (const ch of seg.text) flatChars.push({ ch, segIdx: si });
    });

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setPhase("spinner");
            setSpinnerIdx(0);
            setProgressStep(0);
            setRevealed(0);

            const spinnerStart = Date.now();
            while (Date.now() - spinnerStart < 900) {
                if (cancelled) return;
                setSpinnerIdx((i) => i + 1);
                await sleep(80);
            }
            if (cancelled) return;

            setPhase("progress");
            for (let step = 0; step <= PROGRESS_STEPS; step++) {
                if (cancelled) return;
                setProgressStep(step);
                await sleep(35);
            }
            await sleep(400);
            if (cancelled) return;

            setPhase("typing");
            for (let i = 0; i < flatChars.length; i++) {
                if (cancelled) return;
                setRevealed(i + 1);
                await sleep(typeSpeedFor(flatChars[i].ch));
            }
            if (cancelled) return;
            setPhase("done");
        }

        run();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project.id, os]);

    const fileName =
        project.title.toLowerCase().replace(/[^a-z0-9ığüşöç]+/gi, "_").slice(0, 24) +
        (os === "win" ? ".config" : ".log");
    const prompt = os === "win" ? "PS C:\\Projects> " : "$ ";
    const buildCmd = project.terminal_build_cmd?.trim() || "npm run build";
    const { filled, empty, pct } = progressBar(progressStep);

    let remaining = revealed;

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-extrabold text-white">{title}</h3>
                <div className="flex gap-1 bg-white/[0.06] border border-white/10 rounded-full p-[3px]">
                    <button
                        onClick={() => setOs("mac")}
                        className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${os === "mac" ? "bg-white text-black" : "text-white/50"
                            }`}
                    >
                        macOS
                    </button>
                    <button
                        onClick={() => setOs("win")}
                        className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${os === "win" ? "bg-white text-black" : "text-white/50"
                            }`}
                    >
                        Windows
                    </button>
                </div>
            </div>

            <div className="terminal-glow rounded-xl border border-white/10 bg-[#0d0d10] overflow-hidden">
                {os === "mac" ? (
                    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#1a1a1f] border-b border-white/5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                        <span className="ml-2 text-xs text-white/40 font-mono">
                            {fileName}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center justify-between pl-3 bg-[#202020] border-b border-white/10">
                        <span className="text-xs text-white/65 flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-[#0078d4] to-[#50e6ff] inline-block" />
                            Windows PowerShell
                        </span>
                        <span className="flex">
                            <span className="w-11 h-[30px] flex items-center justify-center text-xs text-white/70">
                                ─
                            </span>
                            <span className="w-11 h-[30px] flex items-center justify-center text-xs text-white/70">
                                □
                            </span>
                            <span className="w-11 h-[30px] flex items-center justify-center text-xs text-white/70 hover:bg-red-600 hover:text-white">
                                ✕
                            </span>
                        </span>
                    </div>
                )}

                <div className="px-4 py-3.5 font-mono text-[13px] leading-[1.85] min-h-[220px] text-zinc-300 whitespace-pre-wrap">
                    {phase === "spinner" && (
                        <>
                            <span className="text-emerald-400 font-bold">{prompt}</span>
                            {buildCmd}
                            {"\n"}
                            <span className="text-yellow-400">
                                {SPINNER_FRAMES[spinnerIdx % SPINNER_FRAMES.length]}
                            </span>{" "}
                            derleniyor...
                        </>
                    )}

                    {phase === "progress" && (
                        <>
                            <span className="text-emerald-400 font-bold">{prompt}</span>
                            {buildCmd}
                            {"\n"}
                            <span
                                className="text-purple-400 inline-block whitespace-nowrap"
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {filled}
                                {empty}
                            </span>{" "}
                            <span className="text-yellow-400 font-bold">{pct}%</span>
                        </>
                    )}

                    {(phase === "typing" || phase === "done") && (
                        <>
                            <span className="text-emerald-400 font-bold">{prompt}</span>
                            {buildCmd}
                            {"\n"}
                            <span
                                className="text-purple-400 inline-block whitespace-nowrap"
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {"▓".repeat(PROGRESS_STEPS)}
                            </span>{" "}
                            <span className="text-yellow-400 font-bold">100%</span>
                            {"\n"}
                            <span className="text-emerald-400 font-bold">
                                ✓ derleme başarılı
                            </span>
                            {"\n\n"}
                            {segments.map((seg, i) => {
                                const take = Math.max(0, Math.min(seg.text.length, remaining));
                                remaining -= take;
                                return (
                                    <span key={i} className={seg.cls}>
                                        {seg.text.slice(0, take)}
                                    </span>
                                );
                            })}
                        </>
                    )}

                    {phase !== "done" && (
                        <span className="inline-block w-[7px] h-[14px] bg-purple-500 ml-0.5 align-middle" />
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProjectsShowcase({
    projects,
    projectPhotos,
}: {
    projects: Project[];
    projectPhotos: ProjectPhoto[];
}) {
    const [selectedId, setSelectedId] = useState(projects[0]?.id);

    if (!projects || projects.length === 0) return null;

    const selected = projects.find((p) => p.id === selectedId) ?? projects[0];
    const tags =
        selected.tech_stack
            ?.split(",")
            .map((t: string) => t.trim())
            .filter((t: string) => t.length > 0) ?? [];
    const photos = projectPhotos.filter((p) => p.project_id === selected.id);

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* LİSTE */}
            <div className="flex flex-col gap-4 w-full md:w-130 shrink-0">
                {projects.map((project, i) => (
                    <button
                        key={project.id}
                        onClick={() => setSelectedId(project.id)}
                        className={`flex items-center justify-between gap-4 p-4 min-h-[150px] rounded-2xl border text-left transition-colors ${project.id === selected.id
                            ? "bg-indigo-500/10 border-indigo-400/50"
                            : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/15"
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            {project.image_url ? (
                                <img
                                    src={project.image_url}
                                    alt={project.title}
                                    className="w-24 h-24 object-cover rounded-xl shrink-0"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-600/30 shrink-0" />
                            )}
                            <div>
                                <div className="text-white font-semibold text-base mb-1">
                                    {project.title}
                                </div>
                                {project.tech_stack && (
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {project.tech_stack
                                            .split(",")
                                            .map((t) => t.trim())
                                            .filter((t) => t.length > 0)
                                            .slice(0, 3)
                                            .map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[10px] text-indigo-300 border border-indigo-400/25 bg-indigo-400/10 rounded-full px-2 py-0.5"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                    </div>
                                )}
                                {project.description && (
                                    <p className="text-xs text-white/45 mt-1.5 line-clamp-2 max-w-[260px]">
                                        {project.description
                                            .split(/[•\n]/)
                                            .map((d) => d.trim())
                                            .filter((d) => d.length > 0)[0]
                                            ?.replace(/^[^\p{L}\p{N}]+/u, "")}
                                    </p>
                                )}
                            </div>
                        </div>
                        <svg
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={`shrink-0 transition-colors ${project.id === selected.id
                                ? "text-indigo-400"
                                : "text-white/20"
                                }`}
                        >
                            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                ))}
            </div>

            {/* DETAY */}
            <div className="flex-1 w-full rounded-[20px] border border-white/10 bg-gradient-to-br from-[#15111f] to-[#0d0a15] overflow-hidden min-h-[480px]">
                <div key={selected.id} className="animate-fade-in-up p-6">
                    <Terminal project={selected} title={selected.title} />

                    {photos.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {photos.map((photo) => (
                                <img
                                    key={photo.id}
                                    src={photo.image_url}
                                    alt={selected.title}
                                    className="w-full aspect-[4/3] object-cover rounded-xl border border-white/10 transition-transform hover:-translate-y-1"
                                />
                            ))}
                        </div>
                    )}

                    {selected.description && (
                        <p className="text-white/70 text-[15px] leading-relaxed mb-4">
                            {selected.description}
                        </p>
                    )}
                    {tags.length > 0 && (
                        <div className="mb-2">
                            {tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="inline-flex text-xs text-indigo-300 border border-indigo-400/30 bg-indigo-400/10 rounded-full px-3 py-1 mr-2 mb-2"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-3 mt-3">
                        {selected.project_url && (
                            <a
                                href={selected.project_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm bg-white text-black font-semibold rounded-full px-5 py-2 hover:bg-gray-200 transition-colors"
                            >
                                Canlı Gör
                            </a>
                        )}
                        {selected.github_url && (
                            <a
                                href={selected.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm border border-white/30 text-white font-semibold rounded-full px-5 py-2 hover:border-white transition-colors"
                            >
                                GitHub
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
