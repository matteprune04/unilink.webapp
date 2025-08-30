import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { GraduationCap, Mail, Lock, User, ArrowRight, BookOpen, TrendingUp, Globe, BookMarked as BookMark, Briefcase } from 'lucide-react';
const courses = {
  "Economia Aziendale": ["Management", "Marketing e Internazionalizzazione"],
  "Economia e Commercio": ["Economics", "Economics and Data", "Economia e Diritto", "Economia e mercati finanziari", "Economia, territorio e ambiente"]
};
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    course_of_study: '',
    specialization: ''
  });
  const {
    toast
  } = useToast();
  const {
    signIn,
    signUp
  } = useAuth();
  const specializations = useMemo(() => {
    return formData.course_of_study ? courses[formData.course_of_study] : [];
  }, [formData.course_of_study]);
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      const {
        error
      } = await signIn(formData.email, formData.password);
      if (error) {
        toast({
          variant: "destructive",
          title: "Accesso fallito",
          description: "Email o password non corretti. Riprova."
        });
      }
    } else {
      if (!formData.email.endsWith('@edu.unifi.it')) {
        toast({
          variant: "destructive",
          title: "Registrazione fallita",
          description: "È richiesta un'email istituzionale dell'Università di Firenze (@edu.unifi.it)."
        });
        setLoading(false);
        return;
      }
      const {
        error
      } = await signUp(formData.email, formData.password, {
        data: {
          full_name: formData.name,
          university: "Università di Firenze",
          course_of_study: formData.course_of_study,
          specialization: formData.specialization
        }
      });
      if (!error) {
        toast({
          title: "Registrazione completata!",
          description: `Benvenuto in UNILINK, ${formData.name}! Controlla la tua email per la conferma.`
        });
        setIsLogin(true);
      }
    }
    setLoading(false);
  };
  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSelectChange = (name, value) => {
    const newFormData = {
      ...formData,
      [name]: value
    };
    if (name === 'course_of_study') {
      newFormData.specialization = ''; // Reset specialization when course changes
    }
    setFormData(newFormData);
  };
  return <>
      <Helmet>
        <title>UNILINK - La Dashboard per Studenti di Economia a Firenze</title>
        <meta name="description" content="La piattaforma esclusiva per gli studenti di Economia dell'Università di Firenze. Centralizza studio, mobilità e carriera." />
        <meta property="og:title" content="UNILINK - Dashboard per Studenti di Economia (UNIFI)" />
        <meta property="og:description" content="Gestisci il tuo percorso accademico e professionale con UNILINK." />
      </Helmet>

      <div className="min-h-screen auth-page-bg flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8
        }} className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <motion.div initial={{
              scale: 0.8
            }} animate={{
              scale: 1
            }} transition={{
              duration: 0.5,
              delay: 0.2
            }} className="flex justify-center lg:justify-start">
                <img src="https://horizons-cdn.hostinger.com/37c9164a-e5b9-4564-813a-f94f052e949e/unilink-image-CI8tl.png" alt="UNILINK Logo" className="h-16" />
              </motion.div>
              
              <motion.p initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 0.4
            }} className="text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">La Risorsa #1 per gli studenti di Economia.</motion.p>
            </div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.6
          }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card/50 border border-border rounded-lg p-4 text-center backdrop-blur-sm">
                <BookOpen className="h-6 w-6 text-brand-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-foreground">Piano di Studi</span>
              </div>
              <div className="bg-card/50 border border-border rounded-lg p-4 text-center backdrop-blur-sm">
                <Globe className="h-6 w-6 text-brand-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-foreground">Mobilità & Erasmus</span>
              </div>
              <div className="bg-card/50 border border-border rounded-lg p-4 text-center backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-brand-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-foreground">Carriera & Master</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          x: 50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }}>
            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardHeader className="space-y-4">
                <div className="text-center">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {isLogin ? 'Accedi al tuo account' : 'Crea il tuo account UNIFI'}
                  </CardTitle>
                  <CardDescription>
                    {isLogin ? 'Bentornato! Accedi per continuare il tuo percorso' : 'Inizia il tuo viaggio verso il successo accademico'}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && <motion.div initial={{
                  opacity: 0,
                  height: 0
                }} animate={{
                  opacity: 1,
                  height: 'auto'
                }} exit={{
                  opacity: 0,
                  height: 0
                }} className="space-y-4 overflow-hidden">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          Nome completo
                        </Label>
                        <Input id="name" name="name" type="text" placeholder="Mario Rossi" value={formData.name} onChange={handleInputChange} className="bg-input border-border focus:bg-accent" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="university" className="flex items-center gap-2 text-muted-foreground">
                          <GraduationCap className="h-4 w-4" />
                          Università
                        </Label>
                        <Input id="university" name="university" type="text" value="Università di Firenze" className="bg-input border-border" disabled />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="course_of_study" className="flex items-center gap-2 text-muted-foreground">
                          <BookMark className="h-4 w-4" />
                          Corso di Laurea
                        </Label>
                        <Select onValueChange={value => handleSelectChange('course_of_study', value)} value={formData.course_of_study} required>
                          <SelectTrigger className="w-full bg-input border-border">
                            <SelectValue placeholder="Seleziona il tuo CdL" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(courses).map(course => <SelectItem key={course} value={course}>{course}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.course_of_study && <div className="space-y-2">
                          <Label htmlFor="specialization" className="flex items-center gap-2 text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                            Percorso
                          </Label>
                          <Select onValueChange={value => handleSelectChange('specialization', value)} value={formData.specialization} required>
                            <SelectTrigger className="w-full bg-input border-border">
                              <SelectValue placeholder="Seleziona il tuo percorso" />
                            </SelectTrigger>
                            <SelectContent>
                              {specializations.map(spec => <SelectItem key={spec} value={spec}>{spec}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>}
                    </motion.div>}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      Email istituzionale (@edu.unifi.it)
                    </Label>
                    <Input id="email" name="email" type="email" placeholder="mario.rossi@edu.unifi.it" value={formData.email} onChange={handleInputChange} className="bg-input border-border focus:bg-accent" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} className="bg-input border-border focus:bg-accent" required />
                  </div>

                  <Button type="submit" className="w-full hero-gradient text-primary-foreground glow-effect group" disabled={loading}>
                    {loading ? 'Caricamento...' : isLogin ? 'Accedi' : 'Registrati'}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground hover:text-brand-400 transition-colors">
                    {isLogin ? "Non hai un account? Registrati qui" : "Hai già un account? Accedi qui"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>;
};
export default AuthPage;