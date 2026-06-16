/** Domain model for the global product-type catalog — pure TypeScript, no React/MUI/HTTP. */

export interface ProductType {
  id: number;
  name: string;
  /** Short free-text description. */
  description: string;
  /** Plant-type names this product type is available for. */
  availableFor: string[];
}

/** Payload for creating a product type. */
export interface CreateProductTypeInput {
  name: string;
  description: string;
  availableFor: string[];
}
