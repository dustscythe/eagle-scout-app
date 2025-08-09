import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, RadioButton, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient';

const roles = ['scout', 'guardian', 'leader', 'district', 'council', 'provider'] as const;

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const saveRole = async () => {
    if (!selectedRole) return;
    setLoading(true);
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user?.id) throw userErr || new Error('No user');

      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', user.id);
      if (error) throw error;

      (navigation as any).navigate('home');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>Select your role</Text>
      <RadioButton.Group
        onValueChange={(value) => setSelectedRole(value)}
        value={selectedRole || ''}
      >
        {roles.map((role) => (
          <RadioButton.Item key={role} label={role} value={role} />
        ))}
      </RadioButton.Group>
      <Button
        mode="contained"
        onPress={saveRole}
        disabled={!selectedRole || loading}
        loading={loading}
        style={{ marginTop: 24 }}
      >
        Save
      </Button>
    </View>
  );
}
