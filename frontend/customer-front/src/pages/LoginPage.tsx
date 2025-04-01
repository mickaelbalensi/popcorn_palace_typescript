// src/pages/LoginPage.tsx
import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <LoginForm />
    </div>
  );
};

export default LoginPage;