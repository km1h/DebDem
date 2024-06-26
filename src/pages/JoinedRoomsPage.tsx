import React, { useState, useEffect, } from 'react';
import {ScrollView, Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../components/NavigationTypes';

import firestore from '@react-native-firebase/firestore';

import { fetchAllRooms } from '../database/Fetch';
import { Room } from '../database/Structures';
import { ROOM_COLLECTION } from '../database/Constants';

type JoinedRoomsPageNavigationProp = NavigationProp<RootStackParamList, 'JoinedRoomsPage'>;


const RoomsPage: React.FC = () => {
  const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);
  const [time, setTime] = useState<number>(0);

  const navigation = useNavigation<JoinedRoomsPageNavigationProp>();

  const handleRoomPress = (roomId: string) => {
    navigation.navigate('JoinedRoomPage', {
      data: {
        roomId: roomId
      }
    })
  }

  useEffect(() => {
    let myUserId = globalThis.userId;
    fetchAllRooms().then(rooms => {
      setJoinedRooms(rooms.filter(room => room.userIds.includes(myUserId)));
    });
  }, []);

  useEffect(() => {
    firestore().collection(ROOM_COLLECTION).onSnapshot(snapshot => {
      let joinedRooms = snapshot.docs.map(doc => doc.data() as Room).filter(room => room.userIds.includes(globalThis.userId));
      setJoinedRooms(joinedRooms);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const countdown = (timeInitialized: number) => {
    let date = new Date(timeInitialized + 1000*60*60*24*7 - time);
    return date.toUTCString().split(' ')[4];
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.titleText}>
          Rooms
        </Text>
      </View>
      <ScrollView style={styles.scrollContainter}>

      {joinedRooms.map((room) => (
          <TouchableOpacity style={styles.roomContainer} key={room.roomId} onPress={() => handleRoomPress(room.roomId)}>
              <LinearGradient
                colors={['rgba(239, 198, 155, 0.60)', 'rgba(119, 156, 171, 0.10)', 'rgba(0, 0, 0, 0)']}
                style={{height: 100, borderRadius: 10, width: '100%', justifyContent: 'space-between'}}
              >
                <Text style={styles.roomText}>
                  {room.title}
                </Text>
                <Text style={styles.timerText}>
                  Time Remaining: {countdown(room.timeInitialized)}
                </Text>
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
  timerText: {
    marginLeft: 10,
  }
});

export default RoomsPage;