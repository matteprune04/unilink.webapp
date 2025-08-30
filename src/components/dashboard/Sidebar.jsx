import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, BookOpen, Briefcase, Globe, GraduationCap, X, Brain, CreditCard, LayoutDashboard, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

const navigationItems = [
  {
    category: null,
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { name: 'Profilo', icon: User, path: '/profile' },
      { name: 'Abbonamento', icon: CreditCard, path: '/subscription' },
      { name: 'Network', icon: Globe, path: '/network' },
    ],
  },
  {
    category: 'Strumenti',
    items: [
      { name: 'UNILINK AI', icon: Brain, path: '/unilink-ai' },
      { name: 'Risorse per Esami', icon: BookOpen, path: '/resources' },
      { name: 'Erasmus & Mobilità', icon: Briefcase, path: '/mobility' },
      { name: 'Magistrale & Master', icon: GraduationCap, path: '/masters' },
      { name: 'Carriera & Opportunità', icon: Briefcase, path: '/career' },
    ],
  },
];

const Logo = ({ isCollapsed }) => (
  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} mb-8 px-4 h-10`}>
    <img
      src={isCollapsed ? "https://horizons-cdn.hostinger.com/37c9164a-e5b9-4564-813a-f94f052e949e/d1969866aea7c4ce9350f9528fabac66.png" : "https://horizons-cdn.hostinger.com/37c9164a-e5b9-4564-813a-f94f052e949e/ecd37106ab47328bb1182a9d5bac9cb4.png"}
      alt="UNILINK Logo"
      className={isCollapsed ? 'h-8 w-8' : 'h-8 w-auto'}
    />
  </div>
);

const Sidebar = ({ user, activeSection, onLogout, isCollapsed, setIsCollapsed, isMobile, isMobileMenuOpen, setIsMobileMenuOpen, onNavigate }) => {
  const sidebarVariants = {
    collapsed: { width: '80px' },
    expanded: { width: isMobile ? '100%' : '260px' },
  };

  const menuVariants = {
    hidden: { x: '-100%' },
    visible: { x: '0%' },
  };

  const getActiveSection = (path) => {
    if (path === '/') return 'dashboard';
    const section = path.substring(1);
    if (section.startsWith('unilink-ai')) return 'unilink-ai';
    if (section.startsWith('masters')) return 'masters';
    if (section.startsWith('mobility')) return 'mobility';
    if (section.startsWith('career')) return 'career';
    return section;
  }

  const NavLink = ({ item, isMobileView }) => (
    <li>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeSection === getActiveSection(item.path) ? 'secondary' : 'ghost'}
              className={`w-full justify-start h-11 text-sm font-medium ${isCollapsed && !isMobileView ? 'px-3' : 'px-4'} transition-colors duration-200`}
              onClick={() => onNavigate(item.path)}
            >
              <item.icon className={`h-5 w-5 shrink-0 ${isCollapsed && !isMobileView ? 'mr-0' : 'mr-3'}`} />
              {(!isCollapsed || isMobileView) && <span className="truncate">{item.name}</span>}
            </Button>
          </TooltipTrigger>
          {isCollapsed && !isMobileView && <TooltipContent side="right">{item.name}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    </li>
  );

  const renderNavItems = (items, isMobileView = false) => (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <NavLink key={item.name} item={item} isMobileView={isMobileView} />
      ))}
    </ul>
  );

  const sidebarContent = (isMobileView = false) => (
    <>
      <div className="flex-1 overflow-y-auto px-3">
        <nav className="space-y-6">
          {navigationItems.map((group, index) => (
            <div key={index}>
              {group.category && (!isCollapsed || isMobileView) && (
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
                  {group.category}
                </h3>
              )}
              {renderNavItems(group.items, isMobileView)}
              {index === 0 && <Separator className="my-4 bg-border/50" />}
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-border/50">
        <Button variant="ghost" className="w-full justify-start font-medium" onClick={onLogout}>
          <Settings className={`h-5 w-5 ${isCollapsed && !isMobileView ? '' : 'mr-3'}`} />
           {(!isCollapsed || isMobileView) && <span>Logout</span>}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {isMobile && isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-background z-50 flex flex-col p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={menuVariants}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex justify-between items-center mb-8">
            <Logo isCollapsed={false} />
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          {sidebarContent(true)}
        </motion.div>
      )}

      {!isMobile && (
        <motion.aside
          className="h-screen bg-card flex flex-col pt-6 shadow-2xl"
          initial={isCollapsed ? 'collapsed' : 'expanded'}
          animate={isCollapsed ? 'collapsed' : 'expanded'}
          variants={sidebarVariants}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Logo isCollapsed={isCollapsed} />
          {sidebarContent(false)}

          <div className="mb-4 px-4">
            <Button
              variant="outline"
              size="icon"
              className="w-full h-10 border-border/50"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
            </Button>
          </div>
        </motion.aside>
      )}
    </>
  );
};

export default Sidebar;