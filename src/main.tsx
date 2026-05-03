import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import LoginPage from './components/LoginPage.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { auth } from './services/paperless.ts';
import './index.css';

function Root() {
  const [token, setToken] = useState<string | null>(() => auth.getToken());

  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <Root />
    </LanguageProvider>
  </StrictMode>,
);
