type Skill = {
    id: string;
    name: string;
    logo_url: string | null;
};

export default function TechFloat({ skills }: { skills: Skill[] }) {
    if (!skills || skills.length === 0) return null;

    const track = [...skills, ...skills];

    return (
        <div
            className="order-2 lg:order-none static lg:absolute lg:bottom-16 left-0 w-full overflow-hidden ml-6 md:ml-12 lg:ml-50 mt-10 lg:mt-0 [mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)]"
        >
            <div className="marquee-track flex items-center w-max">
                {track.map((skill, i) => (
                    <div
                        key={`${skill.id}-${i}`}
                        className="flex flex-col items-center gap-1 shrink-0 mr-6 md:mr-8"
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