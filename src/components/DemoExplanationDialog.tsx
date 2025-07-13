import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { useDemoI18n } from '../hooks/useDemoI18n';
import { generateI18nKey } from '../lib/func';

type Props = {
  explanationDialog: { open: boolean; selectedText: string };
  setExplanationDialog: (dialog: {
    open: boolean;
    selectedText: string;
  }) => void;
  selectionStart: number;
  selectionEnd: number;
  language?: string;
  insertTextAtPosition: (text: string, start: number, end: number) => void;
};

export default function DemoExplanationDialog({
  explanationDialog,
  setExplanationDialog,
  insertTextAtPosition,
  selectionStart,
  selectionEnd,
  language = 'de',
}: Readonly<Props>) {
  const [explanationText, setExplanationText] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const { getExplanation, saveExplanation } = useDemoI18n();

  useEffect(() => {
    async function fetchExistingExplanation() {
      if (!explanationDialog.selectedText) return;
      try {
        const i18nKey = generateI18nKey(explanationDialog.selectedText);
        const existingExplanation = await getExplanation(i18nKey);

        if (existingExplanation) {
          setExplanationText(existingExplanation);
          setIsEdit(true);
        } else {
          setExplanationText('');
          setIsEdit(false);
        }
      } catch (error) {
        console.error('Error fetching existing explanation:', error);
      }
    }

    fetchExistingExplanation();
  }, [explanationDialog.selectedText, getExplanation]);

  const handleExplanationSave = async () => {
    if (!explanationText.trim() || !explanationDialog.selectedText) return;

    try {
      setSaving(true);
      const i18nKey = generateI18nKey(explanationDialog.selectedText);

      await saveExplanation(i18nKey, explanationText);

      if (!isEdit) {
        const explanationTag = `<1 i18n="${i18nKey}">${explanationDialog.selectedText}</1>`;
        insertTextAtPosition(explanationTag, selectionStart, selectionEnd);
      }

      setExplanationDialog({ open: false, selectedText: '' });
      setExplanationText('');
    } catch (error) {
      console.error('Error saving explanation:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={explanationDialog.open}
      onClose={() => setExplanationDialog({ open: false, selectedText: '' })}
      maxWidth='sm'
      fullWidth
    >
      <DialogTitle>
        {language === 'de' ? 'Erklärung hinzufügen' : 'Add Explanation'}
      </DialogTitle>
      <DialogContent>
        <Typography variant='body2' sx={{ mb: 2 }}>
          {language === 'de' ? 'Text: ' : 'Text: '}
          <strong>{explanationDialog.selectedText}</strong>
        </Typography>
        <Typography variant='body2' sx={{ mb: 2 }}>
          I18n-Key:{' '}
          <code>{generateI18nKey(explanationDialog.selectedText)}</code>
        </Typography>
        {isEdit && (
          <Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
            {language === 'de'
              ? 'Bestehende Erklärung gefunden. Du kannst diese nun bearbeiten.'
              : 'Existing explanation found. You can edit it now.'}
          </Typography>
        )}
        <TextField
          autoFocus
          label={language === 'de' ? 'Erklärung' : 'Explanation'}
          fullWidth
          multiline
          rows={3}
          value={explanationText}
          onChange={(e) => setExplanationText(e.target.value)}
          placeholder={
            language === 'de'
              ? 'Geben Sie hier die Erklärung ein...'
              : 'Enter the explanation here...'
          }
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() =>
            setExplanationDialog({ open: false, selectedText: '' })
          }
        >
          {language === 'de' ? 'Abbrechen' : 'Cancel'}
        </Button>
        <Button
          onClick={handleExplanationSave}
          variant='contained'
          disabled={!explanationText.trim() || saving}
        >
          {saving
            ? language === 'de'
              ? 'Speichern...'
              : 'Saving...'
            : language === 'de'
              ? 'Erklärung hinzufügen'
              : 'Add Explanation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
