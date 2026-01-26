"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { Authenticated, Unauthenticated } from "convex/react";
import {
  Database,
  Github,
  Globe,
  Lock,
  Palette,
  Sparkles,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/routing";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Authenticated>
        <AuthenticatedView />
      </Authenticated>
      <Unauthenticated>
        <UnauthenticatedView />
      </Unauthenticated>
    </div>
  );
}

function UnauthenticatedView() {
  const t = useTranslations("home");

  const features = [
    {
      icon: Lock,
      title: t("features.auth.title"),
      description: t("features.auth.description"),
    },
    {
      icon: Database,
      title: t("features.database.title"),
      description: t("features.database.description"),
    },
    {
      icon: Globe,
      title: t("features.i18n.title"),
      description: t("features.i18n.description"),
    },
    {
      icon: Palette,
      title: t("features.ui.title"),
      description: t("features.ui.description"),
    },
    {
      icon: Lock,
      title: t("features.security.title"),
      description: t("features.security.description"),
    },
    {
      icon: Zap,
      title: t("features.dx.title"),
      description: t("features.dx.description"),
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="mx-auto max-w-3xl space-y-8 text-center">
        <div className="space-y-4">
          <Badge className="px-3 py-1" variant="secondary">
            <Sparkles className="mr-1.5 size-3" />
            {t("subtitle")}
          </Badge>

          <h1 className="font-bold text-5xl tracking-tight sm:text-6xl">
            {t("title")}
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/sign-up">{t("getStarted")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a
              href="https://github.com/yourusername/blueprint"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t("learnMore")}
            </a>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="font-semibold text-3xl tracking-tight">
            {t("features.title")}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                className="transition-colors hover:border-primary/50"
                key={feature.title}
              >
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-2xl rounded-lg border bg-muted/50 p-8 text-center">
        <div className="space-y-4">
          <h3 className="font-semibold text-2xl">{t("getStarted")}</h3>
          <p className="text-muted-foreground">
            Sign up to explore the full capabilities of this template.
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link href="/sign-up">{t("getStarted")}</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthenticatedView() {
  const t = useTranslations("home.authenticated");
  const tCommon = useTranslations("common");
  const { user, signOut } = useAuth({ ensureSignedIn: true });

  const name = user?.firstName || user?.email?.split("@")[0] || "there";

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Welcome Header */}
      <div className="space-y-4 text-center">
        <h1 className="font-bold text-4xl tracking-tight">
          {t("welcome", { name })}
        </h1>
        <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="size-5" />
              {t("tasks")}
            </CardTitle>
            <CardDescription>{t("tasksDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/tasks">{t("openTasks")}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="size-5" />
              {t("github")}
            </CardTitle>
            <CardDescription>
              Explore the GitHub repository for the template and contribute to
              it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <a
                href="https://github.com/giacomoguidotto/blueprint"
                rel="noopener noreferrer"
                target="_blank"
              >
                View Repo
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Authenticated via WorkOS AuthKit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {user?.firstName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Name:</span>
                <span className="font-medium text-sm">
                  {user.firstName} {user.lastName}
                </span>
              </div>
            )}
            {user?.email && (
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Email:</span>
                <span className="font-medium text-sm">{user.email}</span>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button onClick={() => signOut()} variant="outline">
              {tCommon("signOut")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
