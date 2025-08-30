import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, BookOpen, TrendingUp, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const mockResources = [
  { id: 1, title: 'Appunti di Microeconomia', type: 'Appunti', author: 'Giulia B.' },
  { id: 2, title: 'Flashcard di Diritto Privato', type: 'Flashcard', author: 'Marco V.' },
  { id: 3, title: 'Simulazione Esame Statistica', type: 'Simulazione', author: 'Sofia N.' },
  { id: 4, title: 'Riassunti di Macroeconomia', type: 'Appunti', author: 'Luca G.' },
];

const Resources = () => {
  const { toast } = useToast();

  const handleAction = (title) => {
    toast({
      title: `Accesso a ${title}`,
      description: "🚧 Questa funzionalità non è ancora implementata. Richiedila nel prossimo prompt! 🚀",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-inter font-semibold text-foreground flex items-center gap-3">
            <FileText className="h-7 w-7 md:h-8 md:w-8 text-brand-400" />
            Risorse per Esami
          </h1>
          <p className="font-inter text-muted-foreground mt-1">
            Accedi ad appunti, flashcard e simulazioni condivise dalla community.
          </p>
        </div>
        <Button onClick={() => handleAction('Nuova Risorsa')} className="self-start sm:self-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="font-inter">Aggiungi Risorsa</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="h-full flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="font-inter font-semibold flex items-center gap-2"><TrendingUp className="text-green-400" />Simulatore "What-If"</CardTitle>
              <CardDescription className="font-inter">Calcola come i prossimi voti influenzeranno la tua media.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full font-inter" onClick={() => handleAction('Simulatore')}>Avvia Simulatore</Button>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="h-full flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="font-inter font-semibold flex items-center gap-2"><BookOpen className="text-blue-400" />Le tue Flashcard</CardTitle>
              <CardDescription className="font-inter">Ripassa concetti chiave con le tue flashcard personalizzate.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full font-inter" onClick={() => handleAction('Flashcard')}>Apri le mie Flashcard</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-inter font-semibold">Risorse dalla Community</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockResources.map((res, index) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + 0.1 * index }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-input rounded-lg hover:bg-accent transition-colors gap-3">
                  <div className="min-w-0">
                    <p className="font-inter font-medium text-foreground truncate">{res.title}</p>
                    <p className="font-inter text-sm text-muted-foreground">
                      {res.type} di {res.author}
                    </p>
                  </div>
                  <Button variant="secondary" onClick={() => handleAction(res.title)} className="self-end sm:self-center">
                    <span className="font-inter">Apri</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Resources;