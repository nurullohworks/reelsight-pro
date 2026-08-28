import { accountSnapshot } from "../mock-data";
import type { AccountSnapshot } from "../types";

export interface AccountAnalysisService {
  readonly id: string;
  getSnapshot(handle: string): Promise<AccountSnapshot>;
}

export const mockAccountAnalysisService: AccountAnalysisService = {
  id: "mock",
  async getSnapshot(handle) {
    return { ...accountSnapshot, handle: handle || accountSnapshot.handle };
  },
};

export const accountAnalysisService: AccountAnalysisService = mockAccountAnalysisService;
