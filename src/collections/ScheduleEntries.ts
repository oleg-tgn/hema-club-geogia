import type { CollectionConfig, TextFieldSingleValidation } from "payload";

const validateTitle: TextFieldSingleValidation = (value, { siblingData }) => {
  const data = siblingData as { weapon?: unknown };
  if (!data?.weapon && !value) {
    return "Title is required when no weapon is set.";
  }
  return true;
};

export const ScheduleEntries: CollectionConfig = {
  slug: "schedule-entries",
  labels: {
    singular: "Schedule Entry",
    plural: "Schedule Entries",
  },
  defaultSort: "order",
  admin: {
    useAsTitle: "day",
    defaultColumns: ["day", "weapon", "title", "level", "startTime", "endTime"],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "weapon",
      type: "relationship",
      relationTo: "weapons",
      admin: {
        description:
          "Card this entry belongs to. Leave empty for entries with no weapon (e.g. Sparrings) — set Title below instead.",
      },
    },
    {
      name: "title",
      type: "text",
      localized: true,
      admin: {
        description:
          "Card label used when Weapon is empty (e.g. \"Sparrings\"). Ignored when a weapon is set — the weapon's name is used instead.",
        condition: (data) => !data?.weapon,
      },
      validate: validateTitle,
    },
    {
      name: "level",
      type: "select",
      options: [
        { label: "Beginners", value: "beginners" },
        { label: "Advanced", value: "advanced" },
      ],
      admin: {
        description:
          "Optional sub-group within the card (e.g. Beginners / Advanced for Longsword). Leave empty if the card has no split.",
      },
    },
    {
      name: "day",
      type: "select",
      required: true,
      options: [
        { label: "Monday", value: "monday" },
        { label: "Tuesday", value: "tuesday" },
        { label: "Wednesday", value: "wednesday" },
        { label: "Thursday", value: "thursday" },
        { label: "Friday", value: "friday" },
        { label: "Saturday", value: "saturday" },
        { label: "Sunday", value: "sunday" },
      ],
    },
    {
      name: "startTime",
      type: "text",
      required: true,
      admin: { placeholder: "19:00" },
    },
    {
      name: "endTime",
      type: "text",
      required: true,
      admin: { placeholder: "20:30" },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description:
          "Controls row order within the card, and — via the lowest value in each card's group — the card's position in the schedule grid.",
      },
    },
  ],
};
