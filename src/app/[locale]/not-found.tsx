import { FileQuestion } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <FileQuestion className="mb-6 size-16 text-muted-foreground/50" />
      <h1 className="mb-2 font-bold font-mono text-6xl tracking-tighter">
        404
      </h1>
      <p className="mb-1 font-mono text-xl">{t("title")}</p>
      <p className="mb-8 text-muted-foreground">{t("description")}</p>
      <Button asChild>
        <Link href="/">{t("goHome")}</Link>
      </Button>
    </div>
  );
}
