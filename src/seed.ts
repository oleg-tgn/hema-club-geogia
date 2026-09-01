import type { Payload } from "payload";

const seedAccounts = [
  {
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
  },
  {
    email: process.env.SEED_COACH_EMAIL,
    password: process.env.SEED_COACH_PASSWORD,
  },
];

export async function seedUsers(payload: Payload) {
  for (const { email, password } of seedAccounts) {
    if (!email || !password) continue;

    const existing = await payload.find({
      collection: "users",
      where: { email: { equals: email } },
      limit: 1,
    });

    if (existing.totalDocs > 0) continue;

    await payload.create({
      collection: "users",
      data: { email, password },
    });

    payload.logger.info(`Seeded user: ${email}`);
  }
}
