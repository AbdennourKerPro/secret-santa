import { beforeEach, describe, expect, it, vi } from "vitest";
import { hashToken } from "@/lib/tokens";
import { recoveryProof } from "@/lib/recovery";

const mocks = vi.hoisted(() => ({
  read: vi.fn(), write: vi.fn(), set: vi.fn(),
  redirect: vi.fn((url: string): never => { throw new Error(`redirect:${url}`); }),
}));

vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/db", () => ({
  santa: { id: "id", organizerTokenHash: "hash" },
  db: () => ({
    select: () => ({ from: () => ({ where: () => ({ limit: mocks.read }) }) }),
    update: () => ({ set: mocks.set }),
  }),
}));

import { confirmRecovery } from "./actions";

describe("confirming organizer recovery", () => {
  const id = "12345678-1234-1234-1234-123456789abc";
  const hash = hashToken("original-private-token");
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.read.mockResolvedValue([{ hash }]);
    mocks.set.mockReturnValue({ where: () => ({ returning: mocks.write }) });
    mocks.write.mockResolvedValue([{ id }]);
  });

  it("rejects forged credentials without changing the event", async () => {
    await expect(confirmRecovery(id, recoveryProof(id, "wrong-secret"))).rejects.toThrow("redirect:/mes-secret-santa");
    expect(mocks.set).not.toHaveBeenCalled();
  });

  it("rotates only the organizer credential and redirects to the new private dashboard", async () => {
    await expect(confirmRecovery(id, recoveryProof(id, hash))).rejects.toThrow(/redirect:\/orga\/[\w-]{43}$/);
    expect(mocks.set).toHaveBeenCalledWith({ organizerTokenHash: expect.stringMatching(/^[a-f0-9]{64}$/) });
    const url = mocks.redirect.mock.calls[0][0];
    expect(mocks.set.mock.calls[0][0].organizerTokenHash).toBe(hashToken(url.split("/").at(-1)!));
  });

  it("does not grant access if a concurrent confirmation already changed the credential", async () => {
    mocks.write.mockResolvedValue([]);
    await expect(confirmRecovery(id, recoveryProof(id, hash))).rejects.toThrow("redirect:/mes-secret-santa");
  });

  it("rejects a used proof after the stored credential has changed", async () => {
    mocks.read.mockResolvedValue([{ hash: hashToken("new-private-token") }]);
    await expect(confirmRecovery(id, recoveryProof(id, hash))).rejects.toThrow("redirect:/mes-secret-santa");
    expect(mocks.set).not.toHaveBeenCalled();
  });
});
