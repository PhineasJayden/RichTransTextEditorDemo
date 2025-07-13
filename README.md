# RichTransTextEditorDemo

Eine React-Demo-Anwendung für einen Rich-Text-Editor mit Internationalisierung und benutzerdefinierten Formatierungs-Tags.

## Überblick

Diese Demo zeigt einen erweiterten Rich-Text-Editor, der:
- **Custom Markup-Tags** für Formatierung verwendet (`<2>`, `<3>`, `<4>`, `<5/>`)
- **Mehrsprachigkeit** (Deutsch/Englisch) unterstützt
- **Live-Vorschau** der formatierten Inhalte bietet
- **Interaktive Tooltips und Erklärungen** ermöglicht
- **Speicher- und Reset-Funktionalität** für Änderungen bereitstellt

## Features

### 🎨 Rich-Text-Formatierung
- **Fett**: `<2>Text</2>` - Macht Text fett
- **Kursiv**: `<3>Text</3>` - Macht Text kursiv
- **Links**: `<4 href="url" target="blank">Text</4>` - Erstellt anklickbare Links
- **Erklärungen**: `<1>Text</1>` - Fügt erklärende Tooltips hinzu
- **Zeilenumbrüche**: `<5/>` - Erzeugt Zeilenumbrüche

### 🌐 Internationalisierung
- Dynamischer Sprachwechsel zwischen Deutsch und Englisch
- Lokalisierte Tooltips und Benutzeroberfläche
- Mehrsprachige Erklärungsdialoge

### 👁️ Live-Vorschau
- Umschaltbare Ansicht zwischen Editor und Vorschau
- Echtzeitrendering der Custom-Tags
- Formatierte Darstellung mit Material-UI

### 💾 Änderungsverwaltung
- Erkennung ungespeicherter Änderungen
- Speichern und Zurücksetzen von Bearbeitungen
- Visuelle Indikatoren für den Änderungsstatus

## Technische Details

### Technologie-Stack
- **React 18** mit TypeScript
- **Material-UI (MUI)** für UI-Komponenten
- **Custom Hooks** für Zustandsverwaltung
- **Context API** für Internationalisierung

### Projektstruktur
```
/
├── public/
│   └── index.html                 # HTML-Template
├── src/
│   ├── index.tsx                  # App-Einstiegspunkt
│   ├── index.css                  # Globale Styles
│   ├── DemoRichTextEditor.tsx     # Haupt-Editor-Komponente
│   ├── RichTextEditorDemo.tsx     # Demo-Wrapper
│   ├── components/
│   │   ├── DemoRichTrans.tsx      # Text-Rendering-Komponente
│   │   ├── DemoExplanationDialog.tsx  # Erklärungsdialog
│   │   └── DemoExplainTooltip.tsx # Tooltip-Komponente
│   ├── context/
│   │   └── DemoI18nContext.tsx    # Internationalisierung
│   └── hooks/
│       ├── useDemoI18n.tsx        # i18n Hook
│       └── useLocalStorage.tsx    # LocalStorage Hook
├── package.json                   # Abhängigkeiten und Scripts
├── tsconfig.json                  # TypeScript-Konfiguration
└── .gitignore                     # Git-Ignore-Regeln
```

## Installation

1. **Abhängigkeiten installieren:**
```bash
npm install
```

2. **Erforderliche Pakete:**
```bash
npm install react react-dom @mui/material @mui/icons-material @emotion/react @emotion/styled
```

3. **TypeScript-Abhängigkeiten (falls erforderlich):**
```bash
npm install --save-dev typescript @types/react @types/react-dom
```

## Verwendung

### Grundlegende Integration
```tsx
import DemoRichTextEditor from './src/DemoRichTextEditor';

function App() {
  const [content, setContent] = useState('');

  return (
    <DemoRichTextEditor
      value={content}
      onChange={setContent}
      placeholder="Text eingeben..."
      label="Rich Text Editor"
      minRows={3}
      maxRows={10}
      namespace="demo"
    />
  );
}
```

### Props
| Prop | Typ | Beschreibung |
|------|-----|--------------|
| `value` | `string` | Aktueller Textinhalt |
| `onChange` | `(value: string) => void` | Callback für Textänderungen |
| `placeholder` | `string` | Platzhaltertext |
| `label` | `string` | Editor-Label |
| `minRows` | `number` | Minimale Zeilen (Standard: 3) |
| `maxRows` | `number` | Maximale Zeilen (Standard: 5) |
| `namespace` | `string` | i18n-Namespace |

## Custom Markup-Tags

### Formatierungs-Tags
- `<2>Fetter Text</2>` → **Fetter Text**
- `<3>Kursiver Text</3>` → *Kursiver Text*
- `<4 href="https://example.com" target="blank">Link</4>` → [Link](https://example.com)
- `<1>Text mit Erklärung</1>` → Text mit Tooltip
- `<5/>` → Zeilenumbruch

### Beispiel-Markup
```
Das ist <2>fetter Text</2> und das ist <3>kursiver Text</3>.

Hier ist ein <4 href="https://example.com" target="blank">externer Link</4>.

<1>Dieser Text hat eine Erklärung</1> in einem Tooltip.

<5/>

Neue Zeile nach dem Umbruch.
```

## Tastenkombinationen

| Aktion | Tastenkombination |
|--------|-------------------|
| Zeilenumbruch einfügen | `Enter` |
| Fett formatieren | Toolbar-Button nach Textauswahl |
| Kursiv formatieren | Toolbar-Button nach Textauswahl |
| Link einfügen | Toolbar-Button nach Textauswahl |
| Erklärung hinzufügen | Toolbar-Button nach Textauswahl |

## Entwicklung

### Starten der Demo
```bash
npm start
```

### Build erstellen
```bash
npm run build
```

### Tests ausführen
```bash
npm test
```

## Anpassung

### Neue Formatierungs-Tags hinzufügen
1. Tag-Definition in `src/components/DemoRichTrans.tsx` erweitern
2. Toolbar-Button in `src/DemoRichTextEditor.tsx` hinzufügen
3. Handler-Funktion implementieren

### Neue Sprachen hinzufügen
1. Sprachdateien in `src/context/DemoI18nContext.tsx` erweitern
2. Übersetzungen für alle UI-Elemente hinzufügen
3. Sprachauswahl in der Toolbar anpassen

## Lizenz

Dieses Projekt ist eine Demo-Anwendung für Bildungszwecke.

## Beiträge

Beiträge sind willkommen! Bitte erstellen Sie Issues oder Pull Requests für Verbesserungen.