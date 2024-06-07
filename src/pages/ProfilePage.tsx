import React, { useState, useEffect, } from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import { fetchUser } from '../database/Fetch';
import { User } from '../database/Structures';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User>();

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
          <Text style={styles.nameContainer}>{user?.firstName}</Text>
          <Text style={styles.nameContainer}>{user?.lastName}</Text>
        </View>
        <Text style={{alignSelf: 'center'}}>{user?.phoneNumber}</Text>
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
    height: 40,
    backgroundColor: 'rgba(119, 156, 171, 0.30)',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    width: '40%',
  }
});

export default ProfilePage;