import type { CollectionConfig, TextFieldSingleValidation } from "payload";

const validateTitle: TextFieldSingleValidation = (value, { siblingData }) => {
  const data = siblingData as { weapon?: unknown };
  if (!data?.weapon && !value) {
    return "Title is required when no weapon is set.";
  }
  return true;
};

export const ScheduleGroups: CollectionConfig = {
  slug: "schedule-groups",
  labels: {
    singular: "Schedule Card",
    plural: "Schedule Cards",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["weapon", "title"],
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
          "Leave empty for a card with no weapon (e.g. Sparrings) — set Title below instead.",
      },
    },
    {
      name: "title",
      type: "text",
      localized: true,
      admin: {
        description:
          'Card label used when Weapon is empty (e.g. "Sparrings"). Ignored when a weapon is set — the weapon\'s name is used instead.',
        condition: (data) => !data?.weapon,
      },
      validate: validateTitle,
    },
    {
      name: "rows",
      type: "array",
      minRows: 1,
      labels: {
        singular: "Time slot",
        plural: "Time slots",
      },
      admin: {
        description:
          "One row per day/time, in display order. Rows sharing the same Level are grouped under one heading — keep same-level rows next to each other.",
      },
      fields: [
        {
          name: "level",
          type: "select",
          options: [
            { label: "Beginners", value: "beginners" },
            { label: "Advanced", value: "advanced" },
          ],
          admin: {
            description:
              "Optional sub-heading within the card (e.g. Beginners / Advanced). Leave empty if the card has no split.",
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
          type: "date",
          required: true,
          admin: {
            date: {
              pickerAppearance: "timeOnly",
              timeFormat: "HH:mm",
              timeIntervals: 15,
            },
          },
        },
        {
          name: "endTime",
          type: "date",
          required: true,
          admin: {
            date: {
              pickerAppearance: "timeOnly",
              timeFormat: "HH:mm",
              timeIntervals: 15,
            },
          },
        },
      ],
    },
  ],
};
