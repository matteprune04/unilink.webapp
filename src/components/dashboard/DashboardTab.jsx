
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Target, 
  GraduationCap,
  Briefcase,
  BookOpen,
  Globe,
  Sparkles,
  Lock
} from 'lucide-react';
import { TOTAL_POSSIBLE_CFU } from '@/lib/dashboardUtils';

const StatCard = ({ title, value, description, icon: Icon, color }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color || 'text-brand-400'}`} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-foreground font-plus-jakarta-sans">{value}</div>
      <p className="font-inter text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const LockedStatCard = ({ title, cta, icon: Icon, onClick }) => (
    <Card className="relative overflow-hidden flex flex-col justify-center items-center text-center p-4 cursor-pointer group hover:border-brand-500/50 transition-all duration-300" onClick={onClick}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 group-hover:from-brand-700/30 transition-all duration-300"></div>
        <Lock className="h-8 w-8 text-amber-400 mb-2 z-20" />
        <h3 className="font-plus-jakarta-sans font-semibold text-foreground z-20">{title}</h3>
        <p className="font-inter text-sm text-muted-foreground z-20">{cta}</p>
    </Card>
);

const QuickActionCard = ({ title, description, icon: Icon, color, bgColor, onClick }) => (
  <motion.div 
    whileHover={{ scale: 1.03, zIndex: 10 }} 
    whileTap={{ scale: 0.98 }}
    className="w-full"
  >
    <Card className="p-0 overflow-hidden group cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div>
            <p className="font-plus-jakarta-sans font-semibold text-foreground">{title}</p>
            <p className="font-inter text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const DashboardTab = ({ user, stats, setActiveSection }) => {
  const isPremium = useMemo(() => user?.subscription_level === 'premium' || user?.role === 'founder', [user]);
  
  const quickActions = [
    { title: 'Scopri il MSc migliore per te', description: 'Analizza i programmi e trova la tua strada', icon: Sparkles, color: 'text-green-400', bgColor: 'bg-green-500/10', section: 'masters' },
    { title: 'Trova Erasmus', description: 'Confronta università e programmi di mobilità', icon: Globe, color: 'text-blue-400', bgColor: 'bg-blue-500/10', section: 'mobility' },
    { title: 'Cerca Opportunità', description: 'Esplora stage, lavori e programmi master', icon: Briefcase, color: 'text-purple-400', bgColor: 'bg-purple-500/10', section: 'career' },
    { title: 'Esplora le risorse per lo studio', description: 'Appunti, flashcard e simulazioni per i tuoi esami', icon: BookOpen, color: 'text-orange-400', bgColor: 'bg-orange-500/10', section: 'resources' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={itemVariants}>
          <StatCard title="Media Attuale" value={stats.averageGrade} description={`Su ${stats.totalCfu} CFU`} icon={TrendingUp} color="text-green-400" />
          <StatCard title="CFU Ottenuti" value={`${stats.totalCfu}/${TOTAL_POSSIBLE_CFU}`} description={`${Math.round((stats.totalCfu/TOTAL_POSSIBLE_CFU)*100)}% completati`} icon={Target} color="text-blue-400" />
          
          {isPremium ? (
              <>
                  <StatCard title="MSc Target" value={user.targets?.target_msc || 'N/D'} description="Il tuo obiettivo di specializzazione" icon={GraduationCap} color="text-purple-400" />
                  <StatCard title="Carriera Target" value={user.targets?.target_career || 'N/D'} description="Il tuo settore di carriera ideale" icon={Briefcase} color="text-orange-400" />
              </>
          ) : (
              <>
                  <LockedStatCard title="MSc Target" cta="Passa a Premium" icon={GraduationCap} onClick={() => setActiveSection('subscription')} />
                  <LockedStatCard title="Carriera Target" cta="Passa a Premium" icon={Briefcase} onClick={() => setActiveSection('subscription')} />
              </>
          )}
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="font-plus-jakarta-sans text-xl font-bold">Azioni Rapide</CardTitle>
            <CardDescription className="font-inter text-sm text-muted-foreground">Accedi rapidamente alle funzionalità più utilizzate</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} onClick={() => setActiveSection(action.section)} />
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardTab;