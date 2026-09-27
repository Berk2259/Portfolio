export async function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return <>{children}</>;
}

