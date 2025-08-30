import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { User, Mail, School as University, Upload, Loader2, Calendar, BookOpen, Sparkles } from 'lucide-react';

const courses = {
  "Economia Aziendale": ["Management", "Marketing e Internazionalizzazione"],
  "Economia e Commercio": ["Economics", "Economics and Data", "Economia e Diritto", "Economia e mercati finanziari", "Economia, territorio e ambiente"]
};

const EditableField = ({ label, name, value, icon: Icon, type = 'number', onChange }) => (
  <div className="grid grid-cols-3 items-center gap-4">
    <Label htmlFor={name} className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><Icon className="h-4 w-4" />{label}</Label>
    <Input id={name} name={name} value={value || ''} onChange={onChange} className="font-inter col-span-2" type={type} />
  </div>
);

const EditableSelect = ({ label, name, value, options, placeholder, icon: Icon, onValueChange }) => (
  <div className="grid grid-cols-3 items-center gap-4">
    <Label htmlFor={name} className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><Icon className="h-4 w-4" />{label}</Label>
    <Select onValueChange={onValueChange} value={value || ''}>
      <SelectTrigger className="font-inter w-full col-span-2"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        {options.map(opt => <SelectItem key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}><span className="font-inter">{typeof opt === 'string' ? opt : opt.label}</span></SelectItem>)}
      </SelectContent>
    </Select>
  </div>
);

const PersonalInfoCard = ({ initialUser, isEditing, formData, handleInputChange, handleSelectChange, avatarFile, setAvatarFile, uploading }) => {
  const specializations = courses[formData?.course_of_study || initialUser?.course_of_study] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-plus-jakarta-sans flex items-center gap-2"><User className="text-brand-400"/>Informazioni Personali</CardTitle>
        <CardDescription className="font-inter">I tuoi dati personali e accademici.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24 relative">
            <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : initialUser?.avatar_url} alt={initialUser?.name} />
            <AvatarFallback className="bg-brand-500/20 text-brand-400 font-inter">{initialUser?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
            {isEditing && (
              <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center text-white cursor-pointer rounded-full opacity-0 hover:opacity-100 transition-opacity">
                {uploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <Upload className="h-8 w-8"/>}
                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} disabled={uploading}/>
              </label>
            )}
          </Avatar>
          <div className="space-y-1 flex-1">
            {isEditing ? (
              <Input name="name" value={formData.name || ''} onChange={(e) => handleInputChange(e)} className="font-inter text-xl font-bold"/>
            ) : (
              <h2 className="font-plus-jakarta-sans text-xl font-bold">{initialUser?.name}</h2>
            )}
            <p className="font-inter text-muted-foreground flex items-center gap-2 break-all"><Mail className="h-4 w-4"/>{initialUser?.email}</p>
            <p className="font-inter text-muted-foreground flex items-center gap-2"><University className="h-4 w-4"/>{initialUser?.university}</p>
          </div>
        </div>
        
        {isEditing ? (
          <>
            <EditableField label="Anno Iscrizione" name="enrollment_year" value={formData.enrollment_year} icon={Calendar} onChange={handleInputChange} />
            <EditableSelect label="Corso di Laurea" name="course_of_study" value={formData.course_of_study} options={Object.keys(courses)} placeholder="Seleziona CdL" icon={BookOpen} onValueChange={(val) => handleSelectChange('course_of_study', val)} />
            {(formData.course_of_study) && <EditableSelect label="Percorso" name="specialization" value={formData.specialization} options={specializations} placeholder="Seleziona percorso" icon={Sparkles} onValueChange={(val) => handleSelectChange('specialization', val)} />}
          </>
        ) : (
          <>
            <div className="grid grid-cols-3 items-center gap-4"><Label className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><Calendar className="h-4 w-4" />Anno Iscrizione</Label><p className="font-inter col-span-2 font-medium">{initialUser?.enrollment_year || 'Non specificato'}</p></div>
            <div className="grid grid-cols-3 items-center gap-4"><Label className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><BookOpen className="h-4 w-4" />Corso di Laurea</Label><p className="font-inter col-span-2 font-medium">{initialUser?.course_of_study || 'Non specificato'}</p></div>
            <div className="grid grid-cols-3 items-center gap-4"><Label className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><Sparkles className="h-4 w-4" />Percorso</Label><p className="font-inter col-span-2 font-medium">{initialUser?.specialization || 'Non specificato'}</p></div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;