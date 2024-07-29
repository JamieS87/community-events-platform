import { isEqual, isBefore, parse } from "date-fns";
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
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    start_time: z
      .string()
      .transform((v) => v + ":00")
      .pipe(z.string().time({ message: "Time must be in the format HH:MM" })),
    end_time: z
      .string()
      .transform((v) => v + ":00")
      .pipe(z.string().time({ message: "Time must be in the format HH:MM" })),
    price: z.coerce.number().min(0),
  })
  .superRefine(
    (
      { start_date, end_date, start_time, end_time, pricing_model, price },
      ctx
    ) => {
      //Validate dates
      if (isEqual(start_date, end_date)) {
        if (
          !isBefore(
            parse(start_time, "HH:mm:ss", start_date),
            parse(end_time, "HH:mm:ss", end_date)
          )
        ) {
          ctx.addIssue({
            code: ZodIssueCode.invalid_date,
            message:
              "The event's start time must occur before the event's end time",
            fatal: true,
            path: ["start_time"],
          });
          return z.NEVER;
        }
      } else if (!isBefore(start_date, end_date)) {
        ctx.addIssue({
          code: ZodIssueCode.invalid_date,
          message: "Start date must occur on or before end date",
          path: ["start_date"],
          fatal: true,
        });
        return z.NEVER;
      }

      //Validate price for chosen pricing model
      if (pricing_model === "free") {
        if (price !== 0) {
          ctx.addIssue({
            code: "custom",
            message: "Free events must have a price of 0",
            path: ["price"],
          });
        }
      } else if (pricing_model === "paid") {
        if (price === 0) {
          ctx.addIssue({
            code: "custom",
            message: "Price must be more than 0 for paid events",
            path: ["price"],
          });
        }
      }
    }
  );
