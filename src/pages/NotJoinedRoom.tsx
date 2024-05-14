import React, { useState, useEffect, } from 'react';
import {ScrollView, Text, StyleSheet, View, TouchableOpacity, Image, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import roomsData from '../data/joinedRooms.json'
import { RootStackParamList } from '../components/NavigationTypes';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';

type NotJoinedRoomRouteProp = RouteProp<RootStackParamList, 'NotJoinedRoomPage'>;
type NotJoinedRoomNavigationProp = NavigationProp<RootStackParamList, 'NotJoinedRoomPage'>;

interface NotJoinedRoomProps {
    route: NotJoinedRoomRouteProp;
}

const NotJoinedRoomPage: React.FC<NotJoinedRoomProps> = ({ route }) => {
    const roomId = route.params.data.roomId // for future use when pulling room specific data from backend
    const roomContent = route.params.data.roomContent
    const navigation = useNavigation<NotJoinedRoomNavigationProp>();

    const handleGoBack = () => {
        navigation.goBack();
    };


    return (
        <View style={styles.container}>
            <View style={styles.titleBox}>
                <TouchableOpacity onPress={() => handleGoBack()} style={{marginBottom: 10}}>
                    <Ionicons name='arrow-back-outline' size={30}/>
                </TouchableOpacity>
                <Text style={styles.titleText}>
                    {roomContent}
                </Text>
            </View>
            <ScrollView style={{marginTop: 95}}>
               <Text>Description</Text>
            </ScrollView >
            <TouchableOpacity style={styles.uploadButton}>
                <Text>Upload</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(239, 198, 155, 0.30)',
  },
  titleText: {
    color: 'rgb(75, 78, 109)',
    fontSize: 30,
    marginLeft: 10,
  }, 
  titleBox: {
    borderBottomColor: 'rgba(119, 156, 171, 0.30)',
    borderBottomWidth: 4,
    top: 80,
    width: '100%',
  },
  uploadButton: {
    borderColor: 'black',
    borderWidth: 1,
    width: '20%',
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 198, 155, 0.60)',
    borderRadius: 5,
    alignSelf: 'center',
    bottom: 35
  }
});

export default NotJoinedRoomPage;