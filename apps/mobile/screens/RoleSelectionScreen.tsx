import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, RadioButton, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient';

const roles = ['scout','guardian','leader','district','council','provider'] as const;

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const saveRole = async () => {
    if (!selectedRole) return;
    setLoading(true);
    // get current user ID from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error(sessionError.message);
    }
    const userId = session?.user?.id;
    if (userId) {
      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', userId);
      if (error) {
        console.error('Error updating role:', error.message);
      } else {
        // navigate to home or root once role saved
        // @ts-ignore
        navigation.navigate('Home');
      }
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Select Your Role</Text>
      <RadioButton.Group onValueChange={(value) => setSelectedRole(value)} value={selectedRole || ''}>
        {roles.map((role) => (
          <RadioButton.Item
            key={role}
            label={role.charAt(0).toUpperCase() + role.slice(1)}
            value={role}
          />
        ))}
      </RadioButton.Group>
      <Button
        mode="contained"
        onPress={saveRole}
        disabled={!selectedRole || loading}
        style={{ marginTop: 20 }}
      >
        Save Role
      </Button>
    </View>
  );
}
