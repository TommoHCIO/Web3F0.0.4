import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { WalletProvider } from './context/WalletContext';
import { Web3Provider } from './context/Web3Context';
import './index.css';

// Ensure global Buffer is available
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <Web3Provider>
        <WalletProvider>
          <App />
        </WalletProvider>
      </Web3Provider>
    </ThemeProvider>
  </StrictMode>
);