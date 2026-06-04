import { create } from "zustand";
import { constructionPermitsService } from "../services/constructionPermitsService";
import { currentUser } from "../services/authService";

export const useConstructionPermitsStore = create((set, get) => ({
  permits: [],
  user: null,
  error: "",

  fetchPermits: async () => {
    try {
      const res = await constructionPermitsService.getAll();
      set({ permits: res.data, error: "" });
    } catch (err) {
      set({ error: "Gabim gjatë marrjes së të dhënave" });
    }
  },

  fetchCurrentUser: async () => {
    try {
      const data = await currentUser();
      set({ user: data });
    } catch (err) {
      console.log("Gabim user", err);
    }
  },

  deletePermit: async (id) => {
    try {
      await constructionPermitsService.deleteSoft(id);
      set((state) => ({
        permits: state.permits.filter((p) => p.id !== id),
      }));
    } catch (err) {
      throw err;
    }
  },

  updateStatus: async (id, newStatus) => {
    try {
      await constructionPermitsService.updateStatus(id, {
        status: Number(newStatus),
      });

      set((state) => ({
        permits: state.permits.map((p) =>
          p.id === id ? { ...p, status: Number(newStatus) } : p,
        ),
      }));
    } catch (err) {
      throw err;
    }
  },
}));
