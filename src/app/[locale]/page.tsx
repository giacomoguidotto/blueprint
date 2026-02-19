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
import {
  fadeUp,
  scaleIn,
  spring,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";

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
        className="mx-auto max-w-3xl space-y-8 text-center"
        initial="hidden"
        variants={fadeUp}
        viewport={{ once: true }}
        whileInView="show"
      >
        <div className="space-y-4">
          <motion.div animate="show" initial="hidden" variants={scaleIn}>
            <Badge className="px-3 py-1 shadow-soft" variant="secondary">
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
          animate="show"
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
          initial="hidden"
          variants={staggerContainer}
        >
          <motion.div
            variants={staggerItem}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button asChild className="glow-primary shadow-brutal" size="lg">
              <Link href="/sign-up">{t("getStarted")}</Link>
            </Button>
          </motion.div>
          <motion.div
            variants={staggerItem}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button asChild size="lg" variant="outline">
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
      </motion.div>

      {/* Features Grid */}
      <div className="space-y-8">
        <motion.div
          className="text-center"
          initial="hidden"
          variants={fadeUp}
          viewport={{ once: true }}
          whileInView="show"
        >
          <h2 className="font-mono font-semibold text-3xl tracking-tight">
            {t("features.title")}
          </h2>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          variants={staggerContainer}
          viewport={{ once: true, margin: "-50px" }}
          whileInView="show"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                whileHover={{ scale: 1.02, y: -6, transition: spring.snappy }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="shadow-brutal transition-all hover:shadow-elevated">
                  <CardHeader>
                    <motion.div
                      className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary"
                      whileHover={{ rotate: 6 }}
                    >
                      <Icon className="size-5 text-primary-foreground" />
                    </motion.div>
                    <CardTitle className="font-mono text-xl">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
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
        animate="show"
        className="space-y-4 text-center"
        initial="hidden"
        variants={fadeUp}
      >
        <h1 className="font-bold font-mono text-4xl tracking-tight">
          {t("welcome", { name })}
        </h1>
        <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        animate="show"
        className="grid gap-6 md:grid-cols-2"
        initial="hidden"
        variants={staggerContainer}
      >
        <motion.div
          variants={staggerItem}
          whileHover={{ scale: 1.02, y: -6, transition: spring.snappy }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="shadow-brutal transition-all hover:shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Database className="size-5" />
                {t("tasks")}
              </CardTitle>
              <CardDescription>{t("tasksDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="shadow-soft">
                <Link href="/tasks">{t("openTasks")}</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={staggerItem}
          whileHover={{ scale: 1.02, y: -6, transition: spring.snappy }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="shadow-brutal transition-all hover:shadow-elevated">
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
        </motion.div>
      </motion.div>

      {/* User Info */}
      <motion.div
        animate="show"
        initial="hidden"
        transition={{ delay: 0.2 }}
        variants={fadeUp}
      >
        <Card className="shadow-brutal">
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
              <Button onClick={() => signOut()} variant="outline">
                {tCommon("signOut")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
