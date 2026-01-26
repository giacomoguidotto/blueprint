"use client";

import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { statusFilterAtom } from "../store/atoms";
import { TASK_STATUSES, type TaskStatus } from "../types";

const FILTER_OPTIONS = ["all", ...TASK_STATUSES] as const;

/**
 * Task Filter Tabs
 *
 * Uses jotai for state management to persist filter selection across renders.
 * Syncs with the task list to show only tasks matching the selected status.
 */
export function TaskFilters() {
  const t = useTranslations("tasks");
  const [status, setStatus] = useAtom(statusFilterAtom);

  return (
    <Tabs
      className="w-full"
      onValueChange={(value) => setStatus(value as TaskStatus | "all")}
      value={status}
    >
      <TabsList className="w-full justify-start">
        {FILTER_OPTIONS.map((option) => (
          <TabsTrigger
            className="flex-1 sm:flex-none"
            key={option}
            value={option}
          >
            {t(`filter.${option}`)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
