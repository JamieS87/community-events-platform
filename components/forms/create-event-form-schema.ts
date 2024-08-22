import { isEqual, isBefore, parse, format } from "date-fns";
import { z, ZodIssueCode } from "zod";

export const createEventFormSchema = z
  .object({
    name: z
      .string()
      .min(8, { message: "Name must be at least 8 characters in length" }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters in length",
    }),
    pricing_model: z.enum(["free", "paid", "payf"]),
    start_date: z.string().date(),
    end_date: z.string().date(),
    start_time: z.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/gm, {
      message:
        "start time must be a valid time (00:00 - 23:59) in the format HH:MM",
    }),
    end_time: z.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/gm, {
      message:
        "start time must be a valid time (00:00 - 23:59) in the format HH:MM",
    }),
    price: z.coerce.number().min(0).multipleOf(0.01, {
      message: "Price must have at most two decimal places",
    }),
    thumbnail: z.any().refine(
      (val) => {
        return (
          (typeof val === "string" && val.length > 1) || val instanceof File
        );
      },
      { message: "A thumbnail image is required" }
    ),
  })
  .superRefine(
    (
      { start_date, end_date, start_time, end_time, pricing_model, price },
      ctx
    ) => {
      const endsBeforeStarts = isBefore(end_date, start_date);
      if (endsBeforeStarts) {
        //The events end date is before the start date
        ctx.addIssue({
          code: ZodIssueCode.invalid_date,
          message: "End date must occur on or after the start date",
          path: ["end_date"],
          fatal: true,
        });
        return z.NEVER;
      }

      const sameDay = isEqual(start_date, end_date);
      if (sameDay) {
        //Events starts and ends on the same day
        const parsedStartDateTime = parse(start_time, "HH:mm", start_date);
        const parsedEndDateTime = parse(end_time, "HH:mm", end_date);
        const sameDayEndsBeforeStarts = !isBefore(
          parsedStartDateTime,
          parsedEndDateTime
        );
        if (sameDayEndsBeforeStarts) {
          //Event ends before it starts
          ctx.addIssue({
            code: ZodIssueCode.invalid_date,
            message:
              "The event's end time must occur after the event's start time",
            fatal: true,
            path: ["end_time"],
          });
          return z.NEVER;
        }
      }

      //Validate price for chosen pricing model
      if (pricing_model === "free") {
        if (price !== 0) {
          ctx.addIssue({
            code: "custom",
            message: "Free events must have a price of 0",
            path: ["price"],
          });
          return z.NEVER;
        }
      } else if (pricing_model === "paid") {
        if (price === 0) {
          ctx.addIssue({
            code: "custom",
            message: "Price must be more than 0 for paid events",
            path: ["price"],
          });
          return z.NEVER;
        }
      }
    }
  );
