import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().min(1).optional(),
);

const optionalBoolean = z
  .preprocess((value) => (value === "" ? undefined : value), z.enum(["true", "false"]).optional())
  .transform((value) => value === "true");

function createR2Prefix({
  configuredPrefix,
  deploymentURL,
  gitBranch,
  isPreview,
}: {
  configuredPrefix?: string;
  deploymentURL?: string;
  gitBranch?: string;
  isPreview: boolean;
}) {
  if (configuredPrefix) {
    return configuredPrefix;
  }

  if (!isPreview) {
    return "media";
  }

  const previewName = gitBranch ?? deploymentURL ?? "unknown";
  return `media/previews/${previewName.replace(/[^a-zA-Z0-9/_-]/g, "-")}`;
}

const environmentSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    SITE_URL: z.url(),
    DATABASE_URL: z
      .string()
      .regex(/^postgres(?:ql)?:\/\//, "DATABASE_URL must be a PostgreSQL connection URL"),
    DATABASE_URL_UNPOOLED: z
      .string()
      .regex(/^postgres(?:ql)?:\/\//, "DATABASE_URL_UNPOOLED must be a PostgreSQL connection URL")
      .optional(),
    PAYLOAD_SECRET: z.string().min(32, "PAYLOAD_SECRET must contain at least 32 characters"),
    PAYLOAD_MIGRATE_ON_START: optionalBoolean,
    R2_BUCKET_NAME: optionalString,
    R2_ACCESS_KEY_ID: optionalString,
    R2_SECRET_ACCESS_KEY: optionalString,
    R2_ENDPOINT: z.preprocess((value) => (value === "" ? undefined : value), z.url().optional()),
    R2_PREFIX: optionalString,
    R2_PUBLIC_URL: z.preprocess((value) => (value === "" ? undefined : value), z.url().optional()),
    VERCEL: optionalString,
    VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
    VERCEL_GIT_COMMIT_REF: optionalString,
    VERCEL_URL: optionalString,
  })
  .superRefine((environment, context) => {
    const r2Values = [
      environment.R2_BUCKET_NAME,
      environment.R2_ACCESS_KEY_ID,
      environment.R2_SECRET_ACCESS_KEY,
      environment.R2_ENDPOINT,
      environment.R2_PUBLIC_URL,
    ];
    const configuredValues = r2Values.filter(Boolean).length;

    if (environment.VERCEL && configuredValues !== r2Values.length) {
      context.addIssue({
        code: "custom",
        message: "Configure every R2 variable when deploying to Vercel",
        path: ["R2_BUCKET_NAME"],
      });
    }

    if (!environment.VERCEL && configuredValues !== 0 && configuredValues !== r2Values.length) {
      context.addIssue({
        code: "custom",
        message: "Configure every R2 variable or leave every R2 variable empty",
        path: ["R2_BUCKET_NAME"],
      });
    }

    if (environment.VERCEL && !environment.DATABASE_URL_UNPOOLED) {
      context.addIssue({
        code: "custom",
        message: "DATABASE_URL_UNPOOLED is required when deploying to Vercel",
        path: ["DATABASE_URL_UNPOOLED"],
      });
    }

    if (environment.VERCEL && environment.PAYLOAD_MIGRATE_ON_START) {
      context.addIssue({
        code: "custom",
        message: "Run migrations during the Vercel build instead of function startup",
        path: ["PAYLOAD_MIGRATE_ON_START"],
      });
    }
  });

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  throw new Error(`Invalid environment configuration: ${z.prettifyError(parsedEnvironment.error)}`);
}

export const env = parsedEnvironment.data;

export const isVercelPreview = env.VERCEL_ENV === "preview";

export const serverURL =
  isVercelPreview && env.VERCEL_URL ? `https://${env.VERCEL_URL}` : env.SITE_URL;

export const browserOrigins = [...new Set([env.SITE_URL, serverURL])];

export const databaseURL =
  process.env.PAYLOAD_MIGRATING === "true"
    ? (env.DATABASE_URL_UNPOOLED ?? env.DATABASE_URL)
    : env.DATABASE_URL;

export const shouldRunStartupMigrations = env.PAYLOAD_MIGRATE_ON_START;

export const r2 = env.R2_BUCKET_NAME
  ? {
      accessKeyId: env.R2_ACCESS_KEY_ID as string,
      bucket: env.R2_BUCKET_NAME,
      endpoint: env.R2_ENDPOINT as string,
      prefix: createR2Prefix({
        configuredPrefix: env.R2_PREFIX,
        deploymentURL: env.VERCEL_URL,
        gitBranch: env.VERCEL_GIT_COMMIT_REF,
        isPreview: isVercelPreview,
      }),
      publicURL: env.R2_PUBLIC_URL as string,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY as string,
    }
  : null;
