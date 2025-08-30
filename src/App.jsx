
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Routes, Route, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import AuthPage from '@/components/auth/AuthPage';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { TooltipProvider } from '@/components/ui/tooltip';

import Profile from '@/components/sections/Profile';
import Subscription from '@/components/sections/Subscription';
import Network from '@/components/sections/Network';
import Resources from '@/components/sections/Resources';
import Mobility from '@/components/sections/Mobility';
import Masters from '@/components/sections/Masters';
import Career from '@/components/sections/Career';
import UnilinkAI from '@/components/sections/UnilinkAI';
import GenericPage from '@/components/sections/GenericPage';

function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

const ProtectedRoute = ({ user, requiredPlan, children }) => {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const userPlan = user.subscription_level || 'Gratis';
  const isFounder = user.role === 'founder';

  const planHierarchy = {
    'Gratis': 0,
    'ACCESS': 1,
    'TALENT': 2
  };

  const userLevel = planHierarchy[userPlan] ?? 0;
  const requiredLevel = planHierarchy[requiredPlan] ?? 1;

  if (!isFounder && userLevel < requiredLevel) {
    return <Navigate to="/subscription" replace />;
  }

  return children || <Outlet />;
};

function App() {
  const { user: authUser, signOut, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const [width] = useWindowSize();
  const isMobile = width < 768;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsSidebarCollapsed(width < 1024);
  }, [width]);

  const fetchProfile = useCallback(async (user) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, profile_targets(*)')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Errore di caricamento",
        description: "Impossibile caricare il profilo utente.",
      });
      return;
    } 
    
    if (data) {
      const userProfile = {
        ...data,
        email: user.email,
        name: data.full_name || user.user_metadata?.full_name || user.email.split('@')[0],
        avatar_url: data.avatar_url || user.user_metadata?.avatar_url,
        university: data.university || user.user_metadata?.university || "Università di Firenze",
        faculty: "Economia e Management",
        matricola: "N/A",
        course_of_study: data.course_of_study || "Non specificato",
        specialization: data.specialization || "Non specificato",
        targets: data.profile_targets || {},
        subscription_level: data.subscription_level || 'Gratis',
      };
      
      if (user.email === 'matteo.prunecchi@edu.unifi.it') {
        userProfile.role = 'founder';
        if (data.role !== 'founder') {
          const { error: updateError } = await supabase.from('profiles').update({ role: 'founder' }).eq('id', user.id);
          if (updateError) console.error('Error updating role:', updateError);
        }
      }
      
      setProfile(userProfile);
    } else {
        setTimeout(() => fetchProfile(user), 1500);
    }
  }, [toast]);

  useEffect(() => {
    if (authUser) {
      fetchProfile(authUser);
    } else {
      setProfile(null);
    }
  }, [authUser, fetchProfile]);

  const handleProfileUpdate = useCallback((updatedProfile) => {
    setProfile(prevProfile => ({ ...prevProfile, ...updatedProfile }));
  }, []);


  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveSection('dashboard');
    else if (path.startsWith('/unilink-ai')) setActiveSection('unilink-ai');
    else if (path.startsWith('/masters')) setActiveSection('masters');
    else if (path.startsWith('/mobility')) setActiveSection('mobility');
    else if (path.startsWith('/career')) setActiveSection('career');
    else setActiveSection(path.substring(1));
  }, [location.pathname]);
  
  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }

  const handleLogout = async () => {
    await signOut();
    setProfile(null);
    navigate('/');
    toast({
      title: "Logout effettuato",
      description: "Alla prossima! 👋"
    });
  };

  const renderContent = () => (
    <Routes>
      <Route path="/" element={<DashboardContent user={profile} setActiveSection={(section) => handleNavigate(`/${section}`)} />} />
      <Route path="/profile" element={<Profile user={profile} onProfileUpdate={handleProfileUpdate} />} />
      <Route path="/subscription" element={<Subscription user={profile} />} />
      <Route path="/network" element={<Network />} />
      
      <Route path="/store" element={<GenericPage title="Store" description="L'Online Store non è più disponibile." />} />
      <Route path="/product/:id" element={<GenericPage title="Prodotto non trovato" description="Questo prodotto non è più disponibile." />} />
      <Route path="/success" element={<GenericPage title="Grazie!" description="Il tuo acquisto è stato completato con successo." />} />
      
      <Route element={<ProtectedRoute user={profile} requiredPlan="ACCESS" />}>
        <Route path="/resources" element={<Resources />} />
        <Route path="/mobility" element={<Mobility />} />
      </Route>

      <Route element={<ProtectedRoute user={profile} requiredPlan="TALENT" />}>
        <Route path="/unilink-ai" element={<UnilinkAI />} />
        <Route path="/masters" element={<Masters />} />
        <Route path="/career" element={<Career />} />
      </Route>
    </Routes>
  );

  if (authLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Caricamento in corso...</div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <>
        <AuthPage />
        <Toaster />
      </>
    );
  }
  
  if (!profile) {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-background">
            <div className="text-foreground">Caricamento del profilo...</div>
        </div>
    );
  }

  return (
    <TooltipProvider>
      <Helmet>
        <title>UNILINK Dashboard - Gestisci il tuo Percorso Accademico</title>
        <meta name="description" content="Dashboard completa per studenti di Economia. Gestisci studio, mobilità e carriera in un unico posto." />
        <meta property="og:title" content="UNILINK Dashboard - Il tuo Hub Accademico" />
        <meta property="og:description" content="Centralizza il tuo percorso universitario con UNILINK" />
      </Helmet>

      <div className="flex h-screen bg-background text-foreground main-bg-gradient">
        <Sidebar 
          user={profile}
          activeSection={activeSection} 
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          isMobile={isMobile}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onNavigate={handleNavigate}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            user={profile} 
            onNavigate={(section) => handleNavigate(`/${section}`)} 
            onMenuClick={() => setIsMobileMenuOpen(true)}
            isMobile={isMobile}
            onCartClick={() => {
              toast({
                title: "Funzionalità non disponibile",
                description: "L'Online Store è stato disconnesso.",
              });
            }}
            cartItemCount={0}
          />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
      
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
