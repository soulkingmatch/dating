import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AuthForm } from './components/auth/AuthForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProfilePage } from './components/profile/ProfilePage';
import { UserProfilePage } from './components/profile/UserProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { MessagesPage } from './components/messages/MessagesPage';
import { SearchPage } from './components/search/SearchPage';
import { ExplorePage } from './components/explore/ExplorePage';
import { SubscriptionPage } from './components/subscription/SubscriptionPage';
import { useAuthStore } from './store/authStore';

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
        </Route>
      </Routes>
    </Router>
  );
}