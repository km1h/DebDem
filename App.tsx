import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import WorldPage from './src/pages/WorldPage';
import JoinedRoomsPage from './src/pages/JoinedRoomsPage';
import ProfilePage from './src/pages/ProfilePage';
import LoginPage from './src/pages/LoginPage';
import JoinedRoomPage from './src/pages/JoinedRoom';
import NavBar from './src/components/NavBar';
import { RootStackParamList } from './src/components/NavigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {

  return (
    <NavigationContainer>
    <Stack.Navigator
      initialRouteName="LoginPage"
    >
      <Stack.Screen name="WorldPage" component={NavBar} options={{ headerShown: false }}/>
      <Stack.Screen name="JoinedRoomsPage" component={JoinedRoomsPage} options={{ headerShown: false }}/>
      <Stack.Screen name="ProfilePage" component={ProfilePage} options={{ headerShown: false }}/>
      <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false}}/>
      <Stack.Screen name="JoinedRoomPage" component={JoinedRoomPage} options={{ headerShown: false}}/>

    </Stack.Navigator>
  </NavigationContainer>
  );
}

export default App;
