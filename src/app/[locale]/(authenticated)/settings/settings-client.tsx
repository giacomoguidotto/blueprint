"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Bell, BellOff, Settings, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeUp, spring, staggerContainer, staggerItem } from "@/lib/motion";

export function SettingsClient() {
  const t = useTranslations("settings");
  const { user: authUser } = useAuth({ ensureSignedIn: true });
  const user = useQuery(api.users.getUser);
  const avatarUrl = useQuery(
    api.tasks.getStorageUrl,
    user?.avatarId ? { storageId: user.avatarId } : "skip"
  );

  const updateAvatar = useMutation(api.users.updateAvatar);
  const removeAvatar = useMutation(api.users.removeAvatar);
  const updateNotifications = useMutation(
    api.users.updateNotificationPreferences
  );

  const prefs = user?.preferences ?? {
    notifyOnShare: true,
    notifyOnComment: true,
    notifyOnDueDate: true,
  };

  const handleAvatarUpload = useCallback(
    async (storageId: Id<"_storage">) => {
      await updateAvatar({ avatarId: storageId });
    },
    [updateAvatar]
  );

  const handleAvatarRemove = useCallback(async () => {
    await removeAvatar();
  }, [removeAvatar]);

  const handleTogglePreference = useCallback(
    async (key: "notifyOnShare" | "notifyOnComment" | "notifyOnDueDate") => {
      await updateNotifications({
        ...prefs,
        [key]: !prefs[key],
      });
    },
    [updateNotifications, prefs]
  );

  if (!user) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        animate="show"
        className="mx-auto max-w-2xl space-y-6"
        initial="hidden"
        variants={staggerContainer}
      >
        {/* Page Header */}
        <motion.div variants={fadeUp}>
          <h1 className="flex items-center gap-2 font-bold font-mono text-3xl tracking-tight">
            <Settings className="size-8" />
            {t("heading")}
          </h1>
          <p className="mt-1 text-muted-foreground">{t("subheading")}</p>
        </motion.div>

        {/* Avatar Section */}
        <motion.div variants={staggerItem}>
          <Card className="shadow-brutal">
            <CardHeader>
              <CardTitle className="font-mono">{t("avatar.title")}</CardTitle>
              <CardDescription>{t("avatar.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <Avatar className="size-20">
                  <AvatarImage alt="Avatar" src={avatarUrl ?? undefined} />
                  <AvatarFallback className="text-xl">
                    {authUser?.firstName && authUser?.lastName
                      ? `${authUser.firstName[0]}${authUser.lastName[0]}`.toUpperCase()
                      : (authUser?.email?.slice(0, 2).toUpperCase() ?? "?")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <ImageUpload
                    aspectRatio="square"
                    onRemove={user.avatarId ? handleAvatarRemove : undefined}
                    onUpload={handleAvatarUpload}
                    value={avatarUrl}
                  />
                </div>
              </div>
              {user.avatarId && (
                <Button
                  className="w-full"
                  onClick={handleAvatarRemove}
                  size="sm"
                  variant="outline"
                >
                  <Trash2 className="size-4" />
                  {t("avatar.remove")}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications Section */}
        <motion.div variants={staggerItem}>
          <Card className="shadow-brutal">
            <CardHeader>
              <CardTitle className="font-mono">
                {t("notifications.title")}
              </CardTitle>
              <CardDescription>
                {t("notifications.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {(
                [
                  { key: "notifyOnShare", label: "onShare" },
                  { key: "notifyOnComment", label: "onComment" },
                  { key: "notifyOnDueDate", label: "onDueDate" },
                ] as const
              ).map(({ key, label }) => (
                <motion.button
                  className="flex w-full items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  key={key}
                  onClick={() => handleTogglePreference(key)}
                  transition={spring.snappy}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    {prefs[key] ? (
                      <Bell className="size-5 text-primary" />
                    ) : (
                      <BellOff className="size-5 text-muted-foreground" />
                    )}
                    <div className="text-left">
                      <p className="font-medium text-sm">
                        {t(`notifications.${label}`)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {t(`notifications.${label}Description`)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-6 w-11 rounded-full p-0.5 transition-colors ${
                      prefs[key] ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <motion.div
                      animate={{ x: prefs[key] ? 20 : 0 }}
                      className="size-5 rounded-full bg-white shadow-sm"
                      transition={spring.snappy}
                    />
                  </div>
                </motion.button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-2 h-5 w-72" />
        </div>
        <div className="space-y-4 rounded-lg border p-6">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-6">
            <Skeleton className="size-20 rounded-full" />
            <Skeleton className="h-32 flex-1 rounded-lg" />
          </div>
        </div>
        <div className="space-y-4 rounded-lg border p-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
