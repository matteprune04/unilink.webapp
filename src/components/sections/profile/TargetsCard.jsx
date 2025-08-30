import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Combobox } from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Star, BookOpen, Brain, Sparkles, DollarSign, Edit, Lock, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Data for selects
const gmatScores = Array.from({ length: (805 - 205) / 10 + 1 }, (_, i) => 205 + i * 10).map(String);
const greScores = Array.from({ length: 171 - 130 }, (_, i) => 130 + i).map(String);
const ieltsScores = Array.from({ length: 17 }, (_, i) => (9.0 - i * 0.5).toFixed(1)).map(String);
const toeflScores = Array.from({ length: 121 }, (_, i) => i).map(String);
const cambridgeScores = ['C2 Proficiency', 'C1 Advanced', 'B2 First', 'B1 Preliminary', 'A2 Key'];

const testScoreOptions = {
    GMAT: gmatScores.map(s => ({ value: s, label: s })),
    GRE: greScores.map(s => ({ value: s, label: s })),
    IELTS: ieltsScores.map(s => ({ value: s, label: s })),
    TOEFL: toeflScores.map(s => ({ value: s, label: s })),
    CAMBRIDGE: cambridgeScores.map(s => ({ value: s, label: s }))
};

const allSkills = [
  { value: 'financial-modeling', label: 'Financial Modeling' }, { value: 'data-analysis', label: 'Data Analysis (SQL, Python)' }, { value: 'market-research', label: 'Market Research' }, { value: 'business-strategy', label: 'Business Strategy' }, { value: 'valuation', label: 'Valuation' }, { value: 'risk-management', label: 'Risk Management' }, { value: 'excel', label: 'Advanced Excel' }, { value: 'power-bi', label: 'Power BI / Tableau' }, { value: 'communication', label: 'Public Speaking' }, { value: 'project-management', label: 'Project Management' },
];

const allInterests = [
  { value: 'investment-banking', label: 'Investment Banking' }, { value: 'consulting', label: 'Management Consulting' }, { value: 'venture-capital', label: 'Venture Capital & PE' }, { value: 'fintech', label: 'FinTech' }, { value: 'sustainability', label: 'Sustainable Finance (ESG)' }, { value: 'macroeconomics', label: 'Macroeconomics' }, { value: 'entrepreneurship', label: 'Entrepreneurship' }, { value: 'corp-finance', label: 'Corporate Finance' }, { value: 'marketing-analytics', label: 'Marketing Analytics' }, { value: 'behavioral-economics', label: 'Behavioral Economics' },
];

const EditableField = ({ label, name, value, icon: Icon, type = 'number', step, onChange, disabled }) => (
    <div className={`grid grid-cols-3 items-center gap-4 relative ${disabled && 'opacity-50'}`}>
        <Label htmlFor={name} className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><Icon className="h-4 w-4" />{label}</Label>
        <Input id={name} name={name} value={value || ''} onChange={onChange} className="font-inter col-span-2" type={type} step={step} disabled={disabled} />
        {disabled && <Lock className="absolute top-1/2 right-4 -translate-y-1/2 h-5 w-5 text-amber-500" />}
    </div>
);

const EditableSelect = ({ label, name, value, options, placeholder, icon: Icon, onValueChange, disabled }) => (
  <div className={`grid grid-cols-3 items-center gap-4 relative ${disabled && 'opacity-50'}`}>
    <Label htmlFor={name} className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><Icon className="h-4 w-4" />{label}</Label>
    <Select onValueChange={onValueChange} value={value || ''} disabled={disabled}>
      <SelectTrigger className="font-inter w-full col-span-2"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        {options.map(opt => <SelectItem key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}><span className="font-inter">{typeof opt === 'string' ? opt : opt.label}</span></SelectItem>)}
      </SelectContent>
    </Select>
    {disabled && <Lock className="absolute top-1/2 right-10 -translate-y-1/2 h-5 w-5 text-amber-500" />}
  </div>
);

const EditableTestScore = ({ label, typeName, scoreName, typeValue, scoreValue, options, scoreOptions, placeholder, icon: Icon, onValueChange }) => (
  <div className="grid grid-cols-3 items-center gap-4">
    <Label className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><Icon className="h-4 w-4" />{label}</Label>
    <div className="col-span-2 grid grid-cols-2 gap-2">
      <Select onValueChange={(val) => onValueChange(typeName, val)} value={typeValue || ''}>
        <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>{options.map(opt => <SelectItem key={opt} value={opt}><span className="font-inter">{opt}</span></SelectItem>)}</SelectContent>
      </Select>
      <Combobox 
        options={scoreOptions[typeValue] || []}
        value={scoreValue}
        onValueChange={(val) => onValueChange(scoreName, val)}
        placeholder="Punteggio"
        searchPlaceholder="Cerca punteggio..."
        disabled={!typeValue}
        className="font-inter"
      />
    </div>
  </div>
);

const EditableMultiSelect = ({ label, name, value, options, icon: Icon, onValueChange }) => (
  <div className="grid grid-cols-3 items-start gap-4 pt-2">
    <Label className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground pt-2"><Icon className="h-4 w-4" />{label}</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="font-inter col-span-2 justify-between h-auto min-h-[40px]">
          <div className="flex flex-wrap gap-1">{value?.length > 0 ? value.map(val => (<Badge variant="secondary" key={val} className="font-inter">{options.find(o => o.value === val)?.label}</Badge>)) : 'Seleziona...'}</div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={`Cerca ${label.toLowerCase()}...`} className="font-inter" />
          <CommandList>
            <CommandEmpty className="font-inter">Nessun risultato.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem key={option.value} onSelect={() => onValueChange(name, option.value)}>
                  <Check className={cn("mr-2 h-4 w-4", value?.includes(option.value) ? "opacity-100" : "opacity-0")} />
                  <span className="font-inter">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
);

const TargetsCard = ({ initialUser, isEditing, formData, handleInputChange, handleSelectChange, handleMultiSelectChange, isPremium }) => {
  const targets = isEditing ? formData.targets : initialUser?.targets;
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle className="font-plus-jakarta-sans flex items-center gap-2"><Briefcase className="text-brand-400"/>Parametri Target</CardTitle>
        <CardDescription className="font-inter">Definisci i tuoi obiettivi accademici e di carriera.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-6">
        {isEditing ? (
          <>
            <EditableField label="Media Target" name="target_average" value={targets?.target_average} icon={Star} type="number" step="0.1" onChange={(e) => handleInputChange(e, 'targets')} />
            <EditableTestScore label="Test Ammissione" typeName="test_type" scoreName="test_score" typeValue={targets?.test_type} scoreValue={targets?.test_score} options={['GMAT', 'GRE']} scoreOptions={testScoreOptions} placeholder="GMAT/GRE" icon={BookOpen} onValueChange={(name, val) => handleSelectChange(name, val, 'targets')} />
            <EditableTestScore label="Cert. Inglese" typeName="english_test_type" scoreName="english_test_score" typeValue={targets?.english_test_type} scoreValue={targets?.english_test_score} options={['IELTS', 'TOEFL', 'CAMBRIDGE']} scoreOptions={testScoreOptions} placeholder="IELTS/TOEFL/..." icon={BookOpen} onValueChange={(name, val) => handleSelectChange(name, val, 'targets')} />
            <EditableMultiSelect label="Competenze" name="skills" value={targets?.skills} options={allSkills} icon={Brain} onValueChange={(name, val) => handleMultiSelectChange(name, val, 'targets')} />
            <EditableMultiSelect label="Interessi" name="interests" value={targets?.interests} options={allInterests} icon={Sparkles} onValueChange={(name, val) => handleMultiSelectChange(name, val, 'targets')} />
            <EditableSelect label="MSc Target" name="target_msc" value={targets?.target_msc} options={['Management', 'Finance', 'Marketing Management', 'Accounting', 'Innovation', 'Other']} placeholder="Seleziona MSc" icon={Sparkles} onValueChange={(val) => handleSelectChange('target_msc', val, 'targets')} disabled={!isPremium} />
            {targets?.target_msc === 'Other' && <EditableField label="Specifica MSc" name="target_msc_other" value={targets?.target_msc_other} icon={Edit} type="text" onChange={(e) => handleInputChange(e, 'targets')} disabled={!isPremium} />}
            <EditableSelect label="Carriera Target" name="target_career" value={targets?.target_career} options={['Consulting', 'IB', 'PE', 'VC', 'Product Management', 'Start-up', 'Scale-up', 'Entrepreneurship', 'Audit', 'Other']} placeholder="Seleziona Carriera" icon={Briefcase} onValueChange={(val) => handleSelectChange('target_career', val, 'targets')} disabled={!isPremium} />
            {targets?.target_career === 'Other' && <EditableField label="Specifica Carriera" name="target_career_other" value={targets?.target_career_other} icon={Edit} type="text" onChange={(e) => handleInputChange(e, 'targets')} disabled={!isPremium} />}
            <EditableField label="Budget MSc" name="budget_msc" value={targets?.budget_msc} icon={DollarSign} type="number" onChange={(e) => handleInputChange(e, 'targets')} disabled={!isPremium} />
          </>
        ) : (
          <>
            <div className="grid grid-cols-3 items-center gap-4"><Label className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><Star className="h-4 w-4" />Media Target</Label><p className="font-inter col-span-2 font-medium">{targets?.target_average || 'Non specificato'}</p></div>
            <div className="grid grid-cols-3 items-center gap-4"><Label className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><BookOpen className="h-4 w-4" />Test Ammissione</Label><p className="font-inter col-span-2 font-medium">{targets?.test_type ? `${targets.test_type}: ${targets.test_score || 'N/A'}` : 'Non specificato'}</p></div>
            <div className="grid grid-cols-3 items-center gap-4"><Label className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><BookOpen className="h-4 w-4" />Cert. Inglese</Label><p className="font-inter col-span-2 font-medium">{targets?.english_test_type ? `${targets.english_test_type}: ${targets.english_test_score || 'N/A'}` : 'Non specificato'}</p></div>
            <div className="grid grid-cols-3 items-start gap-4 pt-2"><Label className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground pt-1"><Brain className="h-4 w-4" />Competenze</Label><div className="col-span-2 flex flex-wrap gap-2">{targets?.skills?.length > 0 ? targets.skills.map(val => <Badge key={val} className="font-inter">{allSkills.find(o => o.value === val)?.label || val}</Badge>) : <p className="font-inter font-medium">Non specificato</p>}</div></div>
            <div className="grid grid-cols-3 items-start gap-4 pt-2"><Label className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground pt-1"><Sparkles className="h-4 w-4" />Interessi</Label><div className="col-span-2 flex flex-wrap gap-2">{targets?.interests?.length > 0 ? targets.interests.map(val => <Badge key={val} className="font-inter">{allInterests.find(o => o.value === val)?.label || val}</Badge>) : <p className="font-inter font-medium">Non specificato</p>}</div></div>
            <div className="grid grid-cols-3 items-center gap-4"><Label className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><Sparkles className="h-4 w-4" />MSc Target</Label><p className="font-inter col-span-2 font-medium">{targets?.target_msc || 'Non specificato'}</p></div>
            {targets?.target_msc === 'Other' && <div className="grid grid-cols-3 items-center gap-4"><Label className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><Edit className="h-4 w-4" />Specifica MSc</Label><p className="font-inter col-span-2 font-medium">{targets?.target_msc_other || 'Non specificato'}</p></div>}
            <div className="grid grid-cols-3 items-center gap-4"><Label className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><Briefcase className="h-4 w-4" />Carriera Target</Label><p className="font-inter col-span-2 font-medium">{targets?.target_career || 'Non specificato'}</p></div>
            {targets?.target_career === 'Other' && <div className="grid grid-cols-3 items-center gap-4"><Label className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><Edit className="h-4 w-4" />Specifica Carriera</Label><p className="font-inter col-span-2 font-medium">{targets?.target_career_other || 'Non specificato'}</p></div>}
            <div className="grid grid-cols-3 items-center gap-4"><Label className="font-inter text-right flex items-center justify-end gap-2 text-muted-foreground"><DollarSign className="h-4 w-4" />Budget MSc</Label><p className="font-inter col-span-2 font-medium">{targets?.budget_msc ? `€ ${targets.budget_msc}` : 'Non specificato'}</p></div>
            {!isPremium && !isEditing && <div className="font-inter md:col-span-2 mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-4"><Sparkles className="h-6 w-6 text-amber-400" /><div><p className="font-semibold text-amber-300">Passa a Premium!</p><p className="text-sm text-amber-400">Sblocca i campi MSc e Carriera per definire al meglio i tuoi obiettivi.</p></div></div>}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TargetsCard;