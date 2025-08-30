import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, School, MapPin, Search, Filter, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Link } from 'react-router-dom';

const mockMasters = [
  {
    id: 1,
    name: 'MSc in International Management',
    university: 'Università Bocconi',
    location: 'Milano, Italia',
    rating: 4.9,
    logo: 'bocconi',
  },
  {
    id: 2,
    name: 'Master in Corporate Finance',
    university: 'LUISS Guido Carli',
    location: 'Roma, Italia',
    rating: 4.8,
    logo: 'luiss',
  },
  {
    id: 3,
    name: 'MSc in Finance',
    university: 'HEC Paris',
    location: 'Parigi, Francia',
    rating: 4.9,
    logo: 'hec',
  },
  {
    id: 4,
    name: 'Master in Management',
    university: 'ESADE Business School',
    location: 'Barcellona, Spagna',
    rating: 4.7,
    logo: 'esade',
  },
];

const Masters = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDetailsClick = (name) => {
    toast({
      title: `Dettagli per ${name}`,
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
            <GraduationCap className="h-7 w-7 md:h-8 md:w-8 text-brand-400" />
            Magistrale & Master
          </h1>
          <p className="text-muted-foreground mt-1">
            Trova il percorso post-laurea perfetto per te.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cerca per corso, università..." className="pl-10 bg-input border-transparent focus:border-border" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtri
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockMasters.map((master, index) => (
              <motion.div
                key={master.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:bg-accent transition-colors h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <School className="h-10 w-10 text-brand-400 bg-card p-2 rounded-lg" />
                      <div className="flex items-center gap-1 text-sm font-bold text-yellow-400">
                        <Star className="h-4 w-4 fill-current" /> {master.rating}
                      </div>
                    </div>
                    <CardTitle className="pt-2 text-foreground">{master.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="flex items-center gap-2"><School className="h-4 w-4" /> {master.university}</p>
                      <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {master.location}</p>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button className="w-full" onClick={() => handleDetailsClick(master.name)}>Vedi Dettagli</Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Masters;