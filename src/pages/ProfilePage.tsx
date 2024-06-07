import React, { useState, useEffect, } from 'react';
import {ScrollView, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import { fetchUser } from '../database/Fetch';
import { User } from '../database/Structures';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../components/NavigationTypes';
type ProfilePageNavigationProp = NavigationProp<RootStackParamList, 'ProfilePage'>;

interface ProfilePageProps {
  navigation: ProfilePageNavigationProp;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User>();
  const navigation = useNavigation<ProfilePageNavigationProp>();

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUser(globalThis.userId);
        console.log(data);

        if (!data) {
          console.error('No User Found');
          return;
        }
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();

      globalThis.userId = '';
      navigation.navigate('LoginPage');

      console.log('User signed out!');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.titleText}>
          Profile
        </Text>
      </View>
      <ScrollView style={styles.scrollContainter}>
        <View style={{          
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginBottom: 20
        }}>
          <View style={styles.nameContainer}> 
            <Text style={{fontSize: 20, alignSelf: 'center'}}>{user?.firstName}</Text>
          </View>
          <View style={styles.nameContainer}> 
            <Text style={{fontSize: 20, alignSelf: 'center'}}>{user?.lastName}</Text>
          </View>
        </View>
        <Text style={{fontSize: 20, alignSelf: 'center'}}>{user?.phoneNumber}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(119, 156, 171, 0.30)',
  },
  titleText: {
    color: 'rgb(75, 78, 109)',
    fontSize: 50,
    marginLeft: 10
  }, 
  titleBox: {
    borderBottomColor: 'rgba(239, 198, 155, 0.80)',
    borderBottomWidth: 4,
    top: 65,
    width: '100%',
  },
  scrollContainter: {
    marginTop: 80,
  },
  nameContainer: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: 'rgba(119, 156, 171, 0.30)',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    width: '40%',
  },
  logoutButton: {
    marginTop: 20,
    borderRadius: 10,
    width: '25%',
    height: '30%',
    backgroundColor: 'rgb(75, 78, 109)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf:'center'
  },
  logoutButtonText: {
    color: 'white',
  },
});

export default ProfilePage;