import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient';

export default function ProjectFormScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [funding, setFunding] = useState('');
  const [skills, setSkills] = useState('');
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSave = async () => {
    setLoading(true);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error(sessionError.message);
    }
    const userId = session?.user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }
    const { error } = await supabase.from('projects').insert({
      provider_id: userId,
      title,
      description,
      funding_amount: funding ? parseFloat(funding) : null,
      skills: skills ? skills.split(',').map((s) => s.trim()) : null,
      requirements_text: requirements,
      status: 'pending_review',
      created_by: userId,
    });
    if (error) {
      console.error('Error creating project:', error.message);
    } else {
      // navigate back to project portal after save
      // @ts-ignore
      navigation.goBack();
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>Create Project</Text>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="Funding Amount"
        value={funding}
        onChangeText={setFunding}
        keyboardType="numeric"
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="Skills (comma separated)"
        value={skills}
        onChangeText={setSkills}
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="Requirements / Notes"
        value={requirements}
        onChangeText={setRequirements}
        multiline
        style={{ marginBottom: 12 }}
      />
      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        disabled={loading || !title || !description}
        style={{ marginTop: 16 }}
      >
        Save Project
      </Button>
    </ScrollView>
  );
}
