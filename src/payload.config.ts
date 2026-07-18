import { fileURLToPath } from "node:url";
import path from "node:path";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";

import "./load-env";
import { env, r2 } from "./env";
import { migrations } from "./migrations";
import { Media } from "./payload/collections/Media";
import { Users } from "./payload/collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

function createR2Storage(storage: NonNullable<typeof r2>) {
  return s3Storage({
    bucket: storage.bucket,
    collections: {
      media: {
        disablePayloadAccessControl: true,
        generateFileURL: ({ filename: storedFilename, prefix }) => {
          const key = prefix ? `${prefix}/${storedFilename}` : storedFilename;
          return `${storage.publicURL.replace(/\/$/, "")}/${key}`;
        },
        prefix: "media",
      },
    },
    config: {
      credentials: {
        accessKeyId: storage.accessKeyId,
        secretAccessKey: storage.secretAccessKey,
      },
      endpoint: storage.endpoint,
      forcePathStyle: true,
      region: "auto",
    },
  });
}

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media],
  cors: [env.SITE_URL],
  csrf: [env.SITE_URL],
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URL,
    },
    prodMigrations: migrations,
    push: false,
  }),
  plugins: r2 ? [createR2Storage(r2)] : [],
  routes: {
    admin: "/studio",
  },
  secret: env.PAYLOAD_SECRET,
  serverURL: env.SITE_URL,
  sharp,
  telemetry: false,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
