// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes';
import './index.css'; // Import the Tailwind CSS file
import ThemeCustomization from './themes';
import ScrollTop from './components/ScrollTop';
import { AuthProvider } from './contexts/auth-reducer/AuthContext'; // Ensure this import is correct
import { TestProvider } from './contexts/test-reducer/TestContext'; // Import the TestProvider

const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      <AuthProvider>
        <TestProvider>
          <BrowserRouter basename="/free">
            <Router />
          </BrowserRouter>
        </TestProvider>
      </AuthProvider>
    </ScrollTop>
  </ThemeCustomization>
);

export default App;
