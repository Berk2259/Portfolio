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

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
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
        await supabase.from("projects").insert({
            title,
            description,
            project_url: projectUrl,
        });
        setTitle("");
        setDescription("");
        setProjectUrl("");
        loadProjects();
    }

    async function handleDelete(id: string) {
        await supabase.from("projects").delete().eq("id", id);
        loadProjects();
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

    if (loading) {
        return <p className="p-6">Yükleniyor...</p>;
    }

    if (!user) {
        return null;
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

    return (
        <div className="max-w-2xl mx-auto px-6 py-16 space-y-12">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <button onClick={handleLogout} className="text-sm underline">
                    Çıkış Yap
                </button>
            </div>

            {/* PROFİL DÜZENLEME */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Profili Düzenle</h2>
                {profile && (
                    <form onSubmit={handleSaveProfile} className="space-y-3">

                        <div className="flex items-center gap-4">
                            {profile.avatar_url && (
                                <img
                                    src={profile.avatar_url}
                                    alt="Avatar"
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="text-sm"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Ad Soyad"
                            value={profile.name ?? ""}
                            onChange={(e) =>
                                setProfile({ ...profile, name: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2 text-black bg-white"
                        />
                        <input
                            type="text"
                            placeholder="Unvan"
                            value={profile.title ?? ""}
                            onChange={(e) =>
                                setProfile({ ...profile, title: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2 text-black bg-white"
                        />
                        <textarea
                            placeholder="Kısa açıklama"
                            value={profile.bio ?? ""}
                            onChange={(e) =>
                                setProfile({ ...profile, bio: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2 text-black bg-white"
                        />
                        <input
                            type="text"
                            placeholder="Rozet metni"
                            value={profile.badge_text ?? ""}
                            onChange={(e) =>
                                setProfile({ ...profile, badge_text: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2 text-black bg-white"
                        />
                        <input
                            type="text"
                            placeholder="GitHub linki"
                            value={profile.github_url ?? ""}
                            onChange={(e) =>
                                setProfile({ ...profile, github_url: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2 text-black bg-white"
                        />
                        <input
                            type="text"
                            placeholder="LinkedIn linki"
                            value={profile.linkedin_url ?? ""}
                            onChange={(e) =>
                                setProfile({ ...profile, linkedin_url: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2 text-black bg-white"
                        />
                        <input
                            type="email"
                            placeholder="E-posta"
                            value={profile.email ?? ""}
                            onChange={(e) =>
                                setProfile({ ...profile, email: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2 text-black bg-white"
                        />
                        <button
                            type="submit"
                            className="bg-black text-white rounded px-4 py-2"
                        >
                            Kaydet
                        </button>
                        {profileSaved && (
                            <span className="ml-3 text-green-500 text-sm">Kaydedildi ✓</span>
                        )}
                    </form>
                )}
            </section>

            {/* PROJE EKLEME */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Yeni Proje Ekle</h2>
                <form onSubmit={handleAddProject} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Proje adı"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-black bg-white"
                        required
                    />
                    <textarea
                        placeholder="Açıklama"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-black bg-white"
                    />
                    <input
                        type="text"
                        placeholder="Proje linki (opsiyonel)"
                        value={projectUrl}
                        onChange={(e) => setProjectUrl(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-black bg-white"
                    />
                    <button
                        type="submit"
                        className="bg-black text-white rounded px-4 py-2"
                    >
                        Ekle
                    </button>
                </form>
            </section>

            {/* PROJE LİSTESİ */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Mevcut Projeler</h2>
                <ul className="space-y-3">
                    {projects.map((project) => (
                        <li
                            key={project.id}
                            className="flex justify-between items-center border-b pb-2"
                        >
                            <div>
                                <p className="font-medium">{project.title}</p>
                                <p className="text-sm text-gray-500">{project.description}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(project.id)}
                                className="text-red-500 text-sm underline"
                            >
                                Sil
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">
                    {editingEducationId ? "Eğitimi Düzenle" : "Yeni Eğitim Ekle"}
                </h2>
                <form onSubmit={handleAddEducation} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Okul / Üniversite adı"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-black bg-white"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Bölüm / Derece"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-black bg-white"
                    />
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Başlangıç yılı"
                            value={startYear}
                            onChange={(e) => setStartYear(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-black bg-white"
                        />
                        <input
                            type="text"
                            placeholder="Bitiş yılı"
                            value={endYear}
                            onChange={(e) => setEndYear(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-black bg-white"
                        />
                    </div>
                    <textarea
                        placeholder="Kısa açıklama (opsiyonel)"
                        value={eduDescription}
                        onChange={(e) => setEduDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-black bg-white"
                    />
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="bg-black text-white rounded px-4 py-2"
                        >
                            {editingEducationId ? "Güncelle" : "Ekle"}
                        </button>
                        {editingEducationId && (
                            <button
                                type="button"
                                onClick={handleCancelEditEducation}
                                className="border rounded px-4 py-2"
                            >
                                İptal
                            </button>
                        )}
                    </div>
                </form>
            </section>
            <section>
                <h2 className="text-xl font-semibold mb-4">Mevcut Eğitimler</h2>
                <ul className="space-y-3">
                    {educations.map((edu) => (
                        <li
                            key={edu.id}
                            className="flex justify-between items-center border-b pb-2"
                        >
                            <div>
                                <p className="font-medium">{edu.school}</p>
                                <p className="text-sm text-gray-500">
                                    {edu.degree} {edu.start_year && `• ${edu.start_year} - ${edu.end_year}`}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleEditEducation(edu)}
                                    className="text-blue-500 text-sm underline"
                                >
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => handleDeleteEducation(edu.id)}
                                    className="text-red-500 text-sm underline"
                                >
                                    Sil
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2 className="text-xl font-semibold mb-4">Galeri Fotoğrafları</h2>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAddGalleryPhoto}
                    className="text-sm mb-4"
                />
                <ul className="flex flex-wrap gap-4">
                    {gallery.map((photo) => (
                        <li key={photo.id} className="relative">
                            <img
                                src={photo.image_url}
                                alt="Galeri fotoğrafı"
                                className="w-24 h-24 object-cover rounded"
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
            </section>
            <section>
                <h2 className="text-xl font-semibold mb-4">
                    {editingExperienceId ? "Deneyimi Düzenle" : "Yeni Deneyim Ekle"}
                </h2>
                <form onSubmit={handleAddExperience} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Şirket / Kurum adı"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-black bg-white"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Pozisyon"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-black bg-white"
                    />
                    <select
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-black bg-white"
                    >
                        <option value="">Çalışma türü seç</option>
                        <option value="Ofis">Ofis</option>
                        <option value="Uzaktan">Uzaktan</option>
                        <option value="Hibrit">Hibrit</option>
                    </select>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Başlangıç"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-black bg-white"
                        />
                        <input
                            type="text"
                            placeholder="Bitiş"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-black bg-white"
                        />
                    </div>
                    <textarea
                        placeholder="Kısa açıklama (opsiyonel)"
                        value={expDescription}
                        onChange={(e) => setExpDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-black bg-white"
                    />
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="bg-black text-white rounded px-4 py-2"
                        >
                            {editingExperienceId ? "Güncelle" : "Ekle"}
                        </button>
                        {editingExperienceId && (
                            <button
                                type="button"
                                onClick={handleCancelEditExperience}
                                className="border rounded px-4 py-2"
                            >
                                İptal
                            </button>
                        )}
                    </div>
                </form>
            </section>
            <section>
                <h2 className="text-xl font-semibold mb-4">Mevcut Deneyimler</h2>
                <ul className="space-y-3">
                    {experiences.map((exp) => (
                        <li key={exp.id} className="border-b pb-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{exp.company}</p>
                                    <p className="text-sm text-gray-500">
                                        {exp.position} {exp.work_type && `(${exp.work_type})`}{" "}
                                        {exp.start_date &&
                                            `• ${exp.start_date} - ${exp.end_date}`}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleEditExperience(exp)}
                                        className="text-blue-500 text-sm underline"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDeleteExperience(exp.id)}
                                        className="text-red-500 text-sm underline"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>

                            <div className="mt-2 flex items-center gap-3 flex-wrap">
                                {experiencePhotos
                                    .filter((p) => p.experience_id === exp.id)
                                    .map((photo) => (
                                        <div key={photo.id} className="relative">
                                            <img
                                                src={photo.image_url}
                                                alt="Deneyim fotoğrafı"
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <button
                                                onClick={() => handleDeleteExperiencePhoto(photo.id)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleUploadExperiencePhoto(exp.id, e)}
                                    className="text-xs"
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}