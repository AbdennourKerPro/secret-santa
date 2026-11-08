import { describe, expect, it } from "vitest";
import { createSantaSchema, fieldErrors, participantSchema } from "./validation";

const valid = {
  name: "Noël 2026",
  exchangeDate: "2026-12-24",
  budget: "20",
  message: "",
  organizerName: "Abdennour",
  organizerEmail: "ORGA@Example.com ",
  organizerPlays: true,
};

describe("createSantaSchema", () => {
  it("accepte une saisie valide et normalise l'e-mail", () => {
    const r = createSantaSchema.parse(valid);
    expect(r.budget).toBe(20);
    expect(r.organizerEmail).toBe("orga@example.com");
  });
  it("rejette budget, date et e-mail invalides", () => {
    const r = createSantaSchema.safeParse({ ...valid, budget: "0", exchangeDate: "demain", organizerEmail: "x" });
    expect(r.success).toBe(false);
    if (!r.success) expect(Object.keys(fieldErrors(r.error))).toEqual(
      expect.arrayContaining(["budget", "exchangeDate", "organizerEmail"]),
    );
  });
});

describe("participantSchema", () => {
  it("normalise et valide", () => {
    expect(participantSchema.parse({ name: " Léa ", email: "LEA@x.fr" })).toEqual({ name: "Léa", email: "lea@x.fr" });
    expect(participantSchema.safeParse({ name: "", email: "lea@x.fr" }).success).toBe(false);
  });
});
