import { useRef, useState, useEffect } from 'react'
import { CURRENCIES } from '../../lib/currency'
import { useCurrency } from '../../context/CurrencyContext'

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="currency-switcher" ref={ref}>
      <button
        className={`currency-btn${open ? ' open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Currency: ${currency}, click to change`}
      >
        {CURRENCIES[currency].symbol} {currency}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <ul className="currency-menu" role="listbox">
          {Object.keys(CURRENCIES).map(code => (
            <li key={code}>
              <button
                role="option"
                aria-selected={code === currency}
                className={`currency-option${code === currency ? ' active' : ''}`}
                onClick={() => { setCurrency(code); setOpen(false) }}
              >
                {CURRENCIES[code].symbol} {code}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
