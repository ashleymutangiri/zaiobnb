import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'ZAR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (zarPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('zaiobnb_currency');
    return (saved as Currency) || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('zaiobnb_currency', currency);
  }, [currency]);

  const formatPrice = (zarPrice: number) => {
    if (currency === 'ZAR') {
      return `R${zarPrice.toLocaleString()}`;
    }
    const usdPrice = Math.round(zarPrice / 18);
    return `$${usdPrice.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
