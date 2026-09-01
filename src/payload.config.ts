import path from "path";
import { fileURLToPath } from "url";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
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
});
