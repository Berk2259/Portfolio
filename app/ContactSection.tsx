"use client";

import { useState } from "react";
type Profile = {
    id: number;
    name: string | null;
    title: string | null;
    bio: string | null;
    badge_text: string | null;
    avatar_url: string | null;
};

type ContactInfo = {
    id: number;
    email: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    cv_url: string | null;
    heading: string | null;
    description: string | null;
};

type QuizQuestion = {
    id: string;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: "a" | "b" | "c" | "d";
};

function ContactRow({
    icon,
    label,
    value,
    href,
    delay = 0,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    href: string;
    delay?: number;
}) {
    return (
        <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-white/8 bg-[#0e0c17] px-5 py-4 text-white no-underline transition-transform duration-200 hover:translate-x-1"
        >
            <span
                className="pointer-events-none absolute inset-y-0 w-1/2"
                style={{
                    background:
                        "linear-gradient(100deg, transparent, rgba(196,181,253,0.16), transparent)",
                    animation: `contactShine 3.2s ease-in-out ${delay}s infinite`,
                }}
            />
            <span className="relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500">
                {icon}
            </span>
            <span className="relative z-[1] flex-1">
                <span className="block text-lg font-bold">{label}</span>
            </span>
            <span className="relative z-[1] text-zinc-500 transition-all duration-200 group-hover:translate-x-1 group-hover:text-purple-300">
                →
            </span>
        </a>
    );
}

export default function ContactSection({
    profile,
    contactInfo,
    quizQuestions,
    projectCount,
    experienceCount,
    skillCount,
}: {
    profile: Profile | null;
    contactInfo: ContactInfo | null;
    quizQuestions: QuizQuestion[];
    projectCount: number;
    experienceCount: number;
    skillCount: number;
}) {
    if (!profile) return null;

    return (
        <div className="relative">

            <div className="relative z-[1] mb-10 text-left">
                <h2 className="text-3xl font-semibold mb-2">İletişim</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-400">
                    Birlikte Çalışalım
                </span>
            </div>

            <div className="relative z-[1] grid grid-cols-1 items-start gap-32 md:grid-cols-[auto_1fr]">
                <div>
                    <h2 className="mb-4 bg-gradient-to-br from-white via-purple-300 to-fuchsia-300 bg-clip-text text-[36px] font-extrabold leading-tight text-transparent">
                        {contactInfo?.heading || "Birlikte bir şeyler inşa edelim"}
                    </h2>
                    <p className="mb-7 max-w-[420px] text-[14.5px] leading-[1.75] text-zinc-400">
                        {contactInfo?.description ||
                            "Bir staj/iş fırsatı sunmak, projeni birlikte konuşmak ya da sadece merhaba demek istersen, aşağıdaki kanallardan bana ulaşabilirsin. Genelde 24 saat içinde dönüş yaparım."}
                    </p>

                    <div className="mb-7 flex max-w-[420px] gap-3">
                        <div className="flex-1 rounded-2xl border border-white/8 bg-white/[0.03] px-2.5 py-3.5 text-center">
                            <div className="text-xl font-extrabold text-white">{projectCount}</div>
                            <div className="mt-0.5 text-[10.5px] text-zinc-400">Proje</div>
                        </div>
                        <div className="flex-1 rounded-2xl border border-white/8 bg-white/[0.03] px-2.5 py-3.5 text-center">
                            <div className="text-xl font-extrabold text-white">{experienceCount}</div>
                            <div className="mt-0.5 text-[10.5px] text-zinc-400">Deneyim</div>
                        </div>
                        <div className="flex-1 rounded-2xl border border-white/8 bg-white/[0.03] px-2.5 py-3.5 text-center">
                            <div className="text-xl font-extrabold text-white">{skillCount}</div>
                            <div className="mt-0.5 text-[10.5px] text-zinc-400">Teknoloji</div>
                        </div>
                    </div>

                    <a
                        href={contactInfo?.cv_url || "#"}
                        target={contactInfo?.cv_url ? "_blank" : undefined}
                        rel={contactInfo?.cv_url ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:border-purple-400/50 hover:bg-purple-400/10"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ededed" strokeWidth={2}>
                            <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
                        </svg>
                        CV İndir
                    </a>
                </div>

                <div className="flex items-stretch gap-16">
                    <div className="flex max-w-[560px] flex-1 flex-col gap-3">
                        {contactInfo?.email && (
                            <ContactRow
                                delay={0}
                                href={`mailto:${contactInfo.email}`}
                                label="E-posta"
                                value={contactInfo.email}
                                icon={
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                                        <rect x="3" y="5" width="18" height="14" rx="2" />
                                        <path d="M3 7l9 6 9-6" />
                                    </svg>
                                }
                            />
                        )}
                        {contactInfo?.github_url && (
                            <ContactRow
                                delay={0.5}
                                href={contactInfo.github_url}
                                label="GitHub"
                                value={contactInfo.github_url.replace(/^https?:\/\//, "")}
                                icon={
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                                        <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.5 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.24 9.24 0 0 1 5 0c1.9-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .28.18.61.69.5A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
                                    </svg>
                                }
                            />
                        )}
                        {contactInfo?.linkedin_url && (
                            <ContactRow
                                delay={1}
                                href={contactInfo.linkedin_url}
                                label="LinkedIn"
                                value={contactInfo.linkedin_url.replace(/^https?:\/\//, "")}
                                icon={
                                    <svg width="19" height="19" viewBox="0 0 24 24" fill="#fff">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                }
                            />
                        )}
                    </div>

                    <QuizBlob questions={quizQuestions} />
                </div>
            </div>
        </div>
    );
}



const LETTERS = ["a", "b", "c", "d"] as const;

function QuizBlob({ questions }: { questions: QuizQuestion[] }) {
    const [wobbling, setWobbling] = useState(false);
    const [current, setCurrent] = useState<QuizQuestion | null>(null);
    const [selected, setSelected] = useState<"a" | "b" | "c" | "d" | null>(null);

    function pickQuestion() {
        if (questions.length === 0) return null;
        if (questions.length === 1) return questions[0];
        let next: QuizQuestion;
        do {
            next = questions[Math.floor(Math.random() * questions.length)];
        } while (current && next.id === current.id);
        return next;
    }

    function handleNewQuestion() {
        setWobbling(false);
        requestAnimationFrame(() => setWobbling(true));
        setSelected(null);
        setCurrent(pickQuestion());
    }

    const feedback =
        selected === null ? null : selected === current?.correct_option ? "correct" : "wrong";

    const blobShadow =
        feedback === "correct"
            ? "0 0 30px 8px rgba(74,222,128,0.55)"
            : feedback === "wrong"
              ? "0 0 30px 8px rgba(248,113,113,0.5)"
              : "0 0 30px 6px rgba(168,85,247,0.4)";

    return (
        <div className="flex items-start gap-4 shrink-0">
            <div className="flex w-[130px] shrink-0 flex-col items-center gap-2.5">
                <div
                    onClick={handleNewQuestion}
                    className="h-[72px] w-[72px] cursor-pointer shrink-0"
                    style={{
                        background: "linear-gradient(135deg, #818cf8, #a855f7, #f0abfc)",
                        boxShadow: blobShadow,
                        transition: "box-shadow 0.3s ease",
                        animation: wobbling
                            ? "contactMorph 6s ease-in-out infinite, contactHue 8s linear infinite, contactWobble 0.9s ease-out"
                            : "contactMorph 6s ease-in-out infinite, contactHue 8s linear infinite",
                    }}
                />
                {!current ? (
                    <p className="text-center text-xs leading-relaxed text-zinc-400">
                        Küçük bir soruyla beni tanı — blob&apos;a tıkla 👆
                    </p>
                ) : (
                    <p
                        key={current.id}
                        style={{ animation: "contactCardIn 0.38s cubic-bezier(.22,1,.36,1) both" }}
                        className="text-center text-[12.5px] font-bold leading-snug text-zinc-100"
                    >
                        {current.question}
                    </p>
                )}
            </div>

            {current && (
                <div className="flex min-w-[170px] flex-1 flex-col gap-2 pt-0.5">
                    {LETTERS.map((letter, i) => {
                        const isCorrect = selected !== null && letter === current.correct_option;
                        const isWrong = selected === letter && letter !== current.correct_option;
                        return (
                            <button
                                key={`${current.id}-${letter}`}
                                type="button"
                                disabled={selected !== null}
                                onClick={() => setSelected(letter)}
                                style={{
                                    animation: `contactOptIn 0.3s ease ${i * 0.06}s both${
                                        isCorrect ? ", contactPop 0.3s ease" : ""
                                    }`,
                                }}
                                className={`flex w-full items-center gap-2.5 rounded-[10px] border px-3 py-2.5 text-left text-[12.5px] transition-colors ${
                                    isCorrect
                                        ? "border-green-400/60 bg-green-400/10 text-green-200"
                                        : isWrong
                                          ? "border-red-400/60 bg-red-400/10 text-red-200"
                                          : selected !== null
                                            ? "border-white/10 bg-white/[0.03] text-zinc-500"
                                            : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-purple-400/50 hover:bg-purple-400/[0.08]"
                                }`}
                            >
                                <span
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] text-[10.5px] font-extrabold ${
                                        isCorrect
                                            ? "bg-green-400/25 text-green-400"
                                            : isWrong
                                              ? "bg-red-400/25 text-red-400"
                                              : "bg-white/[0.06] text-zinc-400"
                                    }`}
                                >
                                    {letter.toUpperCase()}
                                </span>
                                {current[`option_${letter}`]}
                            </button>
                        );
                    })}

                    {selected !== null && (
                        <>
                            <p
                                className={`min-h-[16px] text-xs font-bold ${
                                    feedback === "correct" ? "text-green-400" : "text-red-400"
                                }`}
                            >
                                {feedback === "correct"
                                    ? "✓ Doğru bildin!"
                                    : `✗ Yanlış, doğru cevap: ${current[`option_${current.correct_option}`]}`}
                            </p>
                            <p className="text-[10.5px] text-zinc-500">
                                Yeni soru için blob&apos;a tekrar tıkla ↻
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}