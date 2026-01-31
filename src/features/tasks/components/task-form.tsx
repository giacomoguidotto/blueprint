"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { Loader2, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TASK_PRIORITIES, type TaskPriority } from "../types";

/**
 * Zod schema for task creation form validation
 */
const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

interface TaskFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Task Creation Form
 *
 * Uses react-hook-form with zod validation for type-safe form handling.
 * Features Neo-Brutalist styling with Motion animations.
 */
export function TaskForm({ onSuccess, onCancel }: TaskFormProps) {
  const t = useTranslations("tasks.form");
  const createTask = useMutation(api.tasks.createTask);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      tags: "",
    },
  });

  const priority = watch("priority");

  const onSubmit = useCallback(
    async (data: CreateTaskFormData) => {
      setIsSubmitting(true);
      try {
        const tags = data.tags
          ? data.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : undefined;

        const dueDate = data.dueDate
          ? new Date(data.dueDate).getTime()
          : undefined;

        await createTask({
          title: data.title,
          description: data.description || undefined,
          priority: data.priority,
          dueDate,
          tags: tags?.length ? tags : undefined,
        });

        reset();
        onSuccess?.();
      } catch (error) {
        // Error will be displayed via Convex error handling
        console.error("Failed to create task:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [createTask, reset, onSuccess]
  );

  return (
    <Card className="border-brutal shadow-brutal">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 font-mono">
              <Plus className="size-5" />
              {t("title")}
            </CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          {onCancel && (
            <Button
              aria-label={t("cancel")}
              onClick={onCancel}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <div className="space-y-2">
            <Label className="font-mono" htmlFor="title">
              {t("titleLabel")}
            </Label>
            <Input
              aria-describedby={errors.title ? "title-error" : undefined}
              aria-invalid={!!errors.title}
              className="border-brutal"
              id="title"
              placeholder={t("titlePlaceholder")}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-destructive text-sm" id="title-error">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="font-mono" htmlFor="description">
              {t("descriptionLabel")}
            </Label>
            <Textarea
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
              aria-invalid={!!errors.description}
              className="min-h-20 resize-none border-brutal"
              id="description"
              placeholder={t("descriptionPlaceholder")}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-destructive text-sm" id="description-error">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Priority & Due Date row */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Priority */}
            <div className="space-y-2">
              <Label className="font-mono" htmlFor="priority">
                {t("priorityLabel")}
              </Label>
              <Select
                onValueChange={(value) =>
                  setValue("priority", value as TaskPriority)
                }
                value={priority}
              >
                <SelectTrigger className="border-brutal" id="priority">
                  <SelectValue placeholder={t("priorityPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {t(`priority.${p}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label className="font-mono" htmlFor="dueDate">
                {t("dueDateLabel")}
              </Label>
              <Input
                className="border-brutal"
                id="dueDate"
                type="date"
                {...register("dueDate")}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="font-mono" htmlFor="tags">
              {t("tagsLabel")}
            </Label>
            <Input
              className="border-brutal"
              id="tags"
              placeholder={t("tagsPlaceholder")}
              {...register("tags")}
            />
            <p className="text-muted-foreground text-xs">{t("tagsHint")}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              className="border-brutal shadow-brutal-sm"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting && <Loader2 className="animate-spin" />}
              {t("submit")}
            </Button>
            {onCancel && (
              <Button
                className="border-brutal"
                onClick={onCancel}
                type="button"
                variant="outline"
              >
                {t("cancel")}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
