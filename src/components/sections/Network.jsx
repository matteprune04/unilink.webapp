import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Search, Mail, FileText, Briefcase, ExternalLink, Loader2, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/customSupabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const CommunitySection = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, course_of_study, email, profile_targets(interests)')
                .neq('role', 'founder'); 

            if (error) {
                console.error('Error fetching users:', error);
                toast({
                    title: "Errore",
                    description: "Impossibile caricare la community. Riprova più tardi.",
                    variant: "destructive"
                });
            } else {
                setUsers(data);
            }
            setLoading(false);
        };
        fetchUsers();
    }, [toast]);

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length > 1 && names[0] && names[names.length - 1]) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cerca studenti per nome..." className="pl-10 bg-input border-transparent focus:border-border" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredUsers.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * index }}
                            >
                                <div className="bg-muted/50 hover:bg-muted/80 transition-colors rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-grow min-w-0">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user.avatar_url} alt={user.full_name} />
                                            <AvatarFallback className="bg-brand-500/20 text-brand-400 font-bold">{getInitials(user.full_name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-foreground truncate">{user.full_name || 'Studente'}</h3>
                                            <p className="text-sm text-muted-foreground">{user.course_of_study || 'N/D'}</p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {user.profile_targets?.[0]?.interests?.slice(0, 3).map(interest => (
                                                    <Badge key={interest} variant="secondary">{interest}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <a href={`mailto:${user.email}`} className="self-end sm:self-center">
                                      <Button variant="ghost" size="sm" disabled={!user.email}>
                                          <Mail className="h-4 w-4 mr-2" />
                                          Contatta
                                      </Button>
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const TemplatesSection = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchTemplates = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('templates').select('*');
            if (error) {
                console.error('Error fetching templates:', error);
                toast({ title: 'Errore', description: "Impossibile caricare i template.", variant: 'destructive'});
            } else {
                setTemplates(data);
            }
            setLoading(false);
        };
        fetchTemplates();
    }, [toast]);

    const handleDownload = (template) => {
        if (template.file_url === '#') {
             toast({
                title: 'File non disponibile',
                description: "Il file per questo template non è stato ancora caricato. Torna a controllare più tardi!",
                variant: "destructive"
            });
        } else {
            window.open(template.file_url, '_blank');
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
            {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="h-full flex flex-col animate-pulse">
                        <CardHeader><div className="h-6 w-3/4 bg-muted rounded"></div><div className="h-4 w-1/2 bg-muted rounded mt-2"></div></CardHeader>
                        <CardContent className="flex-grow"><div className="h-6 w-16 bg-muted rounded-full"></div></CardContent>
                        <CardFooter><div className="h-10 w-full bg-muted rounded"></div></CardFooter>
                    </Card>
                ))
            ) : (
                templates.map((template, index) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <Card className="hover:border-brand-500/50 hover:shadow-lg transition-all h-full flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-brand-400" />{template.title}</CardTitle>
                                <CardDescription>{template.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <Badge variant="outline">{template.type}</Badge>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => handleDownload(template)}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Scarica
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))
            )}
        </div>
    );
};

const PartnershipSection = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();


    useEffect(() => {
        const fetchPartners = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('partnerships').select('*');
            if (error) {
                console.error('Error fetching partners:', error);
                toast({ title: 'Errore', description: "Impossibile caricare i partner.", variant: 'destructive'});
            } else {
                setPartners(data);
            }
            setLoading(false);
        };
        fetchPartners();
    }, [toast]);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
             {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="h-full flex flex-col justify-between animate-pulse">
                        <CardHeader className="items-center text-center">
                            <div className="h-20 w-20 bg-muted rounded-full mb-4"></div>
                            <div className="h-6 w-3/4 bg-muted rounded"></div>
                        </CardHeader>
                        <CardFooter className="flex-col gap-2">
                           <div className="h-10 w-full bg-muted rounded"></div>
                           <div className="h-10 w-full bg-muted rounded"></div>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                partners.map((partner, index) => (
                    <motion.div
                        key={partner.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <Card className="hover:border-brand-500/50 hover:shadow-lg transition-shadow h-full flex flex-col justify-between">
                            <CardHeader className="items-center text-center">
                                <img  alt={`${partner.name} logo`} className="h-20 object-contain mb-4" src="https://images.unsplash.com/photo-1485531865381-286666aa80a9" />
                                <CardTitle>{partner.name}</CardTitle>
                            </CardHeader>
                            <CardFooter className="flex-col gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full">Dettagli</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle className="text-center text-2xl mb-4">{partner.name}</DialogTitle>
                                             <img  alt={`${partner.name} logo in modal`} className="h-24 object-contain mx-auto" src="https://images.unsplash.com/photo-1518841252147-00cc0a43dcaf" />
                                            <DialogDescription className="text-center mt-4 text-base pt-4">
                                                {partner.description}
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                                <Button asChild className="w-full">
                                    <a href={partner.website_url} target="_blank" rel="noopener noreferrer">
                                        Visita il sito <ExternalLink className="h-4 w-4 ml-2" />
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))
            )}
        </div>
    );
};


const Network = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-1 md:p-3 h-full flex flex-col"
    >
      <div className="flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Users className="h-7 w-7 md:h-8 md:w-8 text-brand-400" />
          Network
        </h1>
        <p className="text-muted-foreground mt-1 mb-6">
          Connettiti con studenti, scarica risorse e scopri i nostri partner.
        </p>
      </div>

      <Tabs defaultValue="community" className="flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mb-4 bg-muted">
          <TabsTrigger value="community" className="flex items-center gap-2"><Users className="h-4 w-4" />Community</TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2"><FileText className="h-4 w-4" />Template</TabsTrigger>
          <TabsTrigger value="partnerships" className="flex items-center gap-2"><Briefcase className="h-4 w-4" />Partnership</TabsTrigger>
        </TabsList>
        <TabsContent value="community" className="flex-grow">
          <CommunitySection />
        </TabsContent>
        <TabsContent value="templates" className="flex-grow">
          <TemplatesSection />
        </TabsContent>
        <TabsContent value="partnerships" className="flex-grow">
          <PartnershipSection />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Network;