import path from "path";
import { fileURLToPath } from "url";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Weapons } from "./collections/Weapons";
import { ScheduleEntries } from "./collections/ScheduleEntries";
import { Instructors } from "./collections/Instructors";
import { seedUsers } from "./seed";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Weapons, ScheduleEntries, Instructors],
  editor: lexicalEditor(),
  onInit: seedUsers,
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  localization: {
    locales: ["ru", "ka", "en"],
    defaultLocale: "ru",
  },
  plugins: [
    s3Storage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename }) =>
            `${process.env.R2_PUBLIC_URL}/${filename}`,
        },
      },
      bucket: process.env.R2_BUCKET || "",
      config: {
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        forcePathStyle: true,
      },
    }),
  ],
});
