import { create } from "zustand";
import { IssueService } from "../services/IssueServices";

export const useIssuesStore = create((set) => ({
  issues: [],
  error: "",

  fetchIssues: async () => {
    try {
      const res = await IssueService.getAll();
      set({ issues: res.data });
    } catch (err) {
      set({ error: "Gabim gjatë marrjes së issues" });
    }
  },

  deleteIssue: async (id) => {
    try {
      await issuesService.delete(id);
      set((state) => ({
        issues: state.issues.filter((i) => i.id !== id),
      }));
    } catch (err) {
      throw err;
    }
  },
}));
