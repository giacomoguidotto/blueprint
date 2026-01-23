"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { Authenticated, Unauthenticated } from "convex/react";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "@/components/language-selector";
import { Link } from "@/i18n/routing";

export default function Home() {
  const { user, signOut } = useAuth();
  const t = useTranslations("home");

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1>{t("title")}</h1>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          {user ? (
            <button onClick={() => signOut()} type="button">
              Sign out
            </button>
          ) : (
            <>
              <Link href="/sign-in">
                <button type="button">Sign in</button>
              </Link>
              <Link href="/sign-up">
                <button type="button">Sign up</button>
              </Link>
            </>
          )}
        </div>
      </div>
      <Authenticated>
        <Content />
      </Authenticated>
      <Unauthenticated>
        <p>Please sign in to view data</p>
      </Unauthenticated>
    </div>
  );
}

function Content() {
  const { user } = useAuth({ ensureSignedIn: true });
  return (
    <div>
      Hi {user?.firstName} {user?.lastName}
    </div>
  );
}
