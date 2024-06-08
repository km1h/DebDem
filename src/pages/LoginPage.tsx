import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../components/NavigationTypes';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import PhoneInput from "react-native-phone-number-input";
import { postUser } from '../database/Post';

type LoginPageNavigationProp = NavigationProp<RootStackParamList, 'LoginPage'>;

interface LoginPageProps {
  navigation: LoginPageNavigationProp;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigation }) => {

  const [rawPhoneNumber, setRawPhoneNumber] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const phoneInput = useRef<PhoneInput>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  // const [confirm, setConfirm] = useState<void | FirebaseAuthTypes.ConfirmationResult>();
  const [confirm, setConfirm] = useState<void | FirebaseAuthTypes.ConfirmationResult>();
  const [verified, setVerified] = useState(false);
  const [code, setConfirmationCode] = useState<string>('');

  // Check if user is already logged in
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const onAuthStateChanged = (user: any) => {
    if (user) {
      globalThis.userId = user.uid;
      navigation.navigate('NormsPage');
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
    setVerified(true);
  };

  // Handle confirmation of phone number
  async function handleConfirm() {
    if (confirm) {
      await confirm
      .confirm(code)
      .catch((error: any) => {
        Alert.alert('Invalid code.');
        console.log(error);
      }).then(async (result) => {
        if (!result) return;
        let user: FirebaseAuthTypes.User = result.user;
        let phoneNumber = user.phoneNumber ? user.phoneNumber : '';
        postUser({
          "userId": user.uid,
          "phoneNumber": phoneNumber,
          "firstName": firstName,
          "lastName": lastName
        });
        setVerified(false);
      });
    }
  }
  
  if (!verified) {
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
        <View style={{
          flexDirection: 'row',
          marginTop: 20,
          justifyContent: 'space-between',
          width: '100%'
        }}>
          <TextInput style={styles.nameInput}
            placeholder="First Name"
            onChangeText={(text) => {
              setFirstName(text);
            }}
          />

          <TextInput style={styles.nameInput}
            placeholder="Last Name"
            onChangeText={(text) => {
              setLastName(text);
            }}
          />
        </View>


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
  nameInput: {
    height: 40,
    backgroundColor: 'rgba(119, 156, 171, 0.30)',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    width: '40%',
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
