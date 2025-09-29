'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';
type Language = 'en' | 'pt' | 'es';

interface ThemeContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const translations = {
  en: {
    'nav.overview': 'Overview',
    'nav.portfolio': 'Portfolio',
    'nav.trading': 'Trading',
    'nav.analytics': 'Analytics',
    'nav.alerts': 'Alerts',
    'nav.settings': 'Settings',
    'profile.preferences': 'Preferences',
    'profile.help': 'Help & Support',
    'profile.signout': 'Sign Out',
    'preferences.title': 'Preferences',
    'preferences.darkMode': 'Dark Mode',
    'preferences.emailNotifications': 'Email Notifications',
    'preferences.soundAlerts': 'Sound Alerts',
    'preferences.language': 'Language',
    'preferences.currency': 'Currency',
    'preferences.save': 'Save Changes',
    'preferences.cancel': 'Cancel',
    'help.title': 'Help & Support',
    'help.faq': 'Frequently Asked Questions',
    'help.contact': 'Contact Support',
    'help.liveChat': 'Live Chat',
    'help.email': 'Email Support',
    'help.docs': 'Documentation',
  },
  pt: {
    'nav.overview': 'Visão Geral',
    'nav.portfolio': 'Portfólio',
    'nav.trading': 'Negociação',
    'nav.analytics': 'Análises',
    'nav.alerts': 'Alertas',
    'nav.settings': 'Configurações',
    'profile.preferences': 'Preferências',
    'profile.help': 'Ajuda e Suporte',
    'profile.signout': 'Sair',
    'preferences.title': 'Preferências',
    'preferences.darkMode': 'Modo Escuro',
    'preferences.emailNotifications': 'Notificações por Email',
    'preferences.soundAlerts': 'Alertas Sonoros',
    'preferences.language': 'Idioma',
    'preferences.currency': 'Moeda',
    'preferences.save': 'Salvar Alterações',
    'preferences.cancel': 'Cancelar',
    'help.title': 'Ajuda e Suporte',
    'help.faq': 'Perguntas Frequentes',
    'help.contact': 'Contatar Suporte',
    'help.liveChat': 'Chat ao Vivo',
    'help.email': 'Suporte por Email',
    'help.docs': 'Documentação',
  },
  es: {
    'nav.overview': 'Resumen',
    'nav.portfolio': 'Cartera',
    'nav.trading': 'Trading',
    'nav.analytics': 'Análisis',
    'nav.alerts': 'Alertas',
    'nav.settings': 'Configuración',
    'profile.preferences': 'Preferencias',
    'profile.help': 'Ayuda y Soporte',
    'profile.signout': 'Cerrar Sesión',
    'preferences.title': 'Preferencias',
    'preferences.darkMode': 'Modo Oscuro',
    'preferences.emailNotifications': 'Notificaciones por Email',
    'preferences.soundAlerts': 'Alertas de Sonido',
    'preferences.language': 'Idioma',
    'preferences.currency': 'Moneda',
    'preferences.save': 'Guardar Cambios',
    'preferences.cancel': 'Cancelar',
    'help.title': 'Ayuda y Soporte',
    'help.faq': 'Preguntas Frecuentes',
    'help.contact': 'Contactar Soporte',
    'help.liveChat': 'Chat en Vivo',
    'help.email': 'Soporte por Email',
    'help.docs': 'Documentación',
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedLanguage = localStorage.getItem('language') as Language;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
    
    document.documentElement.classList.toggle('dark', savedTheme === 'dark' || !savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      language,
      toggleTheme,
      setLanguage: changeLanguage,
      t,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};