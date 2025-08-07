import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { supabase } from '../lib/supabaseClient';

export default function LeaderModerationScreen() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .in('status', ['pending_review', 'approved']);
    if (!error) {
      setProjects(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const updateStatus = async (projectId: string, status: string) => {
    const { error } = await supabase
      .from('projects')
      .update({ status })
      .eq('id', projectId);
    if (!error) {
      // refresh list
      fetchProjects();
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card style={{ marginBottom: 12 }}>
      <Card.Title title={item.title} subtitle={`Status: ${item.status}`} />
      <Card.Content>
        <Text>{item.description}</Text>
      </Card.Content>
      <Card.Actions>
        {item.status !== 'approved' && (
          <Button onPress={() => updateStatus(item.id, 'approved')}>Approve</Button>
        )}
        {item.status !== 'closed' && (
          <Button onPress={() => updateStatus(item.id, 'closed')}>Close</Button>
        )}
      </Card.Actions>
    </Card>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Moderate Projects
      </Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={fetchProjects}
        ListEmptyComponent={!loading ? <Text>No pending projects.</Text> : null}
      />
    </View>
  );
}
