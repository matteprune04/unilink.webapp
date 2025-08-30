
import React from 'react';

export const TOTAL_POSSIBLE_CFU = 180;

export const calculateStats = (exams) => {
  if (!exams) return { totalCfu: 0, averageGrade: '0.00' };
  const completedExams = exams.filter(e => e.grade && e.grade >= 18 && e.courses);
  if (completedExams.length === 0) return { totalCfu: 0, averageGrade: '0.00' };
  
  const totalCfu = completedExams.reduce((acc, exam) => acc + (exam.courses?.cfu || 0), 0);
  const weightedSum = completedExams.reduce((acc, exam) => acc + (exam.grade * (exam.courses?.cfu || 0)), 0);
  const averageGrade = totalCfu > 0 ? (weightedSum / totalCfu).toFixed(2) : '0.00';
  return { totalCfu, averageGrade };
};

export const calculateGraduationScore = (averageGrade, bonusPoints = 0) => {
  if (!averageGrade || parseFloat(averageGrade) === 0) {
    return { finalScore: 0, displayScore: 'N/D', isLaude: false };
  }

  const avg = parseFloat(averageGrade);
  const baseScore = (avg * 11) / 3;
  const totalScore = baseScore + bonusPoints;
  
  const finalScore = Math.round(totalScore);

  const isLaude = avg >= 28.5 && finalScore >= 110;

  return {
    finalScore: isLaude ? 110 : Math.min(finalScore, 110),
    displayScore: isLaude ? '110 e Lode' : String(Math.min(finalScore, 110)),
    isLaude: isLaude,
  };
};

export const getProbability = (currentAvg, currentCfu, targetAvg) => {
  if (!targetAvg || currentCfu >= TOTAL_POSSIBLE_CFU) return { label: 'N/A', color: 'text-muted-foreground' };
  
  const remainingCfu = TOTAL_POSSIBLE_CFU - currentCfu;
  if(remainingCfu <= 0) return { label: 'Completato', color: 'text-primary' };
  
  const requiredAvgForRemaining = ((targetAvg * TOTAL_POSSIBLE_CFU) - (currentAvg * currentCfu)) / remainingCfu;

  if (requiredAvgForRemaining > 30) return { label: 'Impossibile', color: 'text-red-500' };
  if (requiredAvgForRemaining > 27) return { label: 'Difficile', color: 'text-orange-500' };
  if (requiredAvgForRemaining > 24) return { label: 'Probabile', color: 'text-yellow-500' };
  if (requiredAvgForRemaining >= 18) return { label: 'Molto Probabile', color: 'text-green-500' };
  return { label: 'Obiettivo Raggiunto', color: 'text-primary' };
};

export const getCurrentAcademicYear = (currentDate = new Date()) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  // Academic year starts in September (month 8)
  return month >= 8 ? year : year - 1;
};

export const calculateCurrentCourseYear = (enrollmentYear) => {
  if (!enrollmentYear) {
    return 'N/A';
  }
  const currentAcademicYear = getCurrentAcademicYear(new Date());
  const yearDiff = currentAcademicYear - enrollmentYear;
  return yearDiff + 1;
};
