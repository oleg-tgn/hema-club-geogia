import type { CollectionConfig } from "payload";

export const ScheduleEntries: CollectionConfig = {
  slug: "schedule-entries",
  labels: {
    singular: "Schedule Entry",
    plural: "Schedule Entries",
  },
  defaultSort: "order",
  admin: {
    useAsTitle: "day",
    defaultColumns: ["day", "weapon", "startTime", "endTime"],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
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
      name: "weapon",
      type: "relationship",
      relationTo: "weapons",
      required: true,
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
        description: "Controls display order within a day.",
      },
    },
  ],
};
