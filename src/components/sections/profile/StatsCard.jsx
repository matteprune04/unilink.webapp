import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart2, Star, Target, Calendar } from 'lucide-react';
import { calculateCurrentCourseYear } from '@/lib/dashboardUtils.js';
import { Separator } from '@/components/ui/separator';

const StatItem = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center text-center p-4 gap-2">
    <Icon className="h-10 w-10 text-primary mb-2" />
    <p className="font-inter text-4xl font-bold text-foreground tracking-tight">{value || 'N/A'}</p>
    <p className="font-inter text-sm text-muted-foreground uppercase tracking-wider">{label}</p>
  </div>
);

const StatsCard = ({ initialUser, academicStats }) => {
  const currentCourseYear = calculateCurrentCourseYear(initialUser?.enrollment_year);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="font-plus-jakarta-sans flex items-center gap-2 text-xl">
          <BarChart2 className="text-primary h-6 w-6"/>Statistiche
        </CardTitle>
        <CardDescription className="font-inter">Il tuo andamento accademico riassunto.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 w-full items-center">
          <StatItem label="Media Generale" value={academicStats?.averageGrade} icon={Star} />
          <Separator orientation="vertical" className="h-24 hidden sm:block mx-auto" />
          <StatItem label="CFU Totali" value={academicStats?.totalCfu} icon={Target} />
          <Separator orientation="vertical" className="h-24 hidden sm:block mx-auto" />
          <StatItem label="Anno di Corso" value={currentCourseYear} icon={Calendar} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;