"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { Authenticated, Unauthenticated } from "convex/react";
import {
  Activity,
  Database,
  GitBranch,
  Globe,
  Lock,
  Palette,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
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
      icon: Activity,
      title: t("features.observability.title"),
      description: t("features.observability.description"),
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
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl space-y-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="space-y-4">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.1, duration: 0.15 }}
          >
            <Badge
              className="border-brutal px-3 py-1 shadow-brutal-sm"
              variant="secondary"
            >
              <Sparkles className="mr-1.5 size-3" />
              {t("subtitle")}
            </Badge>
          </motion.div>

          <h1 className="font-bold font-mono text-5xl tracking-tight sm:text-6xl">
            {t("title")}
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.2, duration: 0.15 }}
        >
          <Button asChild className="border-brutal shadow-brutal" size="lg">
            <Link href="/sign-up">{t("getStarted")}</Link>
          </Button>
          <Button asChild className="border-brutal" size="lg" variant="outline">
            <a
              href="https://github.com/giacomoguidotto/blueprint"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t("learnMore")}
            </a>
          </Button>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <div className="space-y-8">
        <motion.div
          animate={{ opacity: 1 }}
          className="text-center"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.15 }}
        >
          <h2 className="font-mono font-semibold text-3xl tracking-tight">
            {t("features.title")}
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                key={feature.title}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.2 }}
                whileHover={{ x: -2, y: -2 }}
              >
                <Card className="border-brutal shadow-brutal transition-all hover:shadow-brutal-sm">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center bg-primary">
                      <Icon className="size-5 text-primary-foreground" />
                    </div>
                    <CardTitle className="font-mono text-xl">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
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
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
      >
        <h1 className="font-bold font-mono text-4xl tracking-tight">
          {t("welcome", { name })}
        </h1>
        <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          whileHover={{ x: -2, y: -2 }}
        >
          <Card className="border-brutal shadow-brutal transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Database className="size-5" />
                {t("tasks")}
              </CardTitle>
              <CardDescription>{t("tasksDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="border-brutal shadow-brutal-sm">
                <Link href="/tasks">{t("openTasks")}</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.2 }}
          whileHover={{ x: -2, y: -2 }}
        >
          <Card className="border-brutal shadow-brutal transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono">
                <GitBranch className="size-5" />
                {t("github")}
              </CardTitle>
              <CardDescription>
                Explore the GitHub repository for the template and contribute to
                it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="border-brutal" variant="outline">
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
        </motion.div>
      </div>

      {/* User Info */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.3, duration: 0.2 }}
      >
        <Card className="border-brutal shadow-brutal">
          <CardHeader>
            <CardTitle className="font-mono">Your Profile</CardTitle>
            <CardDescription>Authenticated via WorkOS AuthKit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {user?.firstName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Name:</span>
                  <span className="font-medium font-mono text-sm">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              )}
              {user?.email && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Email:</span>
                  <span className="font-medium font-mono text-sm">
                    {user.email}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button
                className="border-brutal"
                onClick={() => signOut()}
                variant="outline"
              >
                {tCommon("signOut")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
