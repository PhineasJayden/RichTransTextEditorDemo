'use client';

import React from 'react';
import DemoExplainTooltip from './DemoExplainTooltip';

interface DemoRichTransProps {
  i18nKey: string;
  ns?: string;
  components?: Record<string, React.ReactElement>;
  previewContent?: string;
}

export default function DemoRichTrans({
  previewContent,
  components = {},
}: DemoRichTransProps) {
  const defaultComponents = {
    1: <DemoExplainTooltip />,
    2: <strong />,
    3: <em />,
    4: <a />,
    5: <br />,
    ...components,
  };

  if (previewContent) {
    return (
      <DemoTrans content={previewContent} components={defaultComponents} />
    );
  }

  return <span>Preview content not available</span>;
}

function DemoTrans({
  content,
  components,
}: {
  content: string;
  components: Record<string, React.ReactElement>;
}) {
  const parseContent = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;

    const tagRegex = /<(\d+)([^>]*)>(.*?)<\/\1>|<(\d+)([^>]*)\s*\/>/g;
    let match;

    while ((match = tagRegex.exec(text)) !== null) {
      if (match.index > currentIndex) {
        parts.push(text.slice(currentIndex, match.index));
      }

      const tagNumber = match[1] || match[4];
      const attributes = match[2] || match[5] || '';
      const content = match[3] || '';

      if (components[tagNumber]) {
        const Component = components[tagNumber];

        const props: Record<string, string> = {};
        if (attributes) {
          const attrRegex = /(\w+)="([^"]*)"/g;
          let attrMatch;
          while ((attrMatch = attrRegex.exec(attributes)) !== null) {
            props[attrMatch[1]] = attrMatch[2];
          }
        }

        parts.push(
          React.cloneElement(
            Component,
            {
              key: match.index,
              ...props,
            },
            content || undefined
          )
        );
      } else {
        parts.push(content || `<${tagNumber}/>`);
      }

      currentIndex = tagRegex.lastIndex;
    }

    if (currentIndex < text.length) {
      parts.push(text.slice(currentIndex));
    }

    return parts;
  };

  const parsedContent = parseContent(content);

  return <>{parsedContent}</>;
}
