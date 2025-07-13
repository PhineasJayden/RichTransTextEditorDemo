import { useContext } from 'react';
import { DemoI18nContext } from '../context/DemoI18nContext';

export function useDemoI18n() {
  const context = useContext(DemoI18nContext);
  if (context === undefined) {
    throw new Error('useDemoI18n must be used within a DemoI18nProvider');
  }
  return context;
}
