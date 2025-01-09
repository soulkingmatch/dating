import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { NavigationBar } from '../navigation/NavigationBar';
import { AppHeader } from './AppHeader';
import { PageBackground } from '../common/PageBackground';

export function AppLayout() {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <PageBackground>
      <AppHeader />
      <main className="pt-16 pb-16">
        <Outlet />
      </main>
      <NavigationBar />
    </PageBackground>
  );
}