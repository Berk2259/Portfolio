import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
import PhotoStack from "./PhotoStack";
import TechFloat from "./TechFloat";
import ProjectsShowcase from "./ProjectsShowcase";
import ExperienceTimeline from "./ExperienceTimeline";
import ContactSection from "./ContactSection";

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
  const { data: experienceSkills } = await supabase
    .from("experience_skills")
    .select("*");
  const { data: contactInfo } = await supabase
    .from("contact_info")
    .select("*")
    .single();
  const { data: quizQuestions } = await supabase
    .from("contact_quiz_questions")
    .select("*");
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("created_at", { ascending: true });
  const { data: projectPhotos } = await supabase
    .from("project_photos")
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
          </div>
        </div>
      </section>

      {/* DİĞER BÖLÜMLER */}
      <div className="w-full px-6 md:px-32 py-16 space-y-16">
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
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-xs tracking-[0.18em] uppercase text-purple-400 font-semibold mb-2">
              Kariyer Yolculuğu
            </p>
            <h2 className="text-3xl font-extrabold bg-gradient-to-br from-white via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
              Deneyim
            </h2>
          </div>
          <ExperienceTimeline
            experiences={experiences ?? []}
            experiencePhotos={experiencePhotos ?? []}
            experienceSkills={experienceSkills ?? []}
            skills={skills ?? []}
          />
        </section>

        <section id="projeler">
          <h2 className="text-3xl font-semibold mb-8">Projeler</h2>
          <ProjectsShowcase
            projects={projects ?? []}
            projectPhotos={projectPhotos ?? []}
          />
        </section>

        <section id="iletisim">
          <ContactSection
            profile={profile}
            contactInfo={contactInfo}
            quizQuestions={quizQuestions ?? []}
            projectCount={projects?.length ?? 0}
            experienceCount={experiences?.length ?? 0}
            skillCount={skills?.length ?? 0}
          />
        </section>
      </div>
    </div>
  );
}

