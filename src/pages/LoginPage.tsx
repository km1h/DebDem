import React, { useState } from 'react';
import { Image, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../components/NavigationTypes';

type LoginPageNavigationProp = NavigationProp<RootStackParamList, 'LoginPage'>;

interface LoginPageProps {
  navigation: LoginPageNavigationProp;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigation }) => {

  const handleLogin = async () => {
    navigation.navigate('WorldPage')
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
      />
      <TextInput
        placeholder="Password"
      />
      
      <Pressable onPress={handleLogin}>
        <View>
            <Text >Log In</Text>
        </View>
      </Pressable>
    
    </View>
  );
};

export default LoginPage;
