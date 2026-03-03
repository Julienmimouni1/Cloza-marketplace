export interface StockValidationResult {
  isValid: boolean;
  availableQuantity: number;
  requestedQuantity: number;
}

/**
 * Pure logic for stock validation
 * Can be used on both Client (optimistic) and Server (truth)
 */
export function validateStock(
  requestedQuantity: number,
  availableStock: number
): StockValidationResult {
  const isValid = requestedQuantity <= availableStock;
  
  return {
    isValid,
    availableQuantity: availableStock,
    requestedQuantity
  };
}
