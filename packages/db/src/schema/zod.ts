import { hostnameRegex } from "@workspace/shared/regex";
import z from "zod";

// {DateRange} from 'react-day-picker'
export const dateRangeSchema = z
  .object({
    from: z.date({ error: "Start date is required" }),
    to: z.date({ error: "End date is required" }),
  })
  .refine((data) => data.from && data.to && data.from < data.to, {
    message: "Start date must be before end date.",
    path: ["from"], // Associate error with the "from" field
  });

export const tagsSchema = z
  .string()
  .trim()
  .min(3, { message: "Tag must be at least 3 characters long" })
  .array()
  .max(5, "Max 5 tags allowed");

export const ipOrCidrSchema = z.union([
  z.ipv4("Invalid IPv4 address"), // Validates: 192.168.1.1
  z.ipv6("Invalid IPv6 address"), // Validates: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
  z.cidrv4("Invalid CIDRv4 address"), // Validates: 10.0.0.0/24
  z.cidrv6("Invalid CIDRv6 address"), // Validates: 2001:db8::/32
]);

export const ipSchema = z.union([
  z.ipv4("Invalid IPv4 address"), // Validates: 192.168.1.1
  z.ipv6("Invalid IPv6 address"), // Validates: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
]);

export const ipNullishSchema = z.preprocess(
  (val: unknown) => (val === "" ? null : val),
  ipSchema.nullish(),
);

export const ipOrHostnameSchema = z.union([
  z.ipv4("Invalid IPv4 address"), // Validates: 192.168.1.1
  z.ipv6("Invalid IPv6 address"), // Validates: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
  z.string().regex(hostnameRegex), // Validates: example.com, abc-123, localhost
]);

export const ipPortSchema = z.string().transform((value, ctx) => {
  const [ip, port] = value.split(":");

  if (!ip || !port) {
    ctx.addIssue({
      code: "custom",
      message: "Expected format ip:port",
    });
    return z.NEVER;
  }

  const ipResult = z.ipv4().safeParse(ip);
  if (!ipResult.success) {
    ctx.addIssue({
      code: "custom",
      message: "Invalid IPv4 address",
    });
  }

  const portNum = Number(port);
  if (!Number.isInteger(portNum) || portNum < 1 || portNum > 65535) {
    ctx.addIssue({
      code: "custom",
      message: "Invalid port number",
    });
  }

  if (!ctx.issues.length) {
    return value;
  }

  return z.NEVER;
});

export const port = z.number().int().min(1).max(65535);
