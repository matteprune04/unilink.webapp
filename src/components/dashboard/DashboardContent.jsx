
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, GraduationCap, Loader2 } from 'lucide-react';
import DashboardTab from '@/components/dashboard/DashboardTab';
import StudyPlanTab from '@/components/dashboard/StudyPlanTab';
import { calculateStats } from '@/lib/dashboardUtils';

const DashboardContent = ({ user, setActiveSection }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let isCancelled = false;
    const fetchAndSyncExams = async () => {
      if (!user?.id || !user.course_of_study || !user.specialization) {
        setLoading(false);
        return;
      }
      setLoading(true);

      const { data: allCourses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('course_of_study', user.course_of_study)
        .eq('specialization', user.specialization);

      if (coursesError) {
        if (!isCancelled) {
          toast({ title: "Errore", description: "Impossibile caricare i corsi base.", variant: "destructive" });
          setLoading(false);
        }
        return;
      }
      
      const { data: userExamsData, error: userExamsError } = await supabase
        .from('user_exams').select(`*, courses(*)`).eq('user_id', user.id);

      if (userExamsError) {
        if (!isCancelled) {
          toast({ title: "Errore", description: "Impossibile caricare il piano di studi.", variant: "destructive" });
          setLoading(false);
        }
        return;
      }
      
      const userExamCodes = new Set(userExamsData.map(e => e.course_code));
      const missingCourses = allCourses.filter(c => !userExamCodes.has(c.code));

      if (missingCourses.length > 0) {
        const newExamsToInsert = missingCourses.map(c => ({ user_id: user.id, course_code: c.code, is_elective: false }));
        const { error: insertError } = await supabase
            .from('user_exams')
            .insert(newExamsToInsert, { onConflict: 'user_id, course_code' });

        if (insertError) {
          console.error("Error syncing exams:", insertError);
          if (!isCancelled) toast({ title: "Errore di Sincronizzazione", description: "Alcuni corsi non sono stati aggiunti.", variant: "destructive" });
        }
        
        const { data: finalExamsData, error: finalExamsError } = await supabase
            .from('user_exams').select(`*, courses(*)`).eq('user_id', user.id);
        
        if (!isCancelled) {
            if(finalExamsError) {
                 toast({ title: "Errore", description: "Impossibile aggiornare il piano di studi.", variant: "destructive" });
            } else {
                 setExams(finalExamsData.sort((a,b) => a.courses.code.localeCompare(b.courses.code)));
            }
        }
      } else {
        if (!isCancelled) {
          setExams(userExamsData.sort((a,b) => (a.courses?.code || '').localeCompare(b.courses?.code || '')));
        }
      }

      if (!isCancelled) {
        setLoading(false);
      }
    };

    fetchAndSyncExams();
    
    return () => {
      isCancelled = true;
    };
  }, [user, toast]);

  const stats = useMemo(() => calculateStats(exams), [exams]);

  const handleGradeChange = (examId, grade) => {
    setExams(prevExams => prevExams.map(ex => ex.id === examId ? { ...ex, grade: grade === '' ? null : parseInt(grade, 10) } : ex));
  };
  
  const handleSaveChanges = async () => {
    setSaving(true);
    const updates = exams
      .filter(exam => exam.grade !== undefined)
      .map(({ id, grade, course_code }) => ({
        id,
        user_id: user.id,
        course_code,
        grade: grade,
        updated_at: new Date(),
      }));

    if (updates.length > 0) {
        const { error } = await supabase.from('user_exams').upsert(updates, { onConflict: 'id' });
        if (error) {
          toast({ title: "Errore", description: `Impossibile salvare le modifiche: ${error.message}`, variant: "destructive" });
        } else {
          toast({ title: "Successo!", description: "Piano di studi aggiornato." });
        }
    } else {
        toast({ title: "Nessuna modifica", description: "Non ci sono voti da salvare." });
    }
    
    setSaving(false);
  };
  
  const handleAddElectiveExam = async (newExamData) => {
      const { data: course, error: courseError } = await supabase
          .from('courses')
          .upsert({ ...newExamData, year: 3, course_of_study: user.course_of_study, specialization: user.specialization }, { onConflict: 'code' })
          .select().single();
      
      if (courseError) {
          toast({ title: "Errore", description: `Impossibile creare il corso: ${courseError.message}`, variant: "destructive" });
          return;
      }

      const { data: userExam, error: userExamError } = await supabase
          .from('user_exams')
          .insert({ user_id: user.id, course_code: course.code, is_elective: true })
          .select('*, courses(*)').single();

      if (userExamError) {
          toast({ title: "Errore", description: userExamError.code === '23505' ? 'Esame già presente nel tuo piano.' : `Impossibile aggiungere l'esame: ${userExamError.message}`, variant: "destructive" });
      } else {
          setExams(prev => [...prev, userExam]);
          toast({ title: "Successo", description: "Esame a scelta aggiunto." });
      }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full p-8"><Loader2 className="h-10 w-10 animate-spin text-brand-500" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-plus-jakarta-sans font-bold text-foreground">
        Ciao, <span className="text-gradient">{user?.name?.split(' ')[0] || 'Studente'}</span>!
      </h1>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-accent p-1 rounded-lg">
          <TabsTrigger value="dashboard"><BarChart className="mr-2 h-4 w-4"/>Dashboard</TabsTrigger>
          <TabsTrigger value="study-plan"><GraduationCap className="mr-2 h-4 w-4"/>Piano di Studi</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <DashboardTab
            user={user}
            stats={stats}
            setActiveSection={setActiveSection}
          />
        </TabsContent>
        <TabsContent value="study-plan" className="space-y-6 mt-6">
          <StudyPlanTab
            exams={exams}
            user={user}
            onGradeChange={handleGradeChange}
            onAddElectiveExam={handleAddElectiveExam}
            onSaveChanges={handleSaveChanges}
            saving={saving}
            stats={stats}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default DashboardContent;