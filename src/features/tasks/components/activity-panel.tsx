"use client";

import { api } from "convex/_generated/api";
import { useMutation, usePaginatedQuery } from "convex/react";
import {
  CheckCircle2,
  Circle,
  Loader2,
  MessageSquare,
  ScrollText,
  Send,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { type FormEvent, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TaskId } from "../types";

interface ActivityPanelProps {
  onToggle: () => void;
  open: boolean;
  taskId: TaskId;
}

const ACTIVITY_ICONS: Record<string, typeof Circle> = {
  status_changed: Circle,
  priority_changed: Circle,
  due_date_changed: Circle,
  collaborator_added: UserPlus,
  collaborator_removed: UserMinus,
  checklist_item_added: Circle,
  checklist_item_completed: CheckCircle2,
  checklist_item_uncompleted: Circle,
  comment: MessageSquare,
};

function formatRelativeTime(timestamp: number) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) {
    return "just now";
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ActivityPanel({ taskId, open, onToggle }: ActivityPanelProps) {
  const t = useTranslations("tasks");
  const [comment, setComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const { results, status, loadMore } = usePaginatedQuery(
    api.tasks.getActivity,
    open ? { taskId } : "skip",
    { initialNumItems: 20 }
  );

  const addComment = useMutation(api.tasks.addComment);

  const handlePost = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!comment.trim()) {
        return;
      }

      setIsPosting(true);
      try {
        await addComment({ taskId, body: comment.trim() });
        setComment("");
      } finally {
        setIsPosting(false);
      }
    },
    [comment, addComment, taskId]
  );

  return (
    <div className="flex flex-col">
      <Button
        className="justify-start gap-2"
        onClick={onToggle}
        size="sm"
        variant="ghost"
      >
        <ScrollText className="size-4" />
        {t("detail.activity")}
      </Button>

      {open && (
        <div className="mt-2 flex flex-col gap-3 border-l pl-4">
          <form className="flex gap-2" onSubmit={handlePost}>
            <Input
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("detail.addComment")}
              value={comment}
            />
            <Button
              disabled={isPosting || !comment.trim()}
              size="icon"
              type="submit"
              variant="ghost"
            >
              {isPosting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </form>

          {results.length === 0 && (
            <p className="text-muted-foreground text-sm">
              {t("detail.noActivity")}
            </p>
          )}

          {results.map((entry) => {
            const Icon = ACTIVITY_ICONS[entry.type] ?? Circle;
            const meta = (entry.metadata ?? {}) as Record<string, string>;
            const userName = entry.user?.email ?? "Unknown";

            return (
              <div className="flex items-start gap-2" key={entry._id}>
                <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  {entry.type === "comment" ? (
                    <>
                      <p className="text-sm">
                        <span className="font-medium">{userName}</span>
                      </p>
                      <p className="text-sm">{entry.body}</p>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {t(`activity.${entry.type}`, {
                        user: userName,
                        ...meta,
                      })}
                    </p>
                  )}
                  <p className="text-muted-foreground text-xs">
                    {formatRelativeTime(entry._creationTime)}
                  </p>
                </div>
              </div>
            );
          })}

          {status === "CanLoadMore" && (
            <Button onClick={() => loadMore(20)} size="sm" variant="ghost">
              {t("loadMore")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
