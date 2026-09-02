import { AppError } from "@/Errors/AppError";
import { z } from "zod";

const nonNegativeNumber = z.number().finite().min(0);
const productStatus = z.enum(["available", "unavailable", "coming_soon"]);
const stockSchema = z.object({
  xs: z.number().int().min(0),
  sm: z.number().int().min(0),
  md: z.number().int().min(0),
  lg: z.number().int().min(0),
  xl: z.number().int().min(0),
}).strict();

const productFields = {
  title: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(80),
  style: z.array(z.string().trim().min(1).max(80)).max(20),
  imgs: z.array(z.string().url()).min(1).max(8),
  price: nonNegativeNumber,
  offerPrice: nonNegativeNumber.nullable(),
  stock: stockSchema,
  desc: z.string().trim().min(1).max(5000),
  status: productStatus,
};

export const productCreateSchema = z.object(productFields).strict().superRefine(
  (value, ctx) => {
    if (value.offerPrice != null && value.offerPrice >= value.price) {
      ctx.addIssue({
        code: "custom",
        path: ["offerPrice"],
        message: "Offer price must be lower than the regular price.",
      });
    }
  },
);

export const productUpdateSchema = z.object(productFields).partial().strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one product field is required.",
  });

const couponFields = {
  code: z.string().trim().min(2).max(64).transform((value) => value.toUpperCase()),
  type: z.enum(["percent", "fixed"]),
  value: nonNegativeNumber,
  isActive: z.boolean(),
  expiresAt: z.union([z.string().date(), z.string().datetime()]).nullable(),
  usageLimit: z.number().int().min(0).nullable(),
};

export const couponCreateSchema = z.object({
  ...couponFields,
  isActive: z.boolean().default(true),
  expiresAt: z.string().datetime().nullable().default(null),
  usageLimit: z.number().int().min(0).nullable().default(null),
}).strict().superRefine(
  (value, ctx) => {
    if (value.type === "percent" && value.value > 100) {
      ctx.addIssue({ code: "custom", path: ["value"], message: "Percent value must be between 0 and 100." });
    }
  },
);

export const couponUpdateSchema = z.object(couponFields).partial().strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one coupon field is required.",
  });

export const shippingRateUpdateSchema = z.object({
  governorate: z.string().trim().min(1).max(80).optional(),
  price: nonNegativeNumber.optional(),
  isActive: z.boolean().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: "At least one shipping field is required.",
});

export function validateAdminInput<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new AppError(result.error.issues[0]?.message || "Invalid request data", 400);
  }
  return result.data;
}
