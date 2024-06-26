import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import WorldPage from './src/pages/WorldPage';
import JoinedRoomsPage from './src/pages/JoinedRoomsPage';
import ProfilePage from './src/pages/ProfilePage';
import LoginPage from './src/pages/LoginPage';
import JoinedRoomPage from './src/pages/JoinedRoom';
import InvitesPage from './src/pages/InvitesPage';
import LoginPage from './src/pages/LoginPage.tsx';
import NotJoinedRoomPage from './src/pages/NotJoinedRoom';
import NavBar from './src/components/NavBar';
import { RootStackParamList } from './src/components/NavigationTypes';
import { LogBox } from "react-native"

declare global {
  var userId: string;
}

const Stack = createNativeStackNavigator<RootStackParamList>();
LogBox.ignoreAllLogs(true);

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
      <Stack.Screen name="InvitesPage" component={InvitesPage} options={{ headerShown: false}}/>
      <Stack.Screen name="NormsPage" component={NormsPage} options={{ headerShown: false}}/>
      <Stack.Screen name="NotJoinedRoomPage" component={NotJoinedRoomPage} options={{ headerShown: false}}/>
    </Stack.Navigator>
  </NavigationContainer>
  );
}

export default App;
