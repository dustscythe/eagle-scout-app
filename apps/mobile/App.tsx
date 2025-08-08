import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { supabase } from './lib/supabaseClient';

import HomeScreen from './screens/HomeScreen';
import ProjectPortalScreen from './screens/ProjectPortalScreen';

import CalendarScreen from './screens/CalendarScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthScreen from './screens/AuthScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [roleSelected, setRoleSelected] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'portal', title: 'Projects', icon: 'format-list-bulleted' },
    { key: 'requirements', title: 'Requirements', icon: 'check-circle-outline' },
    { key: 'calendar', title: 'Calendar', icon: 'calendar' },
    { key: 'profile', title: 'Profile', icon: 'account' },
  ]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    portal: ProjectPortalScreen,
    requirements: RequirementsScreen,
    calendar: CalendarScreen,
    profile: ProfileScreen,
  });

  if (!session) {
    return <AuthScreen />;
  }

  if (!roleSelected) {
    return <RoleSelectionScreen onRoleSelected={() => setRoleSelected(true)} />;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
        />
      </NavigationContainer>
    </PaperProvider>
  );
}
