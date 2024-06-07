import React, { useState, useEffect, } from 'react';
import {ScrollView, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../components/NavigationTypes';
import invitesData from '../data/invitedRooms.json';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchAllRooms } from '../database/Fetch';
import { Room } from '../database/Structures';

type InvitesPageNavigationProp = NavigationProp<RootStackParamList, 'InvitesPage'>;

const InvitesPage: React.FC = () => {
    const [invites, setInvites] = useState<Room[]>([]);
    const navigation = useNavigation<InvitesPageNavigationProp>();

    useEffect(() => {
      let myUserId = globalThis.userId;
      fetchAllRooms().then(rooms => {
        setInvites(rooms.filter(room => !room.userIds.includes(myUserId)));
      });
    });

    const handleRoomPress = (roomId: string) => {
        navigation.navigate('NotJoinedRoomPage', {
          data: {
            roomId: roomId,
          }
        })
    }

    const handleGoBack = () => {
        navigation.goBack()
    }

    return (
    <View style={styles.container}>
        <View style={styles.titleBox}>
            <TouchableOpacity onPress={() => handleGoBack()} style={{marginBottom: 10}}>
                    <Ionicons name='arrow-back-outline' size={30}/>
            </TouchableOpacity>
            <Text style={styles.titleText}>
                Invites
            </Text>
        </View>
        <ScrollView style={styles.scrollContainter}>
            {invites.map((room, index) => (
            <TouchableOpacity style={styles.roomContainer} key={room.roomId} onPress={() => handleRoomPress(room.roomId)}>
                <LinearGradient
                    colors={['rgba(239, 198, 155, 0.60)', 'rgba(119, 156, 171, 0.10)', 'rgba(0, 0, 0, 0)']}
                    style={{height: 100, borderRadius: 10, width: '100%', justifyContent: 'space-between'}}
                >
                    <Text style={styles.roomText}>
                    {room.title}
                    </Text>
                    <TouchableOpacity style={styles.uploadButton}>
                        <Text>Upload</Text>
                    </TouchableOpacity>
                </LinearGradient>

                </TouchableOpacity>
            ))}
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
  roomContainer: {
    height: 100,
    marginBottom: 30
  },
  roomText: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 20
  },
  uploadButton: {
    borderColor: 'black',
    borderWidth: 1,
    width: '20%',
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 198, 155, 0.60)',
    borderRadius: 5,
    alignSelf: 'center'
  }
});

export default InvitesPage;