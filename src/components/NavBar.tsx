import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WorldPage from '../pages/WorldPage';
import RoomsPage from '../pages/RoomsPage';
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
            backgroundColor: 'rgba(61, 28, 81, 0.7)',
          }
        ],
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'World') {
            iconName = focused ? 'World' : 'earth';
          } else if (route.name === 'Rooms') {
            iconName = focused ? 'Rooms' : 'copy-sharp';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'Person' : 'person-circle';
          }

          return <Ionicons name={iconName ?? 'help'} size={size + 4} color={color} />;
        },
      })}
    >
      <Tab.Screen name="World" component={WorldPage} />
      <Tab.Screen name="Rooms" component={RoomsPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  ) as React.ReactElement;
};

export default NavBar;
