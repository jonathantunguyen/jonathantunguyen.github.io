"use client";

import { create } from "zustand";
import { defaultFileId, getFile } from "@/lib/files";

export type Panel = "explorer" | "copilot";

/** Matches the `lg` breakpoint used for the desktop three-column layout. */
function isDesktop() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px)").matches
  );
}

interface IdeState {
  /** Open tab ids, left to right. */
  openTabs: string[];
  /** `null` means no file is open — the editor shows the watermark. */
  activeFile: string | null;

  /** Desktop side panes. */
  explorerOpen: boolean;
  copilotOpen: boolean;
  /** Which pane is showing as a slide-over on small screens. */
  mobilePanel: Panel | null;

  quickOpenOpen: boolean;

  /**
   * Transient message shown in the status bar — how a menu action confirms
   * itself, since a dropdown closes before it could show anything.
   */
  flash: string | null;
  setFlash: (message: string) => void;

  openFile: (id: string) => void;
  closeTab: (id: string) => void;
  setActive: (id: string) => void;

  /** Flips the desktop pane, or opens the slide-over on small screens. */
  togglePanel: (panel: Panel) => void;
  /** Force a panel open regardless of viewport (used by "ask the assistant"). */
  showPanel: (panel: Panel) => void;
  closeMobilePanel: () => void;
  isPanelOpen: (panel: Panel) => boolean;

  setQuickOpenOpen: (open: boolean) => void;
}

let flashTimer: ReturnType<typeof setTimeout> | null = null;

export const useIde = create<IdeState>((set, get) => ({
  openTabs: [defaultFileId],
  activeFile: defaultFileId,

  explorerOpen: true,
  copilotOpen: true,
  mobilePanel: null,

  quickOpenOpen: false,

  flash: null,
  setFlash: (message) => {
    if (flashTimer) clearTimeout(flashTimer);
    set({ flash: message });
    flashTimer = setTimeout(() => set({ flash: null }), 2400);
  },

  openFile: (id) =>
    set((state) => {
      // Downloads (the résumé) are links, not tabs.
      if (getFile(id)?.kind !== "pane") return state;
      return {
        activeFile: id,
        openTabs: state.openTabs.includes(id)
          ? state.openTabs
          : [...state.openTabs, id],
        quickOpenOpen: false,
        // Opening a file from the slide-over explorer should reveal the file.
        mobilePanel: state.mobilePanel === "explorer" ? null : state.mobilePanel,
      };
    }),

  closeTab: (id) =>
    set((state) => {
      const index = state.openTabs.indexOf(id);
      if (index === -1) return state;
      const openTabs = state.openTabs.filter((t) => t !== id);
      if (state.activeFile !== id) return { openTabs };
      // Focus the neighbour on the right, falling back to the left.
      const next = openTabs[index] ?? openTabs[index - 1] ?? null;
      return { openTabs, activeFile: next };
    }),

  setActive: (id) => set({ activeFile: id }),

  togglePanel: (panel) =>
    set((state) => {
      if (!isDesktop()) {
        return { mobilePanel: state.mobilePanel === panel ? null : panel };
      }
      return panel === "explorer"
        ? { explorerOpen: !state.explorerOpen }
        : { copilotOpen: !state.copilotOpen };
    }),

  showPanel: (panel) =>
    set(() =>
      isDesktop()
        ? panel === "explorer"
          ? { explorerOpen: true }
          : { copilotOpen: true }
        : { mobilePanel: panel },
    ),

  closeMobilePanel: () => set({ mobilePanel: null }),

  isPanelOpen: (panel) => {
    const s = get();
    if (s.mobilePanel === panel) return true;
    return panel === "explorer" ? s.explorerOpen : s.copilotOpen;
  },

  setQuickOpenOpen: (open) => set({ quickOpenOpen: open }),
}));
