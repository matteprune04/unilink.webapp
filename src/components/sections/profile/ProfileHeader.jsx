import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Edit, Save, X, Loader2 } from 'lucide-react';

const ProfileHeader = ({ isEditing, setIsEditing, handleSave, saving, uploading }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <h1 className="font-plus-jakarta-sans text-3xl font-semibold text-foreground flex items-center gap-3">
        <User className="h-8 w-8 text-brand-400" /> Profilo Utente
      </h1>
      <div className="flex gap-2 self-start sm:self-center">
        {isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            <X className="mr-2 h-4 w-4" />
            <span className="font-inter">Annulla</span>
          </Button>
        )}
        <Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))} disabled={saving || uploading}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isEditing ? (
            <Save className="mr-2 h-4 w-4" />
          ) : (
            <Edit className="mr-2 h-4 w-4" />
          )}
          <span className="font-inter">{isEditing ? (saving ? 'Salvataggio...' : 'Salva') : 'Modifica'}</span>
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;