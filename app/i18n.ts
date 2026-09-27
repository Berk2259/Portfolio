export type Locale = "tr" | "en";

export const dictionaries = {
    tr: {
        heroViewProjects: "Projelerimi Gör",
        heroContact: "İletişime Geç",
        sectionEducation: "Eğitim",
        sectionExperience: "Deneyim",
        sectionExperienceEyebrow: "Kariyer Yolculuğu",
        sectionProjects: "Projeler",
        sectionContact: "İletişim",
        contactHeading: "İletişim",
        contactEyebrow: "Birlikte Çalışalım",
        defaultContactHeading: "Birlikte bir şeyler inşa edelim",
        defaultContactDescription:
            "Bir staj/iş fırsatı sunmak, projeni birlikte konuşmak ya da sadece merhaba demek istersen, aşağıdaki kanallardan bana ulaşabilirsin. Genelde 24 saat içinde dönüş yaparım.",
        statsProject: "Proje",
        statsExperience: "Deneyim",
        statsTech: "Teknoloji",
        cvDownload: "CV İndir",
        contactRowEmail: "E-posta",
        quizPlaceholder: "Küçük bir soruyla beni tanı — blob'a tıkla 👆",
        quizCorrect: "✓ Doğru bildin!",
        quizWrongPrefix: "✗ Yanlış, doğru cevap: ",
        quizRetry: "Yeni soru için blob'a tekrar tıkla ↻",
    },
    en: {
        heroViewProjects: "View My Projects",
        heroContact: "Get in Touch",
        sectionEducation: "Education",
        sectionExperience: "Experience",
        sectionExperienceEyebrow: "Career Journey",
        sectionProjects: "Projects",
        sectionContact: "Contact",
        contactHeading: "Contact",
        contactEyebrow: "Let's Work Together",
        defaultContactHeading: "Let's build something together",
        defaultContactDescription:
            "If you'd like to offer an internship/job opportunity, discuss a project, or just say hi, you can reach me through the channels below. I usually reply within 24 hours.",
        statsProject: "Projects",
        statsExperience: "Experience",
        statsTech: "Technologies",
        cvDownload: "Download CV",
        contactRowEmail: "Email",
        quizPlaceholder: "Get to know me with a quick quiz — click the blob 👆",
        quizCorrect: "✓ Correct!",
        quizWrongPrefix: "✗ Wrong, the correct answer is: ",
        quizRetry: "Click the blob again for a new question ↻",
    },
} as const;

export function getDictionary(locale: string) {
    return dictionaries[locale as Locale] ?? dictionaries.tr;
}

export function localize<T extends Record<string, unknown>>(
    row: T | null | undefined,
    field: string,
    locale: string
): string | null {
    if (!row) return null;
    if (locale === "en") {
        const enValue = row[`${field}_en`];
        if (typeof enValue === "string" && enValue.trim().length > 0) {
            return enValue;
        }
    }
    const value = row[field];
    return typeof value === "string" ? value : null;
}