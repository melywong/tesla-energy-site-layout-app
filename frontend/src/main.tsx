import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import App from './App';

const theme = createTheme({
  primaryColor: 'dark',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  colors: {
    tesla: [
      '#fff0f0',
      '#ffdede',
      '#ffb8b8',
      '#ff8e8e',
      '#ff6b6b',
      '#cc0000',
      '#b30000',
      '#990000',
      '#800000',
      '#660000',
    ],
  },
  headings: {
    fontWeight: '600',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <App />
    </MantineProvider>
  </StrictMode>,
);
