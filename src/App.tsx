/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, UserRole } from './types';
import { mockUsers } from './lib/mockData';
import Layout from './components/Layout';
import { AnimatePresence, motion } from 'motion/react';

// Components (to be created)
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectForm from './pages/ProjectForm';
import ProjectDetails from './pages/ProjectDetails';
import HRRequest from './pages/HRRequest';
import BolsaManagement from './pages/BolsaManagement';
import Login from './pages/Login';

function AnimatedRoutes({ user, handleLogin, handleLogout }: { user: User | null, handleLogin: (e: string) => void, handleLogout: () => void }) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      {user ? (
        <Layout user={user} onLogout={handleLogout}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location}>
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/projects" element={<ProjectList user={user} />} />
              <Route path="/projects/new" element={user.role === UserRole.GESTOR ? <ProjectForm /> : <Navigate to="/dashboard" />} />
              <Route path="/projects/:id" element={<ProjectDetails user={user} />} />
              <Route path="/projects/:id/hr/:type" element={<HRRequest user={user} />} />
              <Route path="/bolsas" element={user.role === UserRole.GESTOR ? <BolsaManagement /> : <Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </motion.div>
        </Layout>
      ) : (
        <Routes location={location}>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('prh_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (email: string) => {
    const found = mockUsers.find(u => u.email === email);
    if (found) {
      setUser(found);
      localStorage.setItem('prh_user', JSON.stringify(found));
    } else {
      alert('Usuário não encontrado!');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('prh_user');
  };

  return (
    <BrowserRouter>
      <AnimatedRoutes user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
    </BrowserRouter>
  );
}
