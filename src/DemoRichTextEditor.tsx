import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import {
  Box,
  Paper,
  Toolbar,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  Link,
  HelpOutline,
  Visibility,
  VisibilityOff,
  Save,
  Refresh,
} from '@mui/icons-material';
import DemoRichTrans from './components/DemoRichTrans';
import DemoExplanationDialog from './components/DemoExplanationDialog';
import { useDemoI18n } from './hooks/useDemoI18n';

const TextIconButton = styled(IconButton)`
  font-size: 0.875rem;
  padding: 0.5rem;
  color: var(--text-color);
  background: transparent;
  border: 1px solid transparent;
  text-shadow: none;
  &:hover {
    border: 1px solid var(--border-color);
    background: transparent;
    color: var(--text-color);
    text-shadow: none;
  }
  transition: border 0.2s ease;
`;

interface DemoRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  minRows?: number;
  maxRows?: number;
  namespace?: string;
}

export default function DemoRichTextEditor({
  value,
  onChange,
  namespace,
  placeholder,
  label,
  minRows = 3,
  maxRows = 5,
}: DemoRichTextEditorProps) {
  const { language, setLanguage } = useDemoI18n();
  const [localValue, setLocalValue] = useState(value);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const [linkDialog, setLinkDialog] = useState({
    open: false,
    selectedText: '',
  });
  const [explanationDialog, setExplanationDialog] = useState({
    open: false,
    selectedText: '',
  });
  const [linkUrl, setLinkUrl] = useState('');

  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
    setHasUnsavedChanges(false);
  }, [value]);

  useEffect(() => {
    setHasUnsavedChanges(localValue !== value);
  }, [localValue, value]);

  const handleSave = useCallback(() => {
    onChange(localValue);
    setHasUnsavedChanges(false);
  }, [localValue, onChange]);

  const handleReset = useCallback(() => {
    setLocalValue(value);
    setHasUnsavedChanges(false);
  }, [value]);

  const getSelectedText = useCallback(() => {
    if (textFieldRef.current) {
      const start = textFieldRef.current.selectionStart;
      const end = textFieldRef.current.selectionEnd;
      return {
        text: localValue.substring(start, end),
        start,
        end,
      };
    }
    return { text: '', start: 0, end: 0 };
  }, [localValue]);

  const insertTextAtPosition = useCallback(
    (text: string, start: number, end: number) => {
      const newValue =
        localValue.substring(0, start) + text + localValue.substring(end);
      setLocalValue(newValue);

      setTimeout(() => {
        if (textFieldRef.current) {
          const newPosition = start + text.length;
          textFieldRef.current.setSelectionRange(newPosition, newPosition);
          textFieldRef.current.focus();
        }
      }, 0);
    },
    [localValue]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLocalValue(e.target.value);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') {
        if (textFieldRef.current) {
          e.stopPropagation();

          const start = textFieldRef.current.selectionStart;
          const end = textFieldRef.current.selectionEnd;
          const newValue =
            localValue.substring(0, start) +
            '<5/>\n' +
            localValue.substring(end);
          setLocalValue(newValue);
          setTimeout(() => {
            if (textFieldRef.current) {
              const newPosition = start + 5;
              textFieldRef.current.setSelectionRange(newPosition, newPosition);
              textFieldRef.current.focus();
            }
          }, 0);
        }
      }
    },
    [localValue]
  );

  const handleBold = useCallback(() => {
    const { text, start, end } = getSelectedText();
    if (text) {
      insertTextAtPosition(`<2>${text}</2>`, start, end);
    } else {
      insertTextAtPosition('<2></2>', start, end);
      setTimeout(() => {
        if (textFieldRef.current) {
          const newPosition = start + 3;
          textFieldRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  }, [getSelectedText, insertTextAtPosition]);

  const handleItalic = useCallback(() => {
    const { text, start, end } = getSelectedText();
    if (text) {
      insertTextAtPosition(`<3>${text}</3>`, start, end);
    } else {
      insertTextAtPosition('<3></3>', start, end);
      setTimeout(() => {
        if (textFieldRef.current) {
          const newPosition = start + 3;
          textFieldRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  }, [getSelectedText, insertTextAtPosition]);

  const handleLineBreak = useCallback(() => {
    const { start, end } = getSelectedText();
    insertTextAtPosition('<5/>', start, end);
  }, [getSelectedText, insertTextAtPosition]);

  const handleLinkClick = useCallback(() => {
    const { text, start, end } = getSelectedText();
    if (text) {
      setLinkDialog({ open: true, selectedText: text });
      setSelectionStart(start);
      setSelectionEnd(end);
    } else {
      alert(
        language === 'de'
          ? 'Bitte markieren Sie zuerst Text für den Link.'
          : 'Please select text for the link first.'
      );
    }
  }, [getSelectedText, language]);

  const handleExplanationClick = useCallback(() => {
    const { text, start, end } = getSelectedText();
    if (text) {
      setExplanationDialog({ open: true, selectedText: text });
      setSelectionStart(start);
      setSelectionEnd(end);
    } else {
      alert(
        language === 'de'
          ? 'Bitte markieren Sie zuerst Text für die Erklärung.'
          : 'Please select text for the explanation first.'
      );
    }
  }, [getSelectedText, language]);

  const handleLinkSave = useCallback(() => {
    if (linkUrl && linkDialog.selectedText) {
      const linkText = `<4 href="${linkUrl}" target="blank">${linkDialog.selectedText}</4>`;
      insertTextAtPosition(linkText, selectionStart, selectionEnd);
    }
    setLinkDialog({ open: false, selectedText: '' });
    setLinkUrl('');
  }, [
    linkUrl,
    linkDialog.selectedText,
    selectionStart,
    selectionEnd,
    insertTextAtPosition,
  ]);

  const handlePreviewToggle = useCallback(() => {
    setShowPreview(!showPreview);
  }, [showPreview]);

  const handleLanguageToggle = useCallback(() => {
    const newLanguage = language === 'de' ? 'en' : 'de';
    setLanguage(newLanguage);
  }, [language, setLanguage]);

  const textFieldProps = useMemo(
    () => ({
      inputRef: textFieldRef,
      multiline: true,
      fullWidth: true,
      minRows,
      maxRows,
      value: localValue,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      placeholder:
        placeholder ||
        (language === 'de' ? 'Text eingeben...' : 'Enter text...'),
      variant: 'outlined' as const,
      sx: {
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            border: 'none',
          },
        },
        '& .MuiInputBase-input': {
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          userSelect: 'text',
          WebkitUserSelect: 'text',
          MozUserSelect: 'text',
          msUserSelect: 'text',
          touchAction: 'manipulation',
        },
      },
    }),
    [
      minRows,
      maxRows,
      localValue,
      handleChange,
      handleKeyDown,
      placeholder,
      language,
    ]
  );

  return (
    <Box>
      {label && (
        <Typography variant='subtitle2' sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}

      <Paper variant='outlined'>
        <Toolbar
          variant='dense'
          sx={{
            minHeight: 'unset',
            px: 1,
            flexWrap: 'wrap',
            gap: 0.5,
            py: 1,
            '& .MuiDivider-root': {
              display: { xs: 'none', sm: 'block' },
            },
          }}
        >
          {/* Formatting Group */}
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            <Tooltip
              title={
                language === 'de' ? 'Fett (<2>text</2>)' : 'Bold (<2>text</2>)'
              }
            >
              <TextIconButton size='small' onClick={handleBold}>
                <FormatBold />
              </TextIconButton>
            </Tooltip>

            <Tooltip
              title={
                language === 'de'
                  ? 'Kursiv (<3>text</3>)'
                  : 'Italic (<3>text</3>)'
              }
            >
              <TextIconButton size='small' onClick={handleItalic}>
                <FormatItalic />
              </TextIconButton>
            </Tooltip>

            <Tooltip
              title={
                language === 'de' ? 'Link (<4>text</4>)' : 'Link (<4>text</4>)'
              }
            >
              <TextIconButton size='small' onClick={handleLinkClick}>
                <Link />
              </TextIconButton>
            </Tooltip>

            {namespace !== 'explain' && (
              <Tooltip
                title={
                  language === 'de'
                    ? 'Erklärung (<1>text</1>)'
                    : 'Explanation (<1>text</1>)'
                }
              >
                <TextIconButton size='small' onClick={handleExplanationClick}>
                  <HelpOutline />
                </TextIconButton>
              </Tooltip>
            )}

            <Tooltip
              title={
                language === 'de'
                  ? 'Zeilenumbruch (<5/>) - Enter drücken oder Button klicken'
                  : 'Line break (<5/>) - Press Enter or click button'
              }
            >
              <TextIconButton size='small' onClick={handleLineBreak}>
                <Typography variant='body2'>BR</Typography>
              </TextIconButton>
            </Tooltip>
          </Box>

          <Divider orientation='vertical' flexItem sx={{ mx: 1 }} />

          {/* View & Language Group */}
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            <Tooltip
              title={
                showPreview
                  ? language === 'de'
                    ? 'Editor anzeigen'
                    : 'Show Editor'
                  : language === 'de'
                  ? 'Vorschau anzeigen'
                  : 'Show Preview'
              }
            >
              <TextIconButton size='small' onClick={handlePreviewToggle}>
                {showPreview ? <VisibilityOff /> : <Visibility />}
              </TextIconButton>
            </Tooltip>

            <Tooltip
              title={
                language === 'de'
                  ? `Sprache ändern (aktuell: ${
                      language === 'de' ? 'Deutsch' : 'English'
                    })`
                  : `Change language (current: ${
                      language === 'en' ? 'English' : 'German'
                    })`
              }
            >
              <TextIconButton size='small' onClick={handleLanguageToggle}>
                <Typography variant='body2'>
                  {language.toUpperCase()}
                </Typography>
              </TextIconButton>
            </Tooltip>
          </Box>

          <Divider orientation='vertical' flexItem sx={{ mx: 1 }} />

          {/* Save & Reset Group */}
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            <Tooltip
              title={
                language === 'de' ? 'Änderungen speichern' : 'Save changes'
              }
            >
              <span>
                <TextIconButton
                  size='small'
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges}
                  color={hasUnsavedChanges ? 'primary' : 'default'}
                >
                  <Save />
                </TextIconButton>
              </span>
            </Tooltip>

            <Tooltip
              title={
                language === 'de' ? 'Änderungen zurücksetzen' : 'Reset changes'
              }
            >
              <span>
                <TextIconButton
                  size='small'
                  onClick={handleReset}
                  disabled={!hasUnsavedChanges}
                >
                  <Refresh />
                </TextIconButton>
              </span>
            </Tooltip>
          </Box>
        </Toolbar>

        <Divider />

        {showPreview ? (
          <Box
            sx={{
              p: 2,
              minHeight: `${minRows * 1.5}em`,
              maxHeight: `${maxRows * 1.5}em`,
              overflow: 'auto',
              bgcolor: 'grey.50',
              border: 'none',
            }}
          >
            <DemoRichTrans
              i18nKey='preview.content'
              ns='temp'
              previewContent={localValue}
            />
          </Box>
        ) : (
          <TextField {...textFieldProps} />
        )}
      </Paper>

      {hasUnsavedChanges && (
        <Typography
          variant='caption'
          sx={{
            mt: 0.5,
            color: 'warning.main',
            fontSize: '0.75rem',
          }}
        >
          {language === 'de'
            ? '* Ungespeicherte Änderungen'
            : '* Unsaved changes'}
        </Typography>
      )}

      <Dialog
        open={linkDialog.open}
        onClose={() => setLinkDialog({ open: false, selectedText: '' })}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          {language === 'de' ? 'Link hinzufügen' : 'Add Link'}
        </DialogTitle>
        <DialogContent>
          <Typography variant='body2' sx={{ mb: 2 }}>
            {language === 'de' ? 'Text: ' : 'Text: '}
            <strong>{linkDialog.selectedText}</strong>
          </Typography>
          <TextField
            autoFocus
            label='URL'
            fullWidth
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder='https://example.com'
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setLinkDialog({ open: false, selectedText: '' })}
          >
            {language === 'de' ? 'Abbrechen' : 'Cancel'}
          </Button>
          <Button
            onClick={handleLinkSave}
            variant='contained'
            disabled={!linkUrl.trim()}
          >
            {language === 'de' ? 'Link hinzufügen' : 'Add Link'}
          </Button>
        </DialogActions>
      </Dialog>

      <DemoExplanationDialog
        explanationDialog={explanationDialog}
        setExplanationDialog={setExplanationDialog}
        selectionStart={selectionStart}
        selectionEnd={selectionEnd}
        language={language}
        insertTextAtPosition={insertTextAtPosition}
      />
    </Box>
  );
}
