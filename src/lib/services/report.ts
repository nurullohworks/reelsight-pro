import type { Analysis } from "../types";

export interface ReportService {
  readonly id: string;
  /** Produces a printable report. PDF export uses the browser print pipeline. */
  export(analysis: Analysis): Promise<void>;
}

export const REPORT_DISCLAIMER =
  "AI-generated prediction. Results are estimates and not guaranteed.";

export const printReportService: ReportService = {
  id: "print",
  async export() {
    if (typeof window === "undefined") return;
    window.print();
  },
};

export const reportService: ReportService = printReportService;
