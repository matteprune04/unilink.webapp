import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, MapPin, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Link } from 'react-router-dom';

const mockOpportunities = [
  {
    id: 1,
    title: 'Junior Financial Analyst',
    company: 'Deloitte',
    location: 'Milano, Italia',
    type: 'Stage',
    logo: 'deloitte',
    posted: '2 giorni fa',
  },
  {
    id: 2,
    title: 'Marketing Intern',
    company: 'Procter & Gamble',
    location: 'Roma, Italia',
    type: 'Stage',
    logo: 'pg',
    posted: '5 giorni fa',
  },
  {
    id: 3,
    title: 'Consulting Graduate Program',
    company: 'McKinsey & Company',
    location: 'Remoto',
    type: 'Full-time',
    logo: 'mckinsey',
    posted: '1 settimana fa',
  },
  {
    id: 4,
    title: 'Data Science Internship',
    company: 'Google',
    location: 'Zurigo, Svizzera',
    type: 'Stage',
    logo: 'google',
    posted: '1 settimana fa',
  },
];

const Career = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleApply = (title) => {
    toast({
      title: `Candidatura per ${title}`,
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
            <Briefcase className="h-7 w-7 md:h-8 md:w-8 text-brand-400" />
            Carriera & Opportunità
          </h1>
          <p className="text-muted-foreground mt-1">
            Esplora stage, posizioni lavorative e programmi graduate.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cerca per ruolo, azienda..." className="pl-10 bg-input border-transparent focus:border-border" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtri
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOpportunities.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="bg-input hover:bg-accent transition-colors">
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="p-3 bg-card rounded-lg hidden sm:block">
                        <Building className="h-6 w-6 text-brand-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1.5"><Building className="h-4 w-4" /> {job.company}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-brand-500/20 text-brand-400 px-2 py-1 rounded-full">{job.type}</span>
                        <Button onClick={() => handleApply(job.title)}>Candidati</Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 sm:self-end">{job.posted}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Career;