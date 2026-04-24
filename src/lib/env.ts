import { z } from "zod";

const serverSchema = z.object({
  AXIOM_API_TOKEN: z.string().default(""),
  AXIOM_DOMAIN: z.string().default(""),
  AXIOM_DATASET: z.string().default("blueprint"),
  AXIOM_METRICS_DATASET: z.string().default("blueprint-metrics"),
  WORKOS_CLIENT_ID: z.string().min(1, "WORKOS_CLIENT_ID is required"),
  WORKOS_API_KEY: z.string().min(1, "WORKOS_API_KEY is required"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_CONVEX_URL: z.url("NEXT_PUBLIC_CONVEX_URL must be a valid URL"),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

function validateEnv() {
  const server = serverSchema.safeParse(process.env);
  const client = clientSchema.safeParse({
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  });

  const errors: string[] = [];

  if (!server.success) {
    for (const issue of server.error.issues) {
      errors.push(`  ${issue.path.join(".")}: ${issue.message}`);
    }
  }
  if (!client.success) {
    for (const issue of client.error.issues) {
      errors.push(`  ${issue.path.join(".")}: ${issue.message}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors.join("\n")}\n\nSee .env.example for required variables.`
    );
  }

  return {
    server: server.data as ServerEnv,
    client: client.data as ClientEnv,
  };
}

export const env = validateEnv();
