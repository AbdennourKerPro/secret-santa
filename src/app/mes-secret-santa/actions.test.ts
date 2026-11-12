import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ read: vi.fn(), send: vi.fn() }));
vi.mock("@/db", () => ({
  santa: { id: "id", name: "name", organizerTokenHash: "hash", organizerEmail: "email" },
  db: () => ({ select: () => ({ from: () => ({ where: () => ({ orderBy: mocks.read }) }) }) }),
}));
vi.mock("@/lib/mail", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/mail")>(),
  sendMail: mocks.send,
}));
import { recoverOrganizer } from "./actions";

describe("requesting organizer recovery", () => {
  function form(email: string) {
    const data = new FormData();
    data.set("recoveryEmail", email);
    return data;
  }
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("RESEND_API_KEY", "test-key");
    mocks.read.mockResolvedValue([{ id: "event-a", name: "Noël", hash: "private-hash" }]);
    mocks.send.mockResolvedValue(undefined);
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

  it("validates the address before querying", async () => {
    expect((await recoverOrganizer({}, form("invalid"))).error).toBeDefined();
    expect(mocks.read).not.toHaveBeenCalled();
  });
  it("sends recovery links only to the normalized organizer address", async () => {
    const state = await recoverOrganizer({}, form(" Owner@Example.com "));
    expect(state.ok).toBeDefined();
    expect(mocks.send).toHaveBeenCalledWith(expect.objectContaining({
      to: "owner@example.com", text: expect.stringContaining("/recuperer/event-a/"),
      idempotencyKey: expect.stringContaining("organizer-recovery/"),
    }));
    expect(JSON.stringify(state)).not.toContain("private-hash");
    expect(JSON.stringify(state)).not.toContain("event-a");
  });
  it("returns the same confirmation for an unknown address without sending mail", async () => {
    const known = await recoverOrganizer({}, form("owner@example.com"));
    mocks.read.mockResolvedValue([]);
    mocks.send.mockClear();
    expect(await recoverOrganizer({}, form("owner@example.com"))).toEqual(known);
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it("reports mail failures instead of claiming success", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.send.mockRejectedValue(new Error("mail unavailable"));
    const state = await recoverOrganizer({}, form("owner@example.com"));
    expect(state.error).toBeDefined();
    expect(state.ok).toBeUndefined();
  });
});
