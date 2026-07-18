import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().min(1).optional(),
);

const environmentSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    SITE_URL: z.url(),
    DATABASE_URL: z
      .string()
      .regex(/^postgres(?:ql)?:\/\//, "DATABASE_URL must be a PostgreSQL connection URL"),
    PAYLOAD_SECRET: z.string().min(32, "PAYLOAD_SECRET must contain at least 32 characters"),
    R2_BUCKET_NAME: optionalString,
    R2_ACCESS_KEY_ID: optionalString,
    R2_SECRET_ACCESS_KEY: optionalString,
    R2_ENDPOINT: z.preprocess((value) => (value === "" ? undefined : value), z.url().optional()),
    R2_PUBLIC_URL: z.preprocess((value) => (value === "" ? undefined : value), z.url().optional()),
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

    if (configuredValues !== 0 && configuredValues !== r2Values.length) {
      context.addIssue({
        code: "custom",
        message: "Configure every R2 variable or leave every R2 variable empty",
        path: ["R2_BUCKET_NAME"],
      });
    }
  });

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  throw new Error(`Invalid environment configuration: ${z.prettifyError(parsedEnvironment.error)}`);
}

export const env = parsedEnvironment.data;

export const r2 = env.R2_BUCKET_NAME
  ? {
      accessKeyId: env.R2_ACCESS_KEY_ID as string,
      bucket: env.R2_BUCKET_NAME,
      endpoint: env.R2_ENDPOINT as string,
      publicURL: env.R2_PUBLIC_URL as string,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY as string,
    }
  : null;
