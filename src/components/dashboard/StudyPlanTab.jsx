
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle, TrendingUp, Award, PlusCircle, Star, GraduationCap, Percent, Target } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { calculateStats, calculateGraduationScore, TOTAL_POSSIBLE_CFU } from '@/lib/dashboardUtils.js';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const StatBox = ({ label, value, valueClassName, icon: Icon }) => (
  <div className="flex-1 bg-muted/50 p-4 rounded-lg flex flex-col items-center justify-center min-h-[100px]">
    {Icon && <Icon className="h-6 w-6 text-primary mb-2" />}
    <p className={`font-inter text-3xl font-bold text-foreground tracking-tight ${valueClassName}`}>{value || 'N/A'}</p>
    <p className="font-inter text-sm text-muted-foreground uppercase tracking-wider">{label}</p>
  </div>
);

const PerformanceCard = ({ stats, bonusPoints, setBonusPoints }) => {
  const graduationScore = calculateGraduationScore(stats.averageGrade, bonusPoints);

  const handleBonusChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 10)) {
        setBonusPoints(value === '' ? '' : Number(value));
    }
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-plus-jakarta-sans flex items-center gap-2 text-xl">
            <TrendingUp className="text-primary h-6 w-6" />
            Performance Accademica
            </CardTitle>
            <CardDescription className="font-inter">La tua media e la proiezione del voto di laurea.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow items-center justify-center gap-6">
            <div className="flex w-full gap-4">
            <StatBox label="Media Voti" value={stats.averageGrade} icon={Star} />
            <StatBox 
                label="Voto Laurea Stimato" 
                value={graduationScore.displayScore} 
                icon={GraduationCap}
                valueClassName={graduationScore.isLaude ? 'text-amber-400' : ''}
            />
            </div>
            <div className="flex items-center gap-3 w-full max-w-xs">
            <Label htmlFor="bonus-points" className="font-inter text-muted-foreground whitespace-nowrap flex-shrink-0">
                Punti Bonus:
            </Label>
            <Input
                id="bonus-points"
                type="number"
                min="0"
                max="10"
                value={bonusPoints}
                onChange={handleBonusChange}
                className="text-center font-inter w-full"
                placeholder="0"
            />
            </div>
        </CardContent>
    </Card>
  );
};

const CfuProgressCard = ({ totalCfu }) => {
    const cfuProgress = (totalCfu / TOTAL_POSSIBLE_CFU) * 100;
    const remainingCfu = TOTAL_POSSIBLE_CFU - totalCfu;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-plus-jakarta-sans flex items-center gap-2 text-xl">
                  <Award className="text-primary h-6 w-6" />
                  Progresso CFU
                </CardTitle>
                <CardDescription className="font-inter">I tuoi crediti formativi universitari accumulati.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow items-center justify-center gap-6">
                 <div className="flex w-full gap-4">
                    <StatBox label="CFU Totali" value={totalCfu} icon={Target} />
                    <StatBox label="Completamento" value={`${cfuProgress.toFixed(1)}%`} icon={Percent} />
                </div>
                <div className="w-full max-w-xs px-4 space-y-2 text-center">
                    <Progress value={cfuProgress} className="w-full h-3" />
                    <p className="font-inter text-sm text-muted-foreground">
                        {totalCfu}/{TOTAL_POSSIBLE_CFU} CFU completati
                    </p>
                    <div className="bg-muted text-muted-foreground font-inter text-sm px-3 py-1 rounded-full inline-block">
                        {remainingCfu} CFU rimanenti
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


const StudyPlanTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);
  const [userExams, setUserExams] = useState([]);
  const [stats, setStats] = useState({ totalCfu: 0, averageGrade: '0.00' });
  const [bonusPoints, setBonusPoints] = useState(0);

  const fetchCoursesAndExams = useCallback(async () => {
    if (!user) return;

    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .order('year', { ascending: true })
      .order('name', { ascending: true });

    if (coursesError) {
      toast({ variant: 'destructive', title: 'Errore', description: 'Impossibile caricare i corsi.' });
      return;
    }

    const { data: examsData, error: examsError } = await supabase
      .from('user_exams')
      .select('*, courses(*)')
      .eq('user_id', user.id);

    if (examsError) {
      toast({ variant: 'destructive', title: 'Errore', description: 'Impossibile caricare gli esami.' });
      return;
    }

    setCourses(coursesData);
    setUserExams(examsData);
  }, [user, toast]);

  useEffect(() => {
    fetchCoursesAndExams();
  }, [fetchCoursesAndExams]);

  useEffect(() => {
    const newStats = calculateStats(userExams);
    setStats(newStats);
  }, [userExams]);

  const handleGradeChange = async (courseCode, newGrade) => {
    const grade = newGrade === '' ? null : parseInt(newGrade, 10);
    if (grade !== null && (grade < 18 || grade > 30)) {
      toast({ variant: 'destructive', title: 'Voto non valido', description: 'Il voto deve essere tra 18 e 30.' });
      return;
    }

    const existingExam = userExams.find(e => e.course_code === courseCode);

    if (existingExam) {
      const { data, error } = await supabase
        .from('user_exams')
        .update({ grade: grade, updated_at: new Date() })
        .eq('id', existingExam.id)
        .select('*, courses(*)')
        .single();
      if (error) {
        toast({ variant: 'destructive', title: 'Errore', description: 'Impossibile aggiornare il voto.' });
      } else {
        setUserExams(prev => prev.map(e => e.id === data.id ? data : e));
        toast({ title: 'Successo', description: 'Voto aggiornato.' });
      }
    } else {
      const { data, error } = await supabase
        .from('user_exams')
        .insert({ user_id: user.id, course_code: courseCode, grade: grade })
        .select('*, courses(*)')
        .single();
      if (error) {
        toast({ variant: 'destructive', title: 'Errore', description: 'Impossibile salvare il voto.' });
      } else {
        setUserExams(prev => [...prev, data]);
        toast({ title: 'Successo', description: 'Voto salvato.' });
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceCard stats={stats} bonusPoints={bonusPoints} setBonusPoints={setBonusPoints} />
        <CfuProgressCard totalCfu={stats.totalCfu} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-plus-jakarta-sans flex items-center gap-2 text-xl">
            <BookOpen className="text-primary h-6 w-6" />
            Libretto Universitario
          </CardTitle>
          <CardDescription className="font-inter">Inserisci i voti degli esami che hai superato.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-inter">Corso</TableHead>
                <TableHead className="font-inter text-center">CFU</TableHead>
                <TableHead className="font-inter text-center">Anno</TableHead>
                <TableHead className="font-inter text-right w-[120px]">Voto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map(course => {
                const exam = userExams.find(e => e.course_code === course.code);
                const isCompleted = exam && exam.grade >= 18;
                return (
                  <TableRow key={course.id} className={isCompleted ? 'bg-green-500/5' : ''}>
                    <TableCell className="font-medium font-inter flex items-center gap-2">
                      {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {course.name}
                    </TableCell>
                    <TableCell className="text-center font-inter">{course.cfu}</TableCell>
                    <TableCell className="text-center font-inter">{course.year}</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min="18"
                        max="30"
                        defaultValue={exam?.grade || ''}
                        onBlur={(e) => handleGradeChange(course.code, e.target.value)}
                        className="text-center font-inter w-full"
                        placeholder="--"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudyPlanTab;
