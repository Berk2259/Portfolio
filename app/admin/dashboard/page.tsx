"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Project = {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    project_url: string | null;
    tech_stack: string | null;
    github_url: string | null;
    terminal_log: string | null;
    terminal_build_cmd: string | null;
    terminal_second_cmd: string | null;
    terminal_second_log: string | null;
};

type Education = {
    id: string;
    school: string;
    degree: string | null;
    start_year: string | null;
    end_year: string | null;
    description: string | null;
};

type GalleryPhoto = {
    id: string;
    image_url: string;
};

type Profile = {
    id: number;
    name: string | null;
    title: string | null;
    bio: string | null;
    badge_text: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    email: string | null;
    avatar_url: string | null;
};

type Experience = {
    id: string;
    company: string;
    position: string | null;
    start_date: string | null;
    end_date: string | null;
    description: string | null;
    work_type: string | null;
};

type ExperiencePhoto = {
    id: string;
    experience_id: string;
    image_url: string;
};

type Skill = {
    id: string;
    name: string;
    logo_url: string | null;
};

type ProjectPhoto = {
    id: string;
    project_id: string;
    image_url: string;
};

const TABS = [
    { key: "profile", label: "Profil", icon: "👤" },
    { key: "projects", label: "Projeler", icon: "💼" },
    { key: "education", label: "Eğitim", icon: "🎓" },
    { key: "gallery", label: "Galeri", icon: "🖼️" },
    { key: "experience", label: "Deneyim", icon: "🏢" },
    { key: "skills", label: "Yetenekler", icon: "⚙️" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ---- ortak stil sınıfları ----
const inputCls =
    "w-full bg-zinc-800/60 border border-white/10 rounded-lg px-4 py-3.5 text-[15px] text-white placeholder-zinc-500 outline-none focus:border-purple-500/70 focus:bg-zinc-800 transition-colors";
const labelCls = "block text-sm font-medium text-zinc-400 mb-2";
const cardCls = "bg-zinc-900/60 border border-white/10 rounded-2xl p-8";
const primaryBtnCls =
    "bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg px-6 py-3 transition-colors disabled:opacity-50";
const secondaryBtnCls =
    "border border-white/15 hover:bg-white/5 text-zinc-300 text-sm font-medium rounded-lg px-6 py-3 transition-colors";
const fieldWrapCls = "space-y-2";

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className={fieldWrapCls}>
            <label className={labelCls}>{label}</label>
            {children}
        </div>
    );
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabKey>("profile");

    const [projects, setProjects] = useState<Project[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [projectUrl, setProjectUrl] = useState("");
    const [profile, setProfile] = useState<Profile | null>(null);
    const [profileSaved, setProfileSaved] = useState(false);
    const [educations, setEducations] = useState<Education[]>([]);
    const [school, setSchool] = useState("");
    const [degree, setDegree] = useState("");
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [eduDescription, setEduDescription] = useState("");
    const [editingEducationId, setEditingEducationId] = useState<string | null>(
        null
    );
    const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [expDescription, setExpDescription] = useState("");
    const [workType, setWorkType] = useState("");
    const [editingExperienceId, setEditingExperienceId] = useState<
        string | null
    >(null);
    const [experiencePhotos, setExperiencePhotos] = useState<ExperiencePhoto[]>(
        []
    );
    const [skills, setSkills] = useState<Skill[]>([]);
    const [skillName, setSkillName] = useState("");
    const [projectImageUrl, setProjectImageUrl] = useState("");
    const [editingProjectId, setEditingProjectId] = useState<string | null>(
        null
    );
    const [techStack, setTechStack] = useState("");
    const [projectGithubUrl, setProjectGithubUrl] = useState("");
    const [projectPhotos, setProjectPhotos] = useState<ProjectPhoto[]>([]);
    const [terminalLog, setTerminalLog] = useState("");
    const [terminalBuildCmd, setTerminalBuildCmd] = useState("");
    const [terminalSecondCmd, setTerminalSecondCmd] = useState("");
    const [terminalSecondLog, setTerminalSecondLog] = useState("");
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) {
                router.push("/admin");
            } else {
                setUser(data.user);
                loadProjects();
                loadEducations();
                loadGallery();
                loadExperiences();
                loadExperiencePhotos();
                loadProfile();
                loadSkills();
                loadProjectPhotos();
            }
            setLoading(false);
        });
    }, [router]);

    async function loadProjects() {
        const { data } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });
        setProjects(data ?? []);
    }

    async function loadEducations() {
        const { data } = await supabase
            .from("education")
            .select("*")
            .order("created_at", { ascending: false });
        setEducations(data ?? []);
    }
    async function loadGallery() {
        const { data } = await supabase
            .from("gallery")
            .select("*")
            .order("created_at", { ascending: false });
        setGallery(data ?? []);
    }

    async function handleAddGalleryPhoto(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const filePath = `gallery-${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file);

        if (uploadError) {
            alert("Yükleme başarısız: " + uploadError.message);
            return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

        await supabase.from("gallery").insert({ image_url: data.publicUrl });
        loadGallery();
    }

    async function handleDeleteGalleryPhoto(id: string) {
        await supabase.from("gallery").delete().eq("id", id);
        loadGallery();
    }

    async function loadProfile() {
        const { data } = await supabase.from("profile").select("*").single();
        setProfile(data);
    }

    async function handleAddProject(e: React.FormEvent) {
        e.preventDefault();

        if (editingProjectId) {
            await supabase
                .from("projects")
                .update({
                    title,
                    description,
                    project_url: projectUrl,
                    image_url: projectImageUrl,
                    tech_stack: techStack,
                    github_url: projectGithubUrl,
                    terminal_log: terminalLog,
                    terminal_build_cmd: terminalBuildCmd,
                    terminal_second_cmd: terminalSecondCmd,
                    terminal_second_log: terminalSecondLog,
                })
                .eq("id", editingProjectId);
            setEditingProjectId(null);
        } else {
            await supabase.from("projects").insert({
                title,
                description,
                project_url: projectUrl,
                image_url: projectImageUrl,
                tech_stack: techStack,
                github_url: projectGithubUrl,
                terminal_log: terminalLog,
                terminal_build_cmd: terminalBuildCmd,
                terminal_second_cmd: terminalSecondCmd,
                terminal_second_log: terminalSecondLog,
            });
        }

        setTitle("");
        setDescription("");
        setProjectUrl("");
        setProjectImageUrl("");
        setTechStack("");
        setProjectGithubUrl("");
        setTerminalLog("");
        setTerminalBuildCmd("");
        setTerminalSecondCmd("");
        setTerminalSecondLog("");
        loadProjects();
    }

    function handleEditProject(project: Project) {
        setEditingProjectId(project.id);
        setTitle(project.title);
        setDescription(project.description ?? "");
        setProjectUrl(project.project_url ?? "");
        setProjectImageUrl(project.image_url ?? "");
        setTechStack(project.tech_stack ?? "");
        setProjectGithubUrl(project.github_url ?? "");
        setTerminalBuildCmd(project.terminal_build_cmd ?? "");
        setTerminalLog(project.terminal_log ?? "");
        setTerminalSecondCmd(project.terminal_second_cmd ?? "");
        setTerminalSecondLog(project.terminal_second_log ?? "");
    }

    function handleCancelEditProject() {
        setEditingProjectId(null);
        setTitle("");
        setDescription("");
        setProjectUrl("");
        setProjectImageUrl("");
        setTechStack("");
        setProjectGithubUrl("");
        setTerminalLog("");
        setTerminalBuildCmd("");
        setTerminalSecondCmd("");
        setTerminalSecondLog("");
    }

    async function handleDelete(id: string) {
        await supabase.from("projects").delete().eq("id", id);
        loadProjects();
    }

    async function handleProjectImageUpload(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0];
        if (!file) return;

        const filePath = `project-${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file);

        if (uploadError) {
            alert("Yükleme başarısız: " + uploadError.message);
            return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        setProjectImageUrl(data.publicUrl);
    }

    async function handleAddEducation(e: React.FormEvent) {
        e.preventDefault();

        if (editingEducationId) {
            await supabase
                .from("education")
                .update({
                    school,
                    degree,
                    start_year: startYear,
                    end_year: endYear,
                    description: eduDescription,
                })
                .eq("id", editingEducationId);
            setEditingEducationId(null);
        } else {
            await supabase.from("education").insert({
                school,
                degree,
                start_year: startYear,
                end_year: endYear,
                description: eduDescription,
            });
        }

        setSchool("");
        setDegree("");
        setStartYear("");
        setEndYear("");
        setEduDescription("");
        loadEducations();
    }

    function handleEditEducation(edu: Education) {
        setEditingEducationId(edu.id);
        setSchool(edu.school);
        setDegree(edu.degree ?? "");
        setStartYear(edu.start_year ?? "");
        setEndYear(edu.end_year ?? "");
        setEduDescription(edu.description ?? "");
    }

    function handleCancelEditEducation() {
        setEditingEducationId(null);
        setSchool("");
        setDegree("");
        setStartYear("");
        setEndYear("");
        setEduDescription("");
    }

    async function loadExperiences() {
        const { data } = await supabase
            .from("experience")
            .select("*")
            .order("created_at", { ascending: false });
        setExperiences(data ?? []);
    }

    async function handleAddExperience(e: React.FormEvent) {
        e.preventDefault();

        if (editingExperienceId) {
            await supabase
                .from("experience")
                .update({
                    company,
                    position,
                    start_date: startDate,
                    end_date: endDate,
                    description: expDescription,
                    work_type: workType,
                })
                .eq("id", editingExperienceId);
            setEditingExperienceId(null);
        } else {
            await supabase.from("experience").insert({
                company,
                position,
                start_date: startDate,
                end_date: endDate,
                description: expDescription,
                work_type: workType,
            });
        }

        setCompany("");
        setPosition("");
        setStartDate("");
        setEndDate("");
        setExpDescription("");
        setWorkType("");
        loadExperiences();
    }

    function handleEditExperience(exp: Experience) {
        setEditingExperienceId(exp.id);
        setCompany(exp.company);
        setPosition(exp.position ?? "");
        setStartDate(exp.start_date ?? "");
        setEndDate(exp.end_date ?? "");
        setExpDescription(exp.description ?? "");
        setWorkType(exp.work_type ?? "");
    }

    function handleCancelEditExperience() {
        setEditingExperienceId(null);
        setCompany("");
        setPosition("");
        setStartDate("");
        setEndDate("");
        setExpDescription("");
        setWorkType("");
    }

    async function handleDeleteExperience(id: string) {
        await supabase.from("experience").delete().eq("id", id);
        loadExperiences();
    }

    async function handleDeleteEducation(id: string) {
        await supabase.from("education").delete().eq("id", id);
        loadEducations();
    }

    async function loadExperiencePhotos() {
        const { data } = await supabase
            .from("experience_photos")
            .select("*")
            .order("created_at", { ascending: true });
        setExperiencePhotos(data ?? []);
    }

    async function loadProjectPhotos() {
        const { data } = await supabase
            .from("project_photos")
            .select("*")
            .order("created_at", { ascending: true });
        setProjectPhotos(data ?? []);
    }

    async function handleUploadProjectPhoto(
        projectId: string,
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0];
        if (!file) return;

        const filePath = `project-photo-${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file);

        if (uploadError) {
            alert("Yükleme başarısız: " + uploadError.message);
            return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

        await supabase
            .from("project_photos")
            .insert({ project_id: projectId, image_url: data.publicUrl });

        loadProjectPhotos();
    }

    async function handleDeleteProjectPhoto(id: string) {
        await supabase.from("project_photos").delete().eq("id", id);
        loadProjectPhotos();
    }

    async function handleUploadExperiencePhoto(
        experienceId: string,
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0];
        if (!file) return;

        const filePath = `exp-photo-${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file);

        if (uploadError) {
            alert("Yükleme başarısız: " + uploadError.message);
            return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

        await supabase
            .from("experience_photos")
            .insert({ experience_id: experienceId, image_url: data.publicUrl });

        loadExperiencePhotos();
    }

    async function loadSkills() {
        const { data } = await supabase
            .from("skills")
            .select("*")
            .order("created_at", { ascending: true });
        setSkills(data ?? []);
    }

    async function handleAddSkill(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !skillName.trim()) {
            alert("Önce yetenek adını yaz, sonra logo dosyasını seç.");
            return;
        }

        const filePath = `skill-${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file);

        if (uploadError) {
            alert("Yükleme başarısız: " + uploadError.message);
            return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

        await supabase
            .from("skills")
            .insert({ name: skillName, logo_url: data.publicUrl });

        setSkillName("");
        loadSkills();
    }

    async function handleDeleteSkill(id: string) {
        await supabase.from("skills").delete().eq("id", id);
        loadSkills();
    }

    async function handleDeleteExperiencePhoto(id: string) {
        await supabase.from("experience_photos").delete().eq("id", id);
        loadExperiencePhotos();
    }

    async function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault();
        if (!profile) return;
        await supabase
            .from("profile")
            .update({
                name: profile.name,
                title: profile.title,
                bio: profile.bio,
                badge_text: profile.badge_text,
                github_url: profile.github_url,
                linkedin_url: profile.linkedin_url,
                email: profile.email,
                avatar_url: profile.avatar_url,
            })
            .eq("id", 1);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2000);
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/admin");
    }

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !profile) return;

        const filePath = `avatar-${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file);

        if (uploadError) {
            alert("Yükleme başarısız: " + uploadError.message);
            return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

        setProfile({ ...profile, avatar_url: data.publicUrl });
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
                Yükleniyor...
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex">
            {/* SIDEBAR */}
            <aside className="w-60 shrink-0 border-r border-white/10 flex flex-col p-4 sticky top-0 h-screen">
                <div className="px-2 mb-6">
                    <h1 className="text-lg font-bold">Admin Panel</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">
                        {user.email}
                    </p>
                </div>

                <nav className="flex-1 space-y-1">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key
                                ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                                : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-4 text-sm text-zinc-500 hover:text-red-400 transition-colors px-3 py-2 text-left"
                >
                    ↪ Çıkış Yap
                </button>
            </aside>

            {/* CONTENT */}
            <main className="flex-1 px-10 py-10 w-full">
                {/* PROFİL */}
                {activeTab === "profile" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Profili Düzenle</h2>
                        {profile && (
                            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
                                <form onSubmit={handleSaveProfile} className={`${cardCls} space-y-6`}>
                                    <div className="flex items-center gap-5 bg-zinc-800/40 border border-white/10 rounded-xl p-5">
                                        {profile.avatar_url ? (
                                            <img
                                                src={profile.avatar_url}
                                                alt="Avatar"
                                                className="w-20 h-20 rounded-full object-cover border border-white/10"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-zinc-800 border border-white/10" />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium mb-1">Profil fotoğrafı</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                                className="text-sm text-zinc-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <Field label="Ad Soyad">
                                            <input
                                                type="text"
                                                value={profile.name ?? ""}
                                                onChange={(e) =>
                                                    setProfile({ ...profile, name: e.target.value })
                                                }
                                                className={inputCls}
                                            />
                                        </Field>
                                        <Field label="Unvan">
                                            <input
                                                type="text"
                                                value={profile.title ?? ""}
                                                onChange={(e) =>
                                                    setProfile({ ...profile, title: e.target.value })
                                                }
                                                className={inputCls}
                                            />
                                        </Field>
                                    </div>
                                    <Field label="Kısa açıklama">
                                        <textarea
                                            value={profile.bio ?? ""}
                                            onChange={(e) =>
                                                setProfile({ ...profile, bio: e.target.value })
                                            }
                                            rows={6}
                                            className={inputCls}
                                        />
                                    </Field>
                                    <Field label="Rozet metni">
                                        <input
                                            type="text"
                                            value={profile.badge_text ?? ""}
                                            onChange={(e) =>
                                                setProfile({ ...profile, badge_text: e.target.value })
                                            }
                                            className={inputCls}
                                        />
                                    </Field>
                                    <div className="grid grid-cols-2 gap-6">
                                        <Field label="GitHub linki">
                                            <input
                                                type="text"
                                                value={profile.github_url ?? ""}
                                                onChange={(e) =>
                                                    setProfile({ ...profile, github_url: e.target.value })
                                                }
                                                className={inputCls}
                                            />
                                        </Field>
                                        <Field label="LinkedIn linki">
                                            <input
                                                type="text"
                                                value={profile.linkedin_url ?? ""}
                                                onChange={(e) =>
                                                    setProfile({ ...profile, linkedin_url: e.target.value })
                                                }
                                                className={inputCls}
                                            />
                                        </Field>
                                    </div>
                                    <Field label="E-posta">
                                        <input
                                            type="email"
                                            value={profile.email ?? ""}
                                            onChange={(e) =>
                                                setProfile({ ...profile, email: e.target.value })
                                            }
                                            className={inputCls}
                                        />
                                    </Field>
                                    <div className="flex items-center gap-3 pt-2">
                                        <button type="submit" className={primaryBtnCls}>
                                            Kaydet
                                        </button>
                                        {profileSaved && (
                                            <span className="text-green-400 text-sm">Kaydedildi ✓</span>
                                        )}
                                    </div>
                                </form>

                                {/* CANLI ÖNİZLEME */}
                                <div className="lg:sticky lg:top-10">
                                    <p className="text-xs uppercase tracking-wide text-zinc-500 font-semibold mb-2">
                                        Canlı Önizleme
                                    </p>
                                    <div className={`${cardCls} text-center`}>
                                        {profile.avatar_url ? (
                                            <img
                                                src={profile.avatar_url}
                                                alt="Avatar"
                                                className="w-24 h-24 rounded-full object-cover border border-purple-500/30 mx-auto"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-zinc-800 mx-auto" />
                                        )}
                                        {profile.badge_text && (
                                            <span className="inline-block mt-4 text-xs px-3 py-1 rounded-full bg-purple-600/15 text-purple-300 border border-purple-500/30">
                                                {profile.badge_text}
                                            </span>
                                        )}
                                        <h3 className="text-lg font-bold mt-3">
                                            {profile.name || "Ad Soyad"}
                                        </h3>
                                        <p className="text-sm text-zinc-400">
                                            {profile.title || "Unvan"}
                                        </p>
                                        {profile.bio && (
                                            <p className="text-xs text-zinc-500 mt-4 leading-relaxed line-clamp-6 text-left">
                                                {profile.bio}
                                            </p>
                                        )}
                                        <div className="flex justify-center gap-3 mt-5 text-xs text-zinc-500">
                                            {profile.github_url && <span>GitHub ↗</span>}
                                            {profile.linkedin_url && <span>LinkedIn ↗</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* PROJELER */}
                {activeTab === "projects" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">
                            {editingProjectId ? "Projeyi Düzenle" : "Yeni Proje Ekle"}
                        </h2>
                        <form onSubmit={handleAddProject} className={`${cardCls} space-y-6`}>
                            <Field label="Proje adı">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={inputCls}
                                    required
                                />
                            </Field>
                            <Field label="Açıklama">
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className={inputCls}
                                />
                            </Field>
                            <div className="grid grid-cols-2 gap-6">
                                <Field label="Proje linki (opsiyonel)">
                                    <input
                                        type="text"
                                        value={projectUrl}
                                        onChange={(e) => setProjectUrl(e.target.value)}
                                        className={inputCls}
                                    />
                                </Field>
                                <Field label="GitHub linki (opsiyonel)">
                                    <input
                                        type="text"
                                        value={projectGithubUrl}
                                        onChange={(e) => setProjectGithubUrl(e.target.value)}
                                        className={inputCls}
                                    />
                                </Field>
                            </div>
                            <Field label="Kullanılan teknolojiler (virgülle ayır)">
                                <input
                                    type="text"
                                    placeholder="React, Flutter, PostgreSQL"
                                    value={techStack}
                                    onChange={(e) => setTechStack(e.target.value)}
                                    className={inputCls}
                                />
                            </Field>

                            <div className="border-t border-white/10 pt-6 space-y-6">
                                <p className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">
                                    Terminal — 1. Blok
                                </p>
                                <Field label="Terminal komutu (boş bırakırsan: npm run build)">
                                    <input
                                        type="text"
                                        value={terminalBuildCmd}
                                        onChange={(e) => setTerminalBuildCmd(e.target.value)}
                                        className={inputCls}
                                    />
                                </Field>
                                <Field label="Terminal içeriği (her satır ayrı komut olur)">
                                    <textarea
                                        placeholder={"Örn:\ncoin ekonomisi dengelendi\nçoklu oyuncu görev sistemi eklendi"}
                                        value={terminalLog}
                                        onChange={(e) => setTerminalLog(e.target.value)}
                                        rows={4}
                                        className={inputCls}
                                    />
                                </Field>
                            </div>

                            <div className="border-t border-white/10 pt-6 space-y-6">
                                <p className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">
                                    Terminal — 2. Blok (opsiyonel)
                                </p>
                                <Field label="2. terminal komutu">
                                    <input
                                        type="text"
                                        placeholder="örn: flutter run"
                                        value={terminalSecondCmd}
                                        onChange={(e) => setTerminalSecondCmd(e.target.value)}
                                        className={inputCls}
                                    />
                                </Field>
                                <Field label="2. terminal içeriği (her satır ayrı satır olur)">
                                    <textarea
                                        value={terminalSecondLog}
                                        onChange={(e) => setTerminalSecondLog(e.target.value)}
                                        rows={4}
                                        className={inputCls}
                                    />
                                </Field>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <Field label="Proje görseli">
                                    <div className="flex items-center gap-4">
                                        {projectImageUrl && (
                                            <img
                                                src={projectImageUrl}
                                                alt="Proje görseli"
                                                className="w-20 h-20 rounded-lg object-cover border border-white/10"
                                            />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProjectImageUpload}
                                            className="text-sm text-zinc-400"
                                        />
                                    </div>
                                </Field>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" className={primaryBtnCls}>
                                    {editingProjectId ? "Güncelle" : "Ekle"}
                                </button>
                                {editingProjectId && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEditProject}
                                        className={secondaryBtnCls}
                                    >
                                        İptal
                                    </button>
                                )}
                            </div>
                        </form>

                        <h2 className="text-xl font-semibold pt-4">Mevcut Projeler</h2>
                        <ul className="space-y-3">
                            {projects.map((project) => (
                                <li key={project.id} className={cardCls}>
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex items-start gap-4">
                                            <div>
                                                <p className="font-semibold text-base">{project.title}</p>
                                                <p className="text-sm text-zinc-400 mt-1 whitespace-pre-line">
                                                    {project.description}
                                                </p>

                                                {project.tech_stack && (
                                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                                        {project.tech_stack
                                                            .split(",")
                                                            .map((t) => t.trim())
                                                            .filter(Boolean)
                                                            .map((t) => (
                                                                <span
                                                                    key={t}
                                                                    className="text-xs px-2 py-1 rounded-full bg-purple-600/15 text-purple-300 border border-purple-500/30"
                                                                >
                                                                    {t}
                                                                </span>
                                                            ))}
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-4 mt-3 text-xs">
                                                    {project.project_url && (
                                                        <a
                                                            href={project.project_url}
                                                            target="_blank"
                                                            className="text-zinc-400 hover:text-purple-300 underline"
                                                        >
                                                            Canlı Link ↗
                                                        </a>
                                                    )}
                                                    {project.github_url && (
                                                        <a
                                                            href={project.github_url}
                                                            target="_blank"
                                                            className="text-zinc-400 hover:text-purple-300 underline"
                                                        >
                                                            GitHub ↗
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 shrink-0">
                                            <button
                                                onClick={() => handleEditProject(project)}
                                                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="text-red-400 hover:text-red-300 text-sm font-medium"
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                                        {(project.terminal_log || project.terminal_second_log) && (
                                            <details className="[&_summary::-webkit-details-marker]:hidden">
                                                <summary className="list-none cursor-pointer flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-purple-300 transition-colors w-fit select-none">
                                                    <svg
                                                        className="w-3 h-3 transition-transform [details[open]_&]:rotate-90"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={2.5}
                                                    >
                                                        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    Terminal içeriği
                                                </summary>
                                                <div className="mt-3 space-y-3 font-mono text-xs text-zinc-400 bg-black/30 border border-white/5 rounded-lg p-4">
                                                    <div>
                                                        <span className="text-emerald-400">$ </span>
                                                        {project.terminal_build_cmd?.trim() || "npm run build"}
                                                        <div className="whitespace-pre-line text-zinc-500 mt-1">
                                                            {project.terminal_log}
                                                        </div>
                                                    </div>
                                                    {project.terminal_second_cmd && (
                                                        <div>
                                                            <span className="text-emerald-400">$ </span>
                                                            {project.terminal_second_cmd}
                                                            <div className="whitespace-pre-line text-zinc-500 mt-1">
                                                                {project.terminal_second_log}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </details>
                                        )}

                                        {project.image_url && (
                                            <div>
                                                <p className="text-xs font-medium text-zinc-500 mb-3">
                                                    Kapak görseli
                                                </p>
                                                <img
                                                    src={project.image_url}
                                                    alt={project.title}
                                                    className="w-16 h-16 rounded-lg object-cover border border-white/10"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-xs font-medium text-zinc-500 mb-3">
                                                Proje fotoğrafları
                                            </p>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {projectPhotos
                                                    .filter((p) => p.project_id === project.id)
                                                    .map((photo) => (
                                                        <div key={photo.id} className="relative group">
                                                            <img
                                                                src={photo.image_url}
                                                                alt="Proje fotoğrafı"
                                                                className="w-16 h-16 object-cover rounded-lg border border-white/10"
                                                            />
                                                            <button
                                                                onClick={() => handleDeleteProjectPhoto(photo.id)}
                                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-400 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}
                                                <label
                                                    htmlFor={`project-photo-${project.id}`}
                                                    className="w-16 h-16 rounded-lg border border-dashed border-white/20 hover:border-purple-500/60 hover:bg-purple-500/5 flex items-center justify-center text-zinc-500 hover:text-purple-300 cursor-pointer text-xl transition-colors"
                                                >
                                                    +
                                                </label>
                                                <input
                                                    id={`project-photo-${project.id}`}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleUploadProjectPhoto(project.id, e)}
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* EĞİTİM */}
                {activeTab === "education" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">
                            {editingEducationId ? "Eğitimi Düzenle" : "Yeni Eğitim Ekle"}
                        </h2>
                        <form onSubmit={handleAddEducation} className={`${cardCls} space-y-6`}>
                            <Field label="Okul / Üniversite adı">
                                <input
                                    type="text"
                                    value={school}
                                    onChange={(e) => setSchool(e.target.value)}
                                    className={inputCls}
                                    required
                                />
                            </Field>
                            <Field label="Bölüm / Derece">
                                <input
                                    type="text"
                                    value={degree}
                                    onChange={(e) => setDegree(e.target.value)}
                                    className={inputCls}
                                />
                            </Field>
                            <div className="grid grid-cols-2 gap-6">
                                <Field label="Başlangıç yılı">
                                    <input
                                        type="text"
                                        value={startYear}
                                        onChange={(e) => setStartYear(e.target.value)}
                                        className={inputCls}
                                    />
                                </Field>
                                <Field label="Bitiş yılı">
                                    <input
                                        type="text"
                                        value={endYear}
                                        onChange={(e) => setEndYear(e.target.value)}
                                        className={inputCls}
                                    />
                                </Field>
                            </div>
                            <Field label="Kısa açıklama (opsiyonel)">
                                <textarea
                                    value={eduDescription}
                                    onChange={(e) => setEduDescription(e.target.value)}
                                    rows={3}
                                    className={inputCls}
                                />
                            </Field>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className={primaryBtnCls}>
                                    {editingEducationId ? "Güncelle" : "Ekle"}
                                </button>
                                {editingEducationId && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEditEducation}
                                        className={secondaryBtnCls}
                                    >
                                        İptal
                                    </button>
                                )}
                            </div>
                        </form>

                        <h2 className="text-xl font-semibold pt-4">Mevcut Eğitimler</h2>
                        <ul className="space-y-3">
                            {educations.map((edu) => (
                                <li key={edu.id} className={cardCls}>
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <p className="font-semibold text-base">{edu.school}</p>
                                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                {edu.degree && (
                                                    <span className="text-xs px-2 py-1 rounded-full bg-purple-600/15 text-purple-300 border border-purple-500/30">
                                                        {edu.degree}
                                                    </span>
                                                )}
                                                {edu.start_year && (
                                                    <span className="text-xs text-zinc-500">
                                                        {edu.start_year} - {edu.end_year || "devam ediyor"}
                                                    </span>
                                                )}
                                            </div>
                                            {edu.description && (
                                                <p className="text-sm text-zinc-400 mt-3 whitespace-pre-line">
                                                    {edu.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-4 shrink-0">
                                            <button
                                                onClick={() => handleEditEducation(edu)}
                                                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEducation(edu.id)}
                                                className="text-red-400 hover:text-red-300 text-sm font-medium"
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* GALERİ */}
                {activeTab === "gallery" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Galeri Fotoğrafları</h2>
                        <div className={cardCls}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAddGalleryPhoto}
                                className="text-sm text-zinc-400"
                            />
                        </div>
                        <ul className="flex flex-wrap gap-4">
                            {gallery.map((photo) => (
                                <li key={photo.id} className="relative">
                                    <img
                                        src={photo.image_url}
                                        alt="Galeri fotoğrafı"
                                        className="w-24 h-24 object-cover rounded-lg border border-white/10"
                                    />
                                    <button
                                        onClick={() => handleDeleteGalleryPhoto(photo.id)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* DENEYİM */}
                {activeTab === "experience" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">
                            {editingExperienceId ? "Deneyimi Düzenle" : "Yeni Deneyim Ekle"}
                        </h2>
                        <form onSubmit={handleAddExperience} className={`${cardCls} space-y-6`}>
                            <Field label="Şirket / Kurum adı">
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className={inputCls}
                                    required
                                />
                            </Field>
                            <Field label="Pozisyon">
                                <input
                                    type="text"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    className={inputCls}
                                />
                            </Field>
                            <Field label="Çalışma türü">
                                <select
                                    value={workType}
                                    onChange={(e) => setWorkType(e.target.value)}
                                    className={inputCls}
                                >
                                    <option value="">Çalışma türü seç</option>
                                    <option value="Ofis">Ofis</option>
                                    <option value="Uzaktan">Uzaktan</option>
                                    <option value="Hibrit">Hibrit</option>
                                </select>
                            </Field>
                            <div className="grid grid-cols-2 gap-6">
                                <Field label="Başlangıç">
                                    <input
                                        type="text"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className={inputCls}
                                    />
                                </Field>
                                <Field label="Bitiş">
                                    <input
                                        type="text"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className={inputCls}
                                    />
                                </Field>
                            </div>
                            <Field label="Kısa açıklama (opsiyonel)">
                                <textarea
                                    value={expDescription}
                                    onChange={(e) => setExpDescription(e.target.value)}
                                    rows={3}
                                    className={inputCls}
                                />
                            </Field>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className={primaryBtnCls}>
                                    {editingExperienceId ? "Güncelle" : "Ekle"}
                                </button>
                                {editingExperienceId && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEditExperience}
                                        className={secondaryBtnCls}
                                    >
                                        İptal
                                    </button>
                                )}
                            </div>
                        </form>

                        <h2 className="text-xl font-semibold pt-4">Mevcut Deneyimler</h2>
                        <ul className="space-y-3">
                            {experiences.map((exp) => (
                                <li key={exp.id} className={cardCls}>
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <p className="font-semibold text-base">{exp.company}</p>
                                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                {exp.position && (
                                                    <span className="text-xs px-2 py-1 rounded-full bg-purple-600/15 text-purple-300 border border-purple-500/30">
                                                        {exp.position}
                                                    </span>
                                                )}
                                                {exp.work_type && (
                                                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                                                        {exp.work_type}
                                                    </span>
                                                )}
                                                {exp.start_date && (
                                                    <span className="text-xs text-zinc-500">
                                                        {exp.start_date} - {exp.end_date || "devam ediyor"}
                                                    </span>
                                                )}
                                            </div>
                                            {exp.description && (
                                                <p className="text-sm text-zinc-400 mt-3 whitespace-pre-line">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-4 shrink-0">
                                            <button
                                                onClick={() => handleEditExperience(exp)}
                                                className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                                            >
                                                Düzenle
                                            </button>
                                            <button
                                                onClick={() => handleDeleteExperience(exp.id)}
                                                className="text-red-400 hover:text-red-300 text-sm font-medium"
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <p className="text-xs font-medium text-zinc-500 mb-3">
                                            Deneyim fotoğrafları
                                        </p>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            {experiencePhotos
                                                .filter((p) => p.experience_id === exp.id)
                                                .map((photo) => (
                                                    <div key={photo.id} className="relative">
                                                        <img
                                                            src={photo.image_url}
                                                            alt="Deneyim fotoğrafı"
                                                            className="w-16 h-16 object-cover rounded-lg border border-white/10"
                                                        />
                                                        <button
                                                            onClick={() => handleDeleteExperiencePhoto(photo.id)}
                                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-400 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            <label
                                                htmlFor={`exp-photo-${exp.id}`}
                                                className="w-16 h-16 rounded-lg border border-dashed border-white/20 hover:border-purple-500/60 hover:bg-purple-500/5 flex items-center justify-center text-zinc-500 hover:text-purple-300 cursor-pointer text-xl transition-colors"
                                            >
                                                +
                                            </label>
                                            <input
                                                id={`exp-photo-${exp.id}`}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleUploadExperiencePhoto(exp.id, e)}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* YETENEKLER */}
                {activeTab === "skills" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Yetenek/Teknoloji Ekle</h2>
                        <div className={`${cardCls} space-y-6`}>
                            <Field label="Teknoloji adı">
                                <input
                                    type="text"
                                    placeholder="örn: React"
                                    value={skillName}
                                    onChange={(e) => setSkillName(e.target.value)}
                                    className={inputCls}
                                />
                            </Field>
                            <Field label="Logo dosyası">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAddSkill}
                                    className="text-sm text-zinc-400"
                                />
                            </Field>
                        </div>
                        <ul className="flex flex-wrap gap-4">
                            {skills.map((skill) => (
                                <li
                                    key={skill.id}
                                    className="relative flex flex-col items-center gap-1"
                                >
                                    {skill.logo_url && (
                                        <img
                                            src={skill.logo_url}
                                            alt={skill.name}
                                            className="w-14 h-14 object-contain rounded-lg bg-white p-2"
                                        />
                                    )}
                                    <span className="text-xs text-zinc-400">{skill.name}</span>
                                    <button
                                        onClick={() => handleDeleteSkill(skill.id)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
}
