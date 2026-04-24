"use client";

import { useAtom } from "jotai";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchQueryAtom, statusFilterAtom } from "../store/atoms";
import { TASK_STATUSES, type TaskStatus } from "../types";

const FILTER_OPTIONS = ["all", ...TASK_STATUSES] as const;

/**
 * Task Filter Tabs + Search
 *
 * Uses jotai for state management to persist filter selection across renders.
 * Search query is debounced in the task list before being sent to the server.
 */
export function TaskFilters() {
  const t = useTranslations("tasks");
  const [status, setStatus] = useAtom(statusFilterAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("search.placeholder")}
          type="search"
          value={searchQuery}
        />
      </div>
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
    </div>
  );
}
