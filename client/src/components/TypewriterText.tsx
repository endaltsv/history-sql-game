import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string | React.ReactNode;
  speed?: number;
  delay?: number;
  skip?: boolean;
}

export function TypewriterText({ text, speed = 30, delay = 0, skip = false }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState<React.ReactNode>('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (skip) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    let timeout: NodeJS.Timeout;
    let currentIndex = 0;
    let currentText: React.ReactNode = '';

    const typeNextChar = () => {
      if (typeof text === 'string') {
        if (currentIndex < text.length) {
          currentText = text.substring(0, currentIndex + 1);
          setDisplayedText(currentText);
          currentIndex++;
          timeout = setTimeout(typeNextChar, speed);
        } else {
          setIsTyping(false);
        }
      } else if (Array.isArray(text)) {
        // Если text это массив React элементов, показываем их все сразу
        setDisplayedText(text);
        setIsTyping(false);
      } else {
        // Если text это одиночный React элемент
        setDisplayedText(text);
        setIsTyping(false);
      }
    };

    timeout = setTimeout(() => {
      typeNextChar();
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay, skip]);

  return (
    <span className="font-detective">
      {displayedText}
      {!skip && isTyping && <span className="animate-pulse">|</span>}
    </span>
  );
} 