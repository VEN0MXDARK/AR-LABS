import { createContext, useContext, useEffect, useState } from 'react'
import { CURRENCIES } from '../lib/currency'

const CurrencyContext = createContext(null)

function readStored() {
  if (typeof window === 'undefined') return 'PKR'
  const stored = window.localStorage.getItem('ar-labs-currency')
  return stored && CURRENCIES[stored] ? stored : 'PKR'
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(readStored)

  useEffect(() => {
    window.localStorage.setItem('ar-labs-currency', currency)
  }, [currency])

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
