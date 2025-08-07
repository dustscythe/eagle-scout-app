import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { supabase } from '../lib/supabaseClient';

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) {
        setProfile(data as Profile);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      {profile ? (
        <>
          <Text variant="titleMedium">{profile.full_name || 'No name'}</Text>
          <Text variant="bodyMedium" style={{ marginBottom: 8 }}>{profile.email}</Text>
          <Text variant="bodyMedium" style={{ marginBottom: 16 }}>Role: {profile.role}</Text>
          <Button mode="outlined" onPress={handleSignOut}>Sign Out</Button>
        </>
      ) : (
        <Text>No profile found.</Text>
      )}
    </View>
  );
}
