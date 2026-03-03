import { CURRENCY_SYMBOL } from './constants';

export const formatPrice = (priceInCents: number): string => {
  return `${(priceInCents / 100).toFixed(2)} ${CURRENCY_SYMBOL}`;
};
