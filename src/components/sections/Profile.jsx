
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { calculateStats } from '@/lib/dashboardUtils.js';

import ProfileHeader from './profile/ProfileHeader';
import PersonalInfoCard from './profile/PersonalInfoCard';
import StatsCard from './profile/StatsCard';
import TargetsCard from './profile/TargetsCard';

const Profile = ({ user: initialUser, onProfileUpdate }) => {
  const { user: authUser } = useAuth();
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [userExams, setUserExams] = useState([]);
  const [academicStats, setAcademicStats] = useState({ totalCfu: 0, averageGrade: '0.00' });
  const { toast } = useToast();
  
  const isPremium = initialUser?.subscription_level === 'premium';

  const fetchUserExams = useCallback(async () => {
    if (!authUser) return;
    const { data, error } = await supabase
      .from('user_exams')
      .select('*, courses(*)')
      .eq('user_id', authUser.id);
    
    if (error) {
      console.error('Error fetching user exams:', error);
    } else {
      setUserExams(data);
      const stats = calculateStats(data);
      setAcademicStats(stats);
    }
  }, [authUser]);

  useEffect(() => {
    fetchUserExams();
  }, [fetchUserExams]);
  
  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: initialUser?.name || '',
        enrollment_year: initialUser?.enrollment_year || '',
        course_of_study: initialUser?.course_of_study || '',
        specialization: initialUser?.specialization || '',
        targets: { ...(initialUser?.targets || {}) },
      });
    } else {
        setFormData({});
        setAvatarFile(null);
    }
  }, [isEditing, initialUser]);

  const handleInputChange = (e, section = 'user') => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' && value === '' ? null : value;
    if (section === 'targets') {
      setFormData(prev => ({
        ...prev,
        targets: { ...prev.targets, [name]: finalValue }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleSelectChange = (name, value, section = 'user') => {
    if (section === 'targets') {
        const newTargets = { ...formData.targets, [name]: value };
        if (name === 'test_type') newTargets.test_score = '';
        if (name === 'english_test_type') newTargets.english_test_score = '';
        setFormData(prev => ({ ...prev, targets: newTargets }));
    } else {
        const newFormData = { ...formData, [name]: value };
        if (name === 'course_of_study') {
            newFormData.specialization = '';
        }
        setFormData(newFormData);
    }
  };
  
  const handleMultiSelectChange = (name, value, section = 'targets') => {
    setFormData(prev => {
        const currentValues = prev[section]?.[name] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        return {
            ...prev,
            [section]: {
                ...prev[section],
                [name]: newValues,
            },
        };
    });
  };

  const uploadAvatar = async (file) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${authUser.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Errore caricamento avatar', description: error.message });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    let avatar_url = initialUser.avatar_url;

    if (avatarFile) {
        const newAvatarUrl = await uploadAvatar(avatarFile);
        if (newAvatarUrl) avatar_url = newAvatarUrl;
    }

    const profileUpdates = {
      full_name: formData.name,
      enrollment_year: formData.enrollment_year === '' ? null : parseInt(formData.enrollment_year, 10),
      course_of_study: formData.course_of_study,
      specialization: formData.specialization,
      avatar_url,
      updated_at: new Date(),
    };
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', authUser.id)
      .select()
      .single();

    if (profileError) {
      toast({ variant: 'destructive', title: 'Errore', description: profileError.message || 'Impossibile aggiornare il profilo.' });
      setSaving(false);
      return;
    }
    
    const targetsUpdates = { 
        ...formData.targets,
        id: authUser.id, 
        updated_at: new Date(),
        budget_msc: formData.targets.budget_msc === '' || formData.targets.budget_msc === null ? null : parseInt(formData.targets.budget_msc, 10),
        target_average: formData.targets.target_average === '' || formData.targets.target_average === null ? null : parseFloat(formData.targets.target_average),
    };
    const { error: targetsError } = await supabase.from('profile_targets').upsert(targetsUpdates, { onConflict: 'id' });
    
    if (targetsError) {
      toast({ variant: 'destructive', title: 'Errore', description: targetsError.message || 'Impossibile aggiornare gli obiettivi.' });
    } else {
      toast({ title: 'Successo', description: 'Profilo aggiornato con successo.' });
      const updatedProfileResponse = await supabase.from('profiles').select('*, profile_targets(*)').eq('id', authUser.id).single();
      if(updatedProfileResponse.data){
        const userProfile = {
            ...updatedProfileResponse.data,
            email: authUser.email,
            name: updatedProfileResponse.data.full_name,
            targets: updatedProfileResponse.data.profile_targets || {},
          };
        onProfileUpdate(userProfile);
      }
      setIsEditing(false);
    }
    setSaving(false);
  };

  if (!initialUser) return <div className="font-inter text-center p-8">Caricamento del profilo...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <ProfileHeader isEditing={isEditing} setIsEditing={setIsEditing} handleSave={handleSave} saving={saving} uploading={uploading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PersonalInfoCard
              initialUser={initialUser}
              isEditing={isEditing}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              avatarFile={avatarFile}
              setAvatarFile={setAvatarFile}
              uploading={uploading}
            />
            <StatsCard initialUser={initialUser} academicStats={academicStats} />
          </div>
        </div>
        <TargetsCard
          initialUser={initialUser}
          isEditing={isEditing}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleMultiSelectChange={handleMultiSelectChange}
          isPremium={isPremium}
        />
      </div>
    </motion.div>
  );
};

export default Profile;
