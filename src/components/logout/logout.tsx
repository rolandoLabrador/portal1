// src/app/components/logout/logout.tsx
"use client";
import { signOut } from 'next-auth/react';

const LogoutButton = () => {
  const handleLogout = () => {
    signOut({ callbackUrl: '/Login' });
  };

  return (
    <a onClick={handleLogout}>Log-out</a>
  );
};

export default LogoutButton;