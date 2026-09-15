type Skill = {
    id: string;
    name: string;
    logo_url: string | null;
};

export default function TechFloat({ skills }: { skills: Skill[] }) {
    if (!skills || skills.length === 0) return null;

    return (
        <div
            className="order-2 lg:order-none static lg:absolute lg:bottom-16 left-0 w-full overflow-hidden px-6 md:pl-12 lg:pl-50 mt-10 lg:mt-0 lg:[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] lg:[-webkit-mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
        >
            <div className="relative flex flex-wrap items-center justify-center gap-x-4 gap-y-3 lg:flex-nowrap lg:justify-start lg:gap-8 w-full">
                {skills.map((skill) => (
                    <div
                        key={skill.id}
                        className="flex flex-col items-center gap-1 shrink-0"
                    >
                        {skill.logo_url && (
                            <img
                                src={skill.logo_url}
                                alt={skill.name}
                                className="w-8 h-8 md:w-12 md:h-12 object-contain drop-shadow-lg"
                            />
                        )}
                        <span className="text-[10px] md:text-xs text-white/70">{skill.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}