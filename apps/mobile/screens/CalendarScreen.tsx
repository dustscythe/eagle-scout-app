import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { List, ActivityIndicator } from 'react-native-paper';
import { supabase } from '../lib/supabaseClient';

interface EventItem {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  location: string | null;
  type: string | null;
}

export default function CalendarScreen() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_at', { ascending: true })
        .limit(50);
      if (!error && data) {
        setEvents(data as EventItem[]);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <List.Item
          title={`${new Date(item.start_at).toLocaleDateString()} - ${item.title}`}
          description={item.description || ''}
        />
      )}
    />
  );
}
