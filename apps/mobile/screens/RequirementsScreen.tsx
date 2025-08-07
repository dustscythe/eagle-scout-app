import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { List, Text } from 'react-native-paper';
import { supabase } from '../lib/supabaseClient';

interface ChecklistItem {
  id: string;
  title: string;
  description: string | null;
  requires_signature: boolean | null;
}

export default function RequirementsScreen() {
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('checklist_items')
        .select('*')
        .order('sort', { ascending: true });
      if (!error && data) {
        setItems(data as ChecklistItem[]);
      }
    };
    fetchItems();
  }, []);

  return (
    <ScrollView>
      <List.Section>
        <List.Subheader>Eagle Requirements</List.Subheader>
        {items.map((item) => (
          <List.Item
            key={item.id}
            title={item.title}
            description={item.description || ''}
            onPress={() => {
              // Could navigate to a details screen
            }}
          />
        ))}
      </List.Section>
    </ScrollView>
  );
}
