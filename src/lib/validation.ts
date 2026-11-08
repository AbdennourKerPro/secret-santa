import { z } from "zod";

const text = (max: number) => z.string().trim().min(1, "Champ requis").max(max, `${max} caractères maximum`);
const email = z.string().trim().toLowerCase().email("Adresse e-mail invalide").max(200);

export const MAX_PARTICIPANTS = 100;

export const createSantaSchema = z.object({
  name: text(80),
  exchangeDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide")
    .refine((d) => !Number.isNaN(Date.parse(`${d}T00:00:00Z`)), "Date invalide"),
  budget: z.coerce.number().int("Budget entier").min(1, "Budget minimum : 1").max(10000, "Budget maximum : 10 000"),
  message: z.string().trim().max(500, "500 caractères maximum").default(""),
  organizerName: text(60),
  organizerEmail: email,
  organizerPlays: z.boolean().default(false),
});

export const participantSchema = z.object({ name: text(60), email });

export const MAX_WISHLIST = 1000;
export const MAX_MESSAGE = 500;
export const MAX_THREAD_MESSAGES = 200;

export const wishlistSchema = z.object({ content: z.string().trim().max(MAX_WISHLIST, `${MAX_WISHLIST} caractères maximum`) });
export const messageSchema = z.object({ body: text(MAX_MESSAGE) });

export type FieldErrors = Record<string, string[] | undefined>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    (out[key] ??= []).push(issue.message);
  }
  return out;
}
