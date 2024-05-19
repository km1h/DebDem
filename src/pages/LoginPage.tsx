import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../components/NavigationTypes';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import PhoneInput from "react-native-phone-number-input";

type LoginPageNavigationProp = NavigationProp<RootStackParamList, 'LoginPage'>;

interface LoginPageProps {
  navigation: LoginPageNavigationProp;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigation }) => {

  const [rawPhoneNumber, setRawPhoneNumber] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const phoneInput = useRef<PhoneInput>(null);

  const [confirm, setConfirm] = useState<void | FirebaseAuthTypes.ConfirmationResult>();
  const [code, setConfirmationCode] = useState<string>('');

  // Check if user is already logged in
  useEffect(() => {
    auth().signOut();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const onAuthStateChanged = (user: any) => {
    if (user) {
      navigation.navigate('WorldPage');
    }
  };

  // Handle login and starts phone number verification process
  async function handleLogin() {
    if (!phoneNumber) return;
    console.log(phoneNumber.toString());
    const confirmation = await auth()
    .signInWithPhoneNumber(phoneNumber.toString())
    .catch((error: any) => Alert.alert('Invalid phone number.'));
    setConfirm(confirmation);
  };

  // Handle confirmation of phone number
  async function handleConfirm() {
    if (confirm) {
      await confirm
      .confirm(code)
      .catch((error: any) => {
        Alert.alert('Invalid code.');
        console.log(error);
      });
    }
  }
  
  if (!confirm) {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>
          DebDem
        </Text>
        <PhoneInput
          ref={phoneInput}
          defaultValue={rawPhoneNumber}
          defaultCode="US"
          layout="first"
          onChangeText={(text) => {
            setRawPhoneNumber(text);
          }}
          onChangeFormattedText={(text) => {
            setPhoneNumber(text);
          }}
          withDarkTheme
          withShadow
          autoFocus
          containerStyle={{width: '100%'}}
        />
        
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <View>
              <Text style={styles.loginButtonText}>Enter</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        DebDem
      </Text>
      <TextInput style={styles.input} onChangeText={setConfirmationCode}
        placeholder="Confirmation Code"
      />
      
      <Pressable style={styles.loginButton} onPress={handleConfirm}>
        <View>
            <Text style={styles.loginButtonText}>Enter</Text>
        </View>
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
