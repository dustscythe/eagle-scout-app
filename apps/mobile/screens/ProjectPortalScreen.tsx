import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Card, Button, Text, ActivityIndicator, TextInput } from 'react-native-paper';
import { supabase } from '../lib/supabaseClient';

interface Project {
  id: string;
  title: string;
  description: string;
  funding_amount: number | null;
  status: string;
}

export default function ProjectPortalScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    let query = supabase.from('projects').select('*');
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }
    // Only show approved projects by default
    const { data, error } = await query.eq('status', 'approved');
    if (!error) {
      setProjects((data || []) as Project[]);
    }
    setLoading(false);
  };

  const applyToProject = async (projectId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) {
      alert('You must be signed in as a scout to apply');
      return;
    }
    const { error } = await supabase.from('project_applications').insert({
      project_id: projectId,
      scout_id: userId,
      status: 'applied',
    });
    if (error) {
      alert('Failed to apply: ' + error.message);
    } else {
      alert('Application submitted!');
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  return (
    <View style={{ flex: 1, padding: 8 }}>
      <TextInput
        label="Status filter (optional)"
        value={statusFilter}
        onChangeText={setStatusFilter}
        placeholder="approved, pending_review, closed"
        style={{ marginBottom: 8 }}
      />
      <Button mode="outlined" onPress={fetchProjects} style={{ marginBottom: 12 }}>
        Apply Filters
      </Button>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 12 }}>
            <Card.Title
              title={item.title}
              subtitle={item.funding_amount ? `$${item.funding_amount}` : undefined}
            />
            <Card.Content>
              <Text>
                {item.description.length > 120
                  ? `${item.description.slice(0, 120)}...`
                  : item.description}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => applyToProject(item.id)}>Apply</Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}
