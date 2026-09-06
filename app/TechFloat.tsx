type Skill = {
    id: string;
    name: string;
    logo_url: string | null;
};

export default function TechFloat({ skills }: { skills: Skill[] }) {
    if (!skills || skills.length === 0) return null;

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
            <div className="relative flex items-center justify-start gap-8 w-full">
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className="flex flex-col items-center gap-1 shrink-0"
                    >
                        {skill.logo_url && (
                            <img
                                src={skill.logo_url}
                                alt={skill.name}
                                className="w-12 h-12 object-contain drop-shadow-lg"
                            />
                        )}
                        <span className="text-xs text-white/70">{skill.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}