import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <Text variant="headlineMedium">Welcome to Eagle Scout App</Text>
      <Text style={{ marginTop: 8, marginBottom: 16 }}>
        Manage your eagle scout journey with ease.
      </Text>
      <Button mode="contained" onPress={() => navigation.navigate('portal')}>
        Explore Projects
      </Button>
    </View>
  );
}
