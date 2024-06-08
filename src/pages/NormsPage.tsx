import React, { useState, useEffect, } from 'react';
import {ScrollView, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import { fetchUser } from '../database/Fetch';
import { User } from '../database/Structures';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../components/NavigationTypes';

type NormsPageNavigationProp = NavigationProp<RootStackParamList, 'NormsPage'>;

interface NormsPageProps {
  navigation: NormsPageNavigationProp;
}

const ProfilePage: React.FC = () => {
  const navigation = useNavigation<NormsPageNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.titleText}>
          I agree to uphold the norms of the community.
        </Text>
        <Text style={styles.descriptionText}>
          I will be respectful and kind to all members of the community.
        </Text>
        <Text style={styles.descriptionText}>
          I will not share any personal information with other members of the community.
        </Text>
        <Text style={styles.descriptionText}>
          I will avoid pointed and aggressive language.
        </Text>
        <Text style={styles.descriptionText}>
          I will not share any inappropriate content.
        </Text>
      </View>
      <View style={styles.scrollContainter}>
        <TouchableOpacity style={styles.agreeButton} onPress={() => navigation.navigate("WorldPage")}>
          <Text style={styles.agreeButtonText}>Agree</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: '50%',
    color: 'rgb(75, 78, 109)',
    fontSize: 32,
    marginLeft: 10,
    marginBottom: 10,
  },
  descriptionText: {
    color: 'rgb(50, 52, 70)',
    fontSize: 18,
    fontStyle: 'italic',
    marginLeft: 10,
    marginBottom: 3,
  },
  titleBox: {
    borderBottomColor: 'rgba(39, 98, 155, 0.80)',
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
  agreeButton: {
    marginTop: 20,
    borderRadius: 10,
    width: '25%',
    height: '18%',
    backgroundColor: 'rgb(39, 150, 109)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf:'center'
  },
  agreeButtonText: {
    color: 'white',
  },
});

export default ProfilePage;