"use client";

import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Share2, UserMinus, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FormEvent, useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { TaskId } from "../types";

interface ShareDialogProps {
  taskId: TaskId;
  trigger?: React.ReactNode;
}

export function ShareDialog({ taskId, trigger }: ShareDialogProps) {
  const t = useTranslations("tasks.share");
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const collaborators = useQuery(
    api.tasks.getCollaborators,
    open ? { taskId } : "skip"
  );
  const shareTask = useMutation(api.tasks.shareTask);
  const unshareTask = useMutation(api.tasks.unshareTask);

  const handleShare = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!email.trim()) {
        return;
      }

      setIsSharing(true);
      setError(null);

      try {
        await shareTask({ taskId, email: email.trim() });
        setEmail("");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to share";
        setError(message);
      } finally {
        setIsSharing(false);
      }
    },
    [email, shareTask, taskId]
  );

  const handleUnshare = useCallback(
    async (userId: Id<"users">) => {
      try {
        await unshareTask({ taskId, userId });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to remove";
        setError(message);
      }
    },
    [unshareTask, taskId]
  );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="outline">
            <Share2 className="size-4" />
            {t("title")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form className="flex gap-2" onSubmit={handleShare}>
          <Input
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder={t("emailPlaceholder")}
            type="email"
            value={email}
          />
          <Button disabled={isSharing || !email.trim()} type="submit">
            {isSharing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              t("submit")
            )}
          </Button>
        </form>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Users className="size-4" />
            {t("collaborators")}
          </div>

          {collaborators?.length === 0 && (
            <p className="text-muted-foreground text-sm">
              {t("noCollaborators")}
            </p>
          )}

          {collaborators?.map((c) => (
            <div
              className="flex items-center justify-between rounded-md border p-2"
              key={c._id}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{c.user?.email ?? "Unknown"}</span>
                <Badge variant="secondary">{t("collaborator")}</Badge>
              </div>
              <Button
                onClick={() => handleUnshare(c.userId)}
                size="icon-xs"
                variant="ghost"
              >
                <UserMinus className="size-4" />
                <span className="sr-only">{t("remove")}</span>
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
