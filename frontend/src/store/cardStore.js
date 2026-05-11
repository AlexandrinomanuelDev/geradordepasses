import { create } from 'zustand';

const useCardStore = create((set, get) => ({
  name: '',
  jobTitle: '',
  employeeId: '',
  admissionDate: '',
  qrData: '',

  photoFile: null,
  photoUrl: null,

  isGenerating: false,
  error: null,

  setField: (key, value) => set({ [key]: value }),

  setPhoto: (file) => {
    const prev = get().photoUrl;
    if (prev) URL.revokeObjectURL(prev);
    const url = file ? URL.createObjectURL(file) : null;
    set({ photoFile: file, photoUrl: url });
  },

  setGenerating: (bool) => set({ isGenerating: bool }),
  setError: (msg) => set({ error: msg }),
  clearError: () => set({ error: null }),
}));

export default useCardStore;
