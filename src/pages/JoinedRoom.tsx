import React, { useState, useEffect, } from 'react';
import {ScrollView, Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import roomsData from '../data/joinedRooms.json'
import { RootStackParamList } from '../components/NavigationTypes';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';

type JoinedRoomRouteProp = RouteProp<RootStackParamList, 'JoinedRoomPage'>;
type JoinedRoomNavigationProp = NavigationProp<RootStackParamList, 'JoinedRoomPage'>;

interface JoinedRoomProps {
    route: JoinedRoomRouteProp;
  }

const JoinedRoomPage: React.FC<JoinedRoomProps> = ({ route }) => {
    const roomId = route.params.data.roomId
    const navigation = useNavigation<JoinedRoomNavigationProp>();

    const handleGoBack = () => {
        navigation.goBack();
      };

    return (
        <View style={styles.container}>
            <View style={styles.titleBox}>
                <TouchableOpacity onPress={() => handleGoBack()}>
                    <Text> GO Back</Text>
                </TouchableOpacity>
                <Text style={styles.titleText}>
                World
                </Text>
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
});

export default JoinedRoomPage;