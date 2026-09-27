"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const locales = ["tr", "en"] as const;

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const segments = pathname.split("/");
    const currentLocale = segments[1];

    function hrefFor(locale: string) {
        const rest = segments.slice(2).join("/");
        return `/${locale}${rest ? `/${rest}` : ""}`;
    }

    return (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-1 rounded-full border border-black/10 bg-white/70 dark:border-white/15 dark:bg-black/40 backdrop-blur-sm p-1 shadow-sm">
            {locales.map((locale) => (
                <Link
                    key={locale}
                    href={hrefFor(locale)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase transition-colors ${currentLocale === locale
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-white/60 dark:hover:text-white"
                        }`}
                >
                    {locale}
                </Link>
            ))}
        </div>
    );
}