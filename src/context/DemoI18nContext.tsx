import React, { createContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';


interface DemoTranslation {
  [key: string]: string;
}

interface DemoTranslations {
  de: {
    content: DemoTranslation;
    explain: DemoTranslation;
  };
  en: {
    content: DemoTranslation;
    explain: DemoTranslation;
  };
}

interface DemoI18nContextType {
  language: 'de' | 'en';
  setLanguage: (lang: 'de' | 'en') => void;
  saveContent: (
    key: string,
    content: string,
    namespace?: string
  ) => Promise<void>;
  saveExplanation: (key: string, explanation: string) => Promise<void>;
  getExplanation: (key: string) => Promise<string | null>;
  getContent: (key: string, namespace?: string) => string;
  t: (key: string, namespace?: string) => string;
}

const DemoI18nContext = createContext<DemoI18nContextType | undefined>(
  undefined
);

export { DemoI18nContext };

const defaultTranslations: DemoTranslations = {
  de: {
    content: {
      'preview.content': 'Hier wird der formatierte Text angezeigt...',
      'demo.title': 'Rich Text Editor Demo',
      'demo.description':
        'Probieren Sie den Editor aus! Sie können Text formatieren und Erklärungen hinzufügen.',
      'demo.initial-content': `Willkommen zum <2>Rich Text Editor</2> Demo!

Dieser Editor unterstützt verschiedene Formatierungen:
- <2>Fette Schrift</2> mit dem Bold-Button
- <3>Kursive Schrift</3> mit dem Italic-Button  
- <4 href="https://example.com" target="blank">Links</4> zu externen Seiten
- <1 i18n="tooltip-demo">Erklärung-Tooltips</1> für Fachbegriffe<5/>
- Und <5/>Zeilenumbrüche<5/> mit dem BR-Button

Probieren Sie es aus! Markieren Sie Text und nutzen Sie die Buttons oben.`,
      'demo.reset-button': 'Demo Text zurücksetzen',
      'demo.saved-content-title': 'Letzter gespeicherter Inhalt:',
      'demo.editor-label': 'Rich Text Editor Demo',
      'demo.placeholder': 'Beginnen Sie mit der Eingabe...',
    },
    explain: {
      'tooltip-demo':
        'Ein Tooltip ist ein kleines Hilfefenster, das zusätzliche Informationen anzeigt, wenn man mit der Maus über einen Begriff fährt.',
    },
  },
  en: {
    content: {
      'preview.content': 'The formatted text will be displayed here...',
      'demo.title': 'Rich Text Editor Demo',
      'demo.description':
        'Try out the editor! You can format text and add explanations.',
      'demo.initial-content': `Welcome to the <2>Rich Text Editor</2> Demo!

This editor supports various formatting options:
- <2>Bold text</2> with the Bold button
- <3>Italic text</3> with the Italic button  
- <4 href="https://example.com" target="blank">Links</4> to external pages
- <1 i18n="tooltip-demo">Explanation tooltips</1> for technical terms<5/>
- And <5/>line breaks<5/> with the BR button

Try it out! Select text and use the buttons above.`,
      'demo.reset-button': 'Reset Demo Text',
      'demo.saved-content-title': 'Last saved content:',
      'demo.editor-label': 'Rich Text Editor Demo',
      'demo.placeholder': 'Start typing...',
    },
    explain: {
      'tooltip-demo':
        'A tooltip is a small help window that displays additional information when you hover over a term with your mouse.',
    },
  },
};

export function DemoI18nProvider({ children }: { children: React.ReactNode }) {

  const [language, setLanguage] = useState<'de' | 'en'>("en");
  const [translations, setTranslations] = useLocalStorage<DemoTranslations>(
    'demo-rich-text-translations',
    defaultTranslations
  );


  const saveContent = async (
    key: string,
    content: string,
    namespace = 'content'
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    setTranslations((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        [namespace]: {
          ...prev[language][namespace as keyof (typeof prev)[typeof language]],
          [key]: content,
        },
      },
    }));
  };

  const saveExplanation = async (key: string, explanation: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    setTranslations((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        explain: {
          ...prev[language].explain,
          [key]: explanation,
        },
      },
    }));
  };

  const getExplanation = async (key: string): Promise<string | null> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return translations[language].explain[key] || null;
  };

  const getContent = (key: string, namespace = 'content'): string => {
    try {
      if (namespace === 'content') {
        return (
          translations[language].content[key] ||
          defaultTranslations[language].content[key] ||
          key
        );
      } else if (namespace === 'explain') {
        return (
          translations[language].explain[key] ||
          defaultTranslations[language].explain[key] ||
          key
        );
      }
      return key;
    } catch (error) {
      console.error('Error getting translation:', error, {
        key,
        namespace,
        language,
      });
      return (
        defaultTranslations[language]?.content?.[key] ||
        defaultTranslations[language]?.explain?.[key] ||
        key
      );
    }
  };

  const t = (key: string, namespace = 'content'): string => {
    if (key.startsWith(`${namespace}:`)) {
      const actualKey = key.replace(`${namespace}:`, '');
      return getContent(actualKey, namespace);
    }
    return getContent(key, namespace);
  };

  return (
    <DemoI18nContext.Provider
      value={{
        language,
        setLanguage,
        saveContent,
        saveExplanation,
        getExplanation,
        getContent,
        t,
      }}
    >
      {children}
    </DemoI18nContext.Provider>
  );
}
