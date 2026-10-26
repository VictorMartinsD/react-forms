import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type EventFormData = {
  name: string;
  date: string;
  time: string;
  subject: string;
  otherSubject?: string;
  description: string;
};

type EventFormStore = {
  formData: EventFormData;
  clearFormData: () => void;
  saveFormData: (data: Partial<EventFormData>) => void;
};

export const initialFormData: EventFormData = {
  name: "",
  date: "",
  time: "",
  subject: "",
  otherSubject: "",
  description: "",
};

export const useEventFormStore = create<EventFormStore>()(
  persist(
    (set) => ({
      formData: initialFormData,
      clearFormData: () => set({ formData: initialFormData }),
      saveFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
    }),
    {
      name: "event-form-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
