"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "convex/_generated/api";
import { Loader2, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
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
import { useTracedMutation } from "@/hooks/use-traced-mutation";
import { spring, staggerContainer, staggerItem } from "@/lib/motion";
import { type CreateTaskFormData, createTaskSchema } from "../schemas";
import { TASK_PRIORITIES, type TaskPriority } from "../types";

interface TaskFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Task Creation Form
 *
 * Uses react-hook-form with zod validation for type-safe form handling.
 * Features glassmorphism styling with spring-based Motion animations.
 */
export function TaskForm({ onSuccess, onCancel }: TaskFormProps) {
  const t = useTranslations("tasks.form");
  const createTask = useTracedMutation(
    api.tasks.createTask,
    "user.action.createTask"
  );
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
      } catch {
        // Error is reported via useTracedMutation telemetry
      } finally {
        setIsSubmitting(false);
      }
    },
    [createTask, reset, onSuccess]
  );

  return (
    <Card className="shadow-brutal">
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
        <motion.form
          animate="show"
          className="space-y-4"
          initial="hidden"
          onSubmit={handleSubmit(onSubmit)}
          variants={staggerContainer}
        >
          {/* Title */}
          <motion.div className="space-y-2" variants={staggerItem}>
            <Label className="font-mono" htmlFor="title">
              {t("titleLabel")}
            </Label>
            <Input
              aria-describedby={errors.title ? "title-error" : undefined}
              aria-invalid={!!errors.title}
              id="title"
              placeholder={t("titlePlaceholder")}
              {...register("title")}
            />
            <AnimatePresence>
              {errors.title && (
                <motion.p
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-destructive text-sm"
                  exit={{ opacity: 0, scale: 0.95 }}
                  id="title-error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  key="title-error"
                  transition={spring.snappy}
                >
                  {errors.title.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Description */}
          <motion.div className="space-y-2" variants={staggerItem}>
            <Label className="font-mono" htmlFor="description">
              {t("descriptionLabel")}
            </Label>
            <Textarea
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
              aria-invalid={!!errors.description}
              className="min-h-20 resize-none"
              id="description"
              placeholder={t("descriptionPlaceholder")}
              {...register("description")}
            />
            <AnimatePresence>
              {errors.description && (
                <motion.p
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-destructive text-sm"
                  exit={{ opacity: 0, scale: 0.95 }}
                  id="description-error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  key="description-error"
                  transition={spring.snappy}
                >
                  {errors.description.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Priority & Due Date row */}
          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            variants={staggerItem}
          >
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
                <SelectTrigger id="priority">
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
              <Input id="dueDate" type="date" {...register("dueDate")} />
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div className="space-y-2" variants={staggerItem}>
            <Label className="font-mono" htmlFor="tags">
              {t("tagsLabel")}
            </Label>
            <Input
              id="tags"
              placeholder={t("tagsPlaceholder")}
              {...register("tags")}
            />
            <p className="text-muted-foreground text-xs">{t("tagsHint")}</p>
          </motion.div>

          {/* Actions */}
          <motion.div className="flex gap-2 pt-2" variants={staggerItem}>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                className="shadow-brutal-sm"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting && <Loader2 className="animate-spin" />}
                {t("submit")}
              </Button>
            </motion.div>
            {onCancel && (
              <Button onClick={onCancel} type="button" variant="outline">
                {t("cancel")}
              </Button>
            )}
          </motion.div>
        </motion.form>
      </CardContent>
    </Card>
  );
}
