export const generateI18nKey = (text: string): string => {
  const charMap: Record<string, string> = {
    ä: 'ae',
    ö: 'oe',
    ü: 'ue',
    ß: 'ss',
    à: 'a',
    á: 'a',
    â: 'a',
    ã: 'a',
    å: 'a',
    è: 'e',
    é: 'e',
    ê: 'e',
    ë: 'e',
    ì: 'i',
    í: 'i',
    î: 'i',
    ï: 'i',
    ò: 'o',
    ó: 'o',
    ô: 'o',
    õ: 'o',
    ù: 'u',
    ú: 'u',
    û: 'u',
    ç: 'c',
    ñ: 'n',
  };

  return text
    .toLowerCase()
    .replace(/[äöüßàáâãåèéêëìíîïòóôõùúûçñ]/g, (char) => charMap[char] || char)
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};
