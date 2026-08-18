/* Base product price, stored in PKR. Rates are approximate, for display only. */
export const PRODUCT_PRICE_PKR = 999

export const CURRENCIES = {
  PKR: { symbol: '₨',   rate: 1,       decimals: false },
  INR: { symbol: '₹',   rate: 0.303,   decimals: false },
  USD: { symbol: '$',   rate: 0.00365, decimals: true  },
  EUR: { symbol: '€',   rate: 0.00333, decimals: true  },
  GBP: { symbol: '£',   rate: 0.00288, decimals: true  },
  AED: { symbol: 'د.إ', rate: 0.01335, decimals: true  },
}

export function formatPrice(currency) {
  const { symbol, rate, decimals } = CURRENCIES[currency]
  const amount = PRODUCT_PRICE_PKR * rate
  return `${symbol}${decimals ? amount.toFixed(2) : Math.round(amount)}`
}
