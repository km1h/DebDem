import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WorldPage from '../pages/WorldPage';
import RoomsPage from '../pages/JoinedRoomsPage';
import ProfilePage from '../pages/ProfilePage';

const Tab = createBottomTabNavigator();

const NavBar: React.FC = () => {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabelStyle: {
          display: "none"
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "white",
        tabBarStyle: [
          { 
            backgroundColor: 'rgba(119, 156, 171, 0.30)',
            borderTopColor: 'rgba(239, 198, 155, 0.80)',
            borderTopWidth: 4
          }
        ],
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'World') {
            iconName = focused ? 'World' : 'earth';
          } else if (route.name === 'Rooms') {
            iconName = focused ? 'Rooms' : 'copy-sharp';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'Person' : 'add-outline';
          }

          return <Ionicons name={iconName ?? 'help'} size={size + 4} color={color} />;
        },
      })}
    >
      <Tab.Screen name="World" component={WorldPage} options={{ headerShown: false }}/>
      <Tab.Screen name="Rooms" component={RoomsPage} options={{ headerShown: false }}/>
      <Tab.Screen name="Profile" component={ProfilePage} options={{ headerShown: false }}/>
    </Tab.Navigator>
  ) as React.ReactElement;
};

export default NavBar;
