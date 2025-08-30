
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Star, Zap, Gem, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';

const InterestModal = ({ open, onOpenChange, user, onInterestSubmitted }) => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      toast({
        variant: 'destructive',
        title: 'Selezione richiesta',
        description: 'Per favore, scegli un piano.',
      });
      return;
    }
    setIsSubmitting(true);

    const { error } = await supabase.from('subscription_interest').insert({
      user_id: user.id,
      interested_plan: selectedPlan,
      suggested_price: suggestedPrice ? parseFloat(suggestedPrice) : null,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Impossibile inviare il tuo interesse. Riprova più tardi.',
      });
    } else {
      toast({
        title: 'Grazie!',
        description: 'Il tuo interesse è stato registrato con successo.',
      });
      onInterestSubmitted();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Esprimi il tuo interesse</DialogTitle>
          <DialogDescription>
            Facci sapere a quale piano sei interessato e quanto saresti disposto a pagare. Il tuo feedback è prezioso!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="plan">Piano di interesse</Label>
            <Select onValueChange={setSelectedPlan} value={selectedPlan}>
              <SelectTrigger id="plan">
                <SelectValue placeholder="Seleziona un piano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACCESS">ACCESS</SelectItem>
                <SelectItem value="TALENT">TALENT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="price">Prezzo suggerito (opzionale)</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">€</span>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={suggestedPrice}
                onChange={(e) => setSuggestedPrice(e.target.value)}
                className="pl-7"
                placeholder="es. 19.99"
              />
            </div>
             <p className="text-xs text-muted-foreground mt-1">Prezzo per semestre accademico.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Annulla</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Invio in corso...' : 'Invia Interesse'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


const plans = [
  {
    name: 'Gratis',
    price: '€0',
    description: 'Le funzionalità base per iniziare il tuo percorso.',
    icon: Star,
    features: ['Dashboard', 'Profilo Personale', 'Network', 'Libretto Voti'],
    isCurrent: true,
  },
  {
    name: 'ACCESS',
    price: 'Semestrale',
    description: 'Sblocca gli strumenti essenziali per la tua carriera.',
    icon: Zap,
    features: ['Tutto del piano Gratis', 'Risorse Esami', 'Erasmus & Mobilità', 'UNILINK AI (uso limitato)'],
    isCurrent: false,
    isPremium: true,
  },
  {
    name: 'TALENT',
    price: 'Semestrale',
    description: 'Diventa un talento con accesso illimitato a tutto.',
    icon: Gem,
    features: ['Tutto del piano ACCESS', 'UNILINK AI (uso illimitato)', 'Opportunità di Carriera', 'Programmi Master'],
    isCurrent: false,
    isPremium: true,
  },
];


const Subscription = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasShownInterest, setHasShownInterest] = useState(false);

  const handleInterestClick = () => {
    setIsModalOpen(true);
  };
  
  const currentPlanName = user?.subscription_level || 'Gratis';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 md:p-6 space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center justify-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            Piani di Abbonamento
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Scegli il piano che meglio si adatta alle tue ambizioni e potenzia il tuo percorso universitario.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className={`h-full flex flex-col ${plan.name === currentPlanName ? 'border-primary' : ''}`}>
                <CardHeader className="text-center">
                  <div className="flex justify-center items-center gap-2">
                    <plan.icon className={`h-6 w-6 ${plan.name === 'TALENT' ? 'text-blue-400' : 'text-primary'}`} />
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  <p className="text-3xl font-bold pt-2">{plan.price}</p>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <ul className="space-y-3 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    {plan.name === currentPlanName ? (
                      <Button variant="outline" className="w-full" disabled>
                        <Check className="mr-2 h-4 w-4" />
                        Il Tuo Piano Attuale
                      </Button>
                    ) : (
                      <Button 
                        size="lg" 
                        className="w-full"
                        onClick={handleInterestClick}
                        disabled={hasShownInterest}
                      >
                        {hasShownInterest ? 'Grazie per il tuo interesse!' : 'Sono Interessato'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <InterestModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        user={user} 
        onInterestSubmitted={() => setHasShownInterest(true)}
      />
    </>
  );
};

export default Subscription;
