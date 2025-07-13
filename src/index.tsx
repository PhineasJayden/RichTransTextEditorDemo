import React from 'react';
import ReactDOM from 'react-dom/client';
import RichTextEditorDemo from './RichTextEditorDemo';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RichTextEditorDemo />
  </React.StrictMode>
);
