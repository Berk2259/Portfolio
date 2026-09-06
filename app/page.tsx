import { supabase } from "@/lib/supabase";
import PhotoStack from "./PhotoStack";
import ExperiencePhoto from "./ExperiencePhoto";
import TechFloat from "./TechFloat";

export default async function Home() {
  const { data: projects } = await supabase.from("projects").select("*");
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .single();
  const { data: educations } = await supabase
    .from("education")
    .select("*")
    .order("created_at", { ascending: true });
  const { data: gallery } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: true });
  const { data: experiences } = await supabase
    .from("experience")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: experiencePhotos } = await supabase
    .from("experience_photos")
    .select("*")
    .order("created_at", { ascending: true });
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div>
      <section
        className="relative overflow-hidden min-h-[90vh] flex items-center justify-start"
        style={{
          background:
            "linear-gradient(180deg, #0d1526 0%, #131e36 45%, #0a0e1a 100%)",
        }}
      >
        {/* dekoratif gradient toplar */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[55%]"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
        >
          <path
            fill="#1a2440"
            d="M0,320L80,300C160,280,320,240,480,245C640,250,800,300,960,300C1120,300,1280,250,1360,225L1440,200L1440,400L0,400Z"
          />
          <path
            fill="#131c33"
            d="M0,360L100,340C200,320,400,280,600,275C800,270,1000,300,1200,310C1300,315,1360,317,1440,320L1440,400L0,400Z"
          />
          <path
            fill="#0d1424"
            d="M0,400L0,390C200,385,400,375,600,378C800,381,1000,397,1200,395C1300,394,1360,392,1440,390L1440,400Z"
          />
        </svg>

        <TechFloat skills={skills ?? []} />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 px-6 md:pl-50 max-w-10xl text-center md:text-left">
          <div className="relative shrink-0 animate-fade-in-up">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 blur-2xl opacity-40 scale-105" />
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name ?? "Profil fotoğrafı"}
                className="relative w-56 h-56 md:w-80 md:h-80 rounded-full object-cover shadow-2xl ring-4 ring-white/10"
              />
            ) : (
              <div className="relative w-56 h-56 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-6xl font-bold text-white shadow-2xl ring-4 ring-white/10">
                {profile?.name?.[0] ?? "?"}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center md:items-start gap-4 animate-fade-in-up delay-150">
            {/* rozet */}
            <span className="flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-4 py-1 text-sm text-white/90">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {profile?.badge_text}
            </span>

            <h1 className="text-5xl sm:text-6xl font-bold text-white drop-shadow-lg">
              {profile?.name}
            </h1>

            <p className="text-xl text-white/90">{profile?.title}</p>

            <p className="max-w-2xl text-white/70">{profile?.bio}</p>

            <div className="flex gap-4 mt-2">
              <a
                href="#projeler"
                className="rounded-full bg-white text-black px-6 py-2 font-medium hover:bg-gray-200 transition-colors"
              >
                Projelerimi Gör
              </a>
              <a
                href="#iletisim"
                className="rounded-full border border-white/40 px-6 py-2 font-medium text-white hover:border-white hover:bg-white/10 transition-colors"
              >
                İletişime Geç
              </a>
            </div>

            {/* sosyal ikonlar */}
            <div className="flex gap-3 mt-4">
              <a
                href={profile?.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 bg-black/20 text-white/80 hover:text-white hover:border-white transition-colors"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.15-.02-2.09-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.09 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </a>
              <a
                href={profile?.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 bg-black/20 text-white/80 hover:text-white hover:border-white transition-colors"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" />
                </svg>
              </a>
              <a
                href={`mailto:${profile?.email}`}
                aria-label="E-posta"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 bg-black/20 text-white/80 hover:text-white hover:border-white transition-colors"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M2 4h20v16H2V4Zm2 2.4V18h16V6.4l-8 6-8-6Zm.6-.4 7.4 5.55L19.4 6H4.6Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DİĞER BÖLÜMLER */}
      <div className="w-full px-6 md:pl-32 py-16 space-y-16">
        <section id="egitim">
          <h2 className="text-3xl font-semibold mb-8">Eğitim</h2>
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <ul className="relative border-l-2 border-gradient-to-b space-y-10 pl-8 max-w-2xl">
              {educations?.map((edu, i) => (
                <li
                  key={edu.id}
                  className="relative group animate-fade-in-up"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {/* nokta + parıltı */}
                  <span className="absolute -left-[41px] top-1">
                    <span className="absolute inset-0 w-4 h-4 rounded-full bg-purple-500 blur-md opacity-60" />
                    <span className="relative block w-4 h-4 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 ring-4 ring-black" />
                  </span>

                  <div className="rounded-xl p-4 -ml-4 transition-colors group-hover:bg-white/5">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-lg">{edu.school}</h3>
                      {edu.start_year && (
                        <span className="text-sm text-indigo-300 border border-indigo-400/30 bg-indigo-400/10 rounded-full px-3 py-1">
                          {edu.start_year} - {edu.end_year}
                        </span>
                      )}
                    </div>
                    {edu.degree && (
                      <p className="text-gray-400 text-base mt-1">
                        {edu.degree}
                      </p>
                    )}
                    {edu.description && (
                      <p className="text-gray-500 text-base mt-1">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* FOTOĞRAF STACK */}
            <div className="ml-auto">
              <PhotoStack photos={gallery ?? []} />
            </div>
          </div>
        </section>

        <section id="deneyim">
          <h2 className="text-3xl font-semibold mb-12 text-center">
            Deneyim
          </h2>
          <div className="relative w-full">
            {/* ORTA ÇİZGİ */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-400 to-purple-500" />

            <div className="space-y-12">
              {experiences?.map((exp, i) => {
                const photos =
                  experiencePhotos?.filter(
                    (p) => p.experience_id === exp.id
                  ) ?? [];
                const isEven = i % 2 === 0;
                return (
                  <div
                    key={exp.id}
                    className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 animate-fade-in-up"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    {/* SOL SÜTUN */}
                    <div className={isEven ? "text-left" : "flex justify-center"}>
                      {isEven ? (
                        <div className="rounded-xl p-4 transition-colors hover:bg-white/5">
                          <div className="flex flex-wrap items-center justify-start gap-3">
                            <h3 className="font-semibold text-lg">
                              {exp.company}
                            </h3>
                            {exp.start_date && (
                              <span className="text-sm text-indigo-300 border border-indigo-400/30 bg-indigo-400/10 rounded-full px-3 py-1">
                                {exp.start_date} - {exp.end_date}
                              </span>
                            )}
                          </div>
                          {(exp.position || exp.work_type) && (
                            <p className="text-gray-400 text-base mt-1">
                              {exp.position}
                              {exp.work_type && ` • ${exp.work_type}`}
                            </p>
                          )}
                          {exp.description && (
                            <ul className="text-gray-500 text-base mt-2 space-y-1 list-disc list-inside">
                              {exp.description
                                .split("•")
                                .map((item: string) => item.trim())
                                .filter((item: string) => item.length > 0)
                                .map((item: string, idx: number) => (
                                  <li key={idx}>{item}</li>
                                ))}
                            </ul>
                          )}
                        </div>
                      ) : (
                        photos.length > 0 && (
                          <ExperiencePhoto photos={photos} alt={exp.company} />
                        )
                      )}
                    </div>

                    {/* ORTA: NOKTA */}
                    <div className="relative w-4 flex justify-center">
                      <span className="absolute top-2">
                        <span className="absolute inset-0 w-4 h-4 rounded-full bg-purple-500 blur-md opacity-60" />
                        <span className="relative block w-4 h-4 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 ring-4 ring-black" />
                      </span>
                    </div>

                    {/* SAĞ SÜTUN */}
                    <div className={isEven ? "flex justify-center" : "text-left"}>
                      {isEven ? (
                        photos.length > 0 && (
                          <ExperiencePhoto photos={photos} alt={exp.company} />
                        )
                      ) : (
                        <div className="rounded-xl p-4 transition-colors hover:bg-white/5">
                          <div className="flex flex-wrap items-center justify-start gap-3">
                            <h3 className="font-semibold text-lg">
                              {exp.company}
                            </h3>
                            {exp.start_date && (
                              <span className="text-sm text-indigo-300 border border-indigo-400/30 bg-indigo-400/10 rounded-full px-3 py-1">
                                {exp.start_date} - {exp.end_date}
                              </span>
                            )}
                          </div>
                          {(exp.position || exp.work_type) && (
                            <p className="text-gray-400 text-base mt-1">
                              {exp.position}
                              {exp.work_type && ` • ${exp.work_type}`}
                            </p>
                          )}
                          {exp.description && (
                            <ul className="text-gray-500 text-base mt-2 space-y-1 list-disc list-inside">
                              {exp.description
                                .split("•")
                                .map((item: string) => item.trim())
                                .filter((item: string) => item.length > 0)
                                .map((item: string, idx: number) => (
                                  <li key={idx}>{item}</li>
                                ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="projeler">
          <h2 className="text-2xl font-semibold mb-4">Projeler</h2>
          <ul className="space-y-4">
            {projects?.map((project) => (
              <li key={project.id}>
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-gray-400">{project.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="iletisim">
          <h2 className="text-2xl font-semibold mb-4">İletişim</h2>
          <p>E-posta: {profile?.email}</p>
        </section>
      </div>
    </div>
  );
}