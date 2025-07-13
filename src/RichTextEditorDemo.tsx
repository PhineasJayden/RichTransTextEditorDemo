import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { DemoI18nProvider } from './context/DemoI18nContext';
import DemoRichTextEditor from './DemoRichTextEditor';
import DemoRichTrans from './components/DemoRichTrans';
import { useDemoI18n } from './hooks/useDemoI18n';

function RichTextEditorDemo() {
  const { t, language } = useDemoI18n();
  const [content, setContent] = useState('');
  const [savedContent, setSavedContent] = useState('');

  useEffect(() => {
    setContent(t('demo.initial-content'));
  }, [t, language]);

  const handleSave = (newContent: string) => {
    setContent(newContent);
    setSavedContent(newContent);
  };

  const handleReset = () => {
    setContent(t('demo.initial-content'));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <DemoRichTextEditor
        value={content}
        onChange={handleSave}
        placeholder={t('demo.placeholder')}
        minRows={3}
        maxRows={10}
      />

      <Button
        variant='contained'
        onClick={handleReset}
        sx={{
          background: 'var(--gradient)',
          color: '#fff',
          fontSize: '0.875rem',
          fontWeight: 600,
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          transition: 'all 0.2s ease',
          mt: 2,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            background: 'var(--gradient-light)',
          },
        }}
      >
        {t('demo.reset-button')}
      </Button>

      {savedContent && (
        <Paper sx={{ mt: 3, p: { xs: 1.5, sm: 2 }, bgcolor: 'grey.50' }}>
          <Typography variant='h6' gutterBottom>
            {t('demo.saved-content-title')}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <DemoRichTrans
              i18nKey='saved.content'
              ns='temp'
              previewContent={savedContent}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default function RichTextEditorDemoWithProvider() {
  return (
    <DemoI18nProvider>
      <RichTextEditorDemo />
    </DemoI18nProvider>
  );
}
