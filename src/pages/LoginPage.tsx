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
    <View style={styles.container}>
      <Text style={styles.titleText}>
        DebDem
      </Text>
      <TextInput style={styles.input}
        placeholder="Username"
      />
      <TextInput style={styles.input}
        placeholder="Password"
      />
      
      <Pressable style={styles.loginButton} onPress={handleLogin}>
        <View>
            <Text style={styles.loginButtonText}>Log In</Text>
        </View>
      </Pressable>
      <Pressable>
        <Text>
          No Account? Sign up!
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  titleText: {
    marginBottom: 100,
    fontSize: 50,
    color: 'rgb(75, 78, 109)'
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(119, 156, 171, 0.30)',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
  },
  loginButton: {
    marginTop: 20,
    borderRadius: 10,
    width: '25%',
    height: '4%',
    backgroundColor: 'rgb(75, 78, 109)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
  },
});

export default LoginPage;
