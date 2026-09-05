const icons = [
    { name: "React", bg: "#0f2942", type: "react" as const },
    { name: "Flutter", bg: "#0553B1", label: "Fl" },
    { name: "Python", bg: "#2b5b84", label: "Py" },
    { name: "JavaScript", bg: "#F7DF1E", label: "JS", dark: true },
    { name: "PostgreSQL", bg: "#336791", label: "SQL" },
    { name: "Next.js", bg: "#000000", label: "N" },
    { name: "TypeScript", bg: "#3178C6", label: "TS" },
];

function IconBadge({ icon }: { icon: (typeof icons)[number] }) {
    return (
        <div
            className="tech-badge shrink-0"
            style={{
                background: icon.bg,
                color: icon.dark ? "#1a1a1a" : "white",
                animation: "none",
            }}
        >
            {icon.type === "react" ? (
                <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#61dafb"
                    strokeWidth="1"
                >
                    <circle cx="12" cy="12" r="2.2" fill="#61dafb" stroke="none" />
                    <ellipse cx="12" cy="12" rx="10" ry="4.2" />
                    <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
                    <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
                </svg>
            ) : (
                icon.label
            )}
            <span className="tech-tooltip">{icon.name}</span>
        </div>
    );
}

export default function TechFloat() {
    const doubled = icons;

    return (
        <div
            className="absolute bottom-16 left-0 w-full overflow-hidden px-6 md:pl-50"
            style={{
                maskImage:
                    "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            }}
        >
            <div className="relative flex items-center">
                <div className="relative flex items-center justify-start gap-8 w-full">
                    {doubled.map((icon, i) => (
                        <IconBadge key={i} icon={icon} />
                    ))}
                </div>
            </div>
        </div>
    );
}