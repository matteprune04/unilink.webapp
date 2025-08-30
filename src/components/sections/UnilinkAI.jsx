import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const UnilinkAI = () => {
  const { toast } = useToast();

  const handleSendMessage = () => {
    toast({
      title: "Funzionalità non implementata",
      description: "🚧 Questa funzionalità non è ancora implementata—ma non preoccuparti! Puoi richiederla nel tuo prossimo prompt! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>UNILINK AI - Il tuo Assistente Intelligente</title>
        <meta name="description" content="Chiedi a UNILINK AI per supporto accademico, consigli di carriera e molto altro." />
        <meta property="og:title" content="UNILINK AI - Il tuo Assistente Intelligente" />
        <meta property="og:description" content="Chiedi a UNILINK AI per supporto accademico, consigli di carriera e molto altro." />
      </Helmet>
      <div className="space-y-6">
        <Card className="flex flex-col items-center justify-center text-center p-8">
          <CardHeader>
            <MessageSquare className="h-12 w-12 text-brand-400 mb-4" />
            <CardTitle className="font-inter text-3xl font-semibold">Benvenuto in UNILINK AI!</CardTitle>
            <CardDescription className="font-inter text-lg text-muted-foreground mt-2">
              Il tuo assistente intelligente per il percorso universitario.
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full max-w-md space-y-4">
            <p className="font-inter text-sm text-muted-foreground">
              Chiedimi qualsiasi cosa sul tuo piano di studi, esami, opportunità di carriera o mobilità internazionale.
            </p>
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Fai una domanda a UNILINK AI..."
                className="flex-1 font-inter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="font-inter text-xl">Consigli di Studio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-inter text-muted-foreground">Ottieni suggerimenti personalizzati per migliorare le tue performance accademiche.</p>
              <Button variant="outline" className="mt-4 font-inter" onClick={handleSendMessage}>Esplora</Button>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="font-inter text-xl">Pianificazione Carriera</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-inter text-muted-foreground">Scopri percorsi di carriera basati sui tuoi interessi e competenze.</p>
              <Button variant="outline" className="mt-4 font-inter" onClick={handleSendMessage}>Esplora</Button>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="font-inter text-xl">Supporto Esami</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-inter text-muted-foreground">Prepara al meglio i tuoi esami con risorse e strategie mirate.</p>
              <Button variant="outline" className="mt-4 font-inter" onClick={handleSendMessage}>Esplora</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default UnilinkAI;