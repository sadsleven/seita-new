import { create } from 'zustand';
import type { CatalogName } from './models/CatalogItem';

interface CatalogsState {
  /** Which catalog tab is currently active. */
  activeCatalog: CatalogName;
  setActiveCatalog: (name: CatalogName) => void;
}

export const useCatalogsStore = create<CatalogsState>((set) => ({
  activeCatalog: 'countries',
  setActiveCatalog: (activeCatalog) => set({ activeCatalog }),
}));
