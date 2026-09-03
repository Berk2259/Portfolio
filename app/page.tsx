import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: projects } = await supabase.from("projects").select("*");
  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .single();

  return (
    <div>
      <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-start">
        {/* dekoratif gradient toplar */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 px-6 md:pl-50 max-w-10xl text-center md:text-left">
          {/* avatar */}
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
            <span className="flex items-center gap-2 rounded-full border border-gray-700 px-4 py-1 text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {profile?.badge_text}
            </span>

            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {profile?.name}
            </h1>

            <p className="text-xl text-gray-400">{profile?.title}</p>

            <p className="max-w-2xl text-gray-500">{profile?.bio}</p>

            <div className="flex gap-4 mt-2">
              <a
                href="#projeler"
                className="rounded-full bg-white text-black px-6 py-2 font-medium hover:bg-gray-200 transition-colors"
              >
                Projelerimi Gör
              </a>
              <a
                href="#iletisim"
                className="rounded-full border border-gray-600 px-6 py-2 font-medium hover:border-gray-400 hover:bg-white/5 transition-colors"
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
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 text-gray-400 hover:text-white hover:border-gray-400 transition-colors"
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
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 text-gray-400 hover:text-white hover:border-gray-400 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" />
                </svg>
              </a>
              <a
                href={`mailto:${profile?.email}`}
                aria-label="E-posta"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 text-gray-400 hover:text-white hover:border-gray-400 transition-colors"
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
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-16">
        <section id="hakkimda">
          <h2 className="text-2xl font-semibold mb-4">Hakkımda</h2>
          <p>
            Burada kendinle ilgili 2-3 cümlelik kısa bir tanıtım yazacaksın:
            kim olduğun, ne ile ilgilendiğin, neler yaptığın.
          </p>
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