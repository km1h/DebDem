import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import WorldPage from './src/pages/WorldPage';
import RoomsPage from './src/pages/RoomsPage';
import ProfilePage from './src/pages/ProfilePage';
import LoginPage from './src/pages/LoginPage';
import NavBar from './src/components/NavBar';
import { RootStackParamList } from './src/components/NavigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {

  return (
    <NavigationContainer>
    <Stack.Navigator
      initialRouteName="LoginPage"
    >
      <Stack.Screen name="WorldPage" component={NavBar} />
      <Stack.Screen name="RoomsPage" component={RoomsPage} />
      <Stack.Screen name="ProfilePage" component={ProfilePage} />
      <Stack.Screen name="LoginPage" component={LoginPage} />

    </Stack.Navigator>
  </NavigationContainer>
  );
}

export default App;
