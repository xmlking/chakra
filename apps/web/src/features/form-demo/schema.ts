import { dateRangeSchema } from "@workspace/db/schema/zod";
import { z } from "zod";
export const PROJECT_STATUSES = ["draft", "active", "finished"] as const;

export const addons = [
  {
    label: "Analytics",
    value: "analytics",
    description: "Advanced analytics and reporting",
  },
  {
    label: "Backup",
    value: "backup",
    description: "Automated daily backups",
  },
  {
    label: "Priority Support",
    value: "support",
    description: "24/7 premium customer support",
  },
] as const;

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: T;
}

export const projectSchema = z.object({
  firstName: z.string({ error: "This field is required" }),
  lastName: z.string({ error: "This field is required" }),
  email: z.email({ error: "Please enter a valid email" }),
  password: z.string({ error: "This field is required" }),
  phone: z
    .string()
    .regex(/^\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/, "Please enter a valid phone number")
    .optional(),
  rating: z.coerce
    .number<number | undefined>({ error: "This field is required" })
    .min(0)
    .max(5)
    .optional(),
  citizen: z.boolean().default(false).optional(),
  plan: z
    .string({ error: "Please select a subscription plan" })
    .min(1, "Please select a subscription plan")
    .refine((plan) => ["starter", "pro", "enterprise"].includes(plan), {
      message: "Invalid plan selection. Please choose Starter, pro or Enterprise",
    }),
  termsAccepted: z.boolean().refine((val) => val, {
    message: "You must accept Terms and Conditions.",
  }),
  age: z.coerce
    .number<number | undefined>({ error: "This field is required" })
    .min(0)
    .max(150)
    .optional(),
  dob: z.date({ error: "This field is required" }).optional(),
  appointment: z.date({ error: "This field is required" }).optional(),
  period: dateRangeSchema.optional(),
  schedule: z.array(z.date({ error: "This field is required" })).optional(),
  otp: z.string().length(6, "Please enter a valid OTP"),
  tags: z
    .string()
    .trim()
    .min(3, { message: "Each tag must be at least 3 characters long" })
    .array()
    .max(5, { message: "The array must contain at most 5 tags" }),
  metadata: z.record(z.string(), z.unknown()).optional(),
  frameworks: z
    .array(z.string(), { error: "Please select at least one item" })
    .min(1, "Please select at least one item")
    .optional(),
  techStack: z
    .array(
      z.object({
        label: z.string(),
        value: z.string().min(1).max(36),
        disable: z.boolean().optional(),
      }),
    )
    .min(1, { error: "At lease once item required" })
    .optional(),
  position: z
    .array(z.string(), { error: "Please select at least one item" })
    .min(1, "Please select at least one item"),
  status: z.enum(PROJECT_STATUSES),
  description: z.string().optional(),
  files: z
    .union([
      z
        .file()
        .mime(["application/pdf", "application/doc", "application/docx"])
        .max(5_000_000, { error: "File too large (max 5MB)" }),
      z
        .array(
          z
            .file()
            .mime(["application/pdf", "application/doc", "application/docx"])
            .max(5_000_000, { error: "File too large (max 5MB)" }),
        )
        .nonempty({ message: "Please select a file" }),
      z.string().min(1, "Please select a file"),
      // z.instanceof(globalThis.FileList),
    ])
    .optional(),
  addons: z
    .array(z.string())
    .min(1, "Please select at least one add-on")
    .max(3, "You can select up to 3 add-ons")
    .refine((value) => value.every((addon) => addons.some((a) => a.value === addon)), {
      message: "You selected an invalid add-on",
    }),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }),
  users: z
    .array(z.object({ email: z.email({ error: "Enter a valid email address." }) }))
    .min(1, "Add at least one email address.")
    .max(5, "You can add up to 5 email addresses."),
});

export const projectDeleteSchema = z.object({
  id: z.number().int().positive({ message: "Invalid project ID" }),
});

export type Project = z.infer<typeof projectSchema>;
