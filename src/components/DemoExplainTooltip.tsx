import { ClickAwayListener, Tooltip, Zoom } from '@mui/material';
import { useState } from 'react';
import { useDemoI18n } from '../hooks/useDemoI18n';

type Props = {
  i18n?: string;
  children?: string;
};

export default function DemoExplainTooltip({
  i18n,
  children,
}: Readonly<Props>) {
  const { t } = useDemoI18n();
  const [open, setOpen] = useState(false);

  const explanationText = i18n
    ? t(i18n, 'explain')
    : 'Keine Erklärung verfügbar';

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Tooltip
        title={explanationText}
        arrow
        open={open}
        placement='top'
        color='primary'
        slotProps={{
          tooltip: {
            sx: {
              bgcolor: '#7a5365',
              color: 'white',
              fontSize: '14px',
              lineHeight: '1.6',
              '& .MuiTooltip-arrow': {
                color: '#7a5365',
              },
            },
          },
        }}
        slots={{ transition: Zoom }}
      >
        <span
          onClick={() => setOpen(!open)}
          style={{
            color: 'inherit',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          {children}
        </span>
      </Tooltip>
    </ClickAwayListener>
  );
}
