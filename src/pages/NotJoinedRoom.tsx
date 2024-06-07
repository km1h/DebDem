import React, { useEffect, useState } from 'react';
import {ScrollView, Text, StyleSheet, View, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../components/NavigationTypes';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { ImagePickerResponse, CameraOptions, launchCamera } from 'react-native-image-picker';
import Modal from 'react-native-modal';

import { Room } from '../database/Structures';
import { fetchRoom } from '../database/Fetch';


import { constructAndStoreVideo, postVideo, addVideoToRoom } from '../database/Post'; 

type NotJoinedRoomRouteProp = RouteProp<RootStackParamList, 'NotJoinedRoomPage'>;
type NotJoinedRoomNavigationProp = NavigationProp<RootStackParamList, 'NotJoinedRoomPage'>;

interface NotJoinedRoomProps {
    route: NotJoinedRoomRouteProp;
}

const NotJoinedRoomPage: React.FC<NotJoinedRoomProps> = ({ route }) => {
    const roomId = route.params.data.roomId;
    const navigation = useNavigation<NotJoinedRoomNavigationProp>();
    const [room, setRoom] = useState<Room>();
    const [uploading, setUploading] = useState(false);
    const [finishedUpload, setFinishedUpload] = useState(false);

    useEffect(() => {
      fetchRoom(roomId).then(setRoom);
    } , []);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const recordVideo = () => {

      const options: CameraOptions = {
        mediaType: 'video',
        videoQuality: 'medium',
      };

      console.log('Recording video...');

      console.log("options: ", options);

      launchCamera(options, (response: ImagePickerResponse) => {
        console.log('Response: ', response);
        if (response.didCancel) {
          console.log('User cancelled video recording');
        } else if (response.errorCode) {
          console.log('Video recording error: ', response.errorCode);
        } else if (response.assets && response.assets.length > 0) {
          console.log('Video recorded: ', response.assets[0].uri);
          const videoUri = response.assets[0].uri;
          if (videoUri) {
            uploadVideo(videoUri);
          }
        }
      });

      
    };

    const uploadVideo = async (uri: string) => {
      setUploading(true);

      let video = await constructAndStoreVideo(uri);
      if (video) {
        await postVideo(video);
        await addVideoToRoom(roomId, video.videoId, globalThis.userId);
      } else {
        Alert.alert('Upload failed', 'Sorry, something went wrong.');
      }
      setFinishedUpload(true);
      setUploading(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleBox}>
                <TouchableOpacity onPress={() => handleGoBack()} style={{marginBottom: 10}}>
                    <Ionicons name='arrow-back-outline' size={30}/>
                </TouchableOpacity>
                <Text style={styles.titleText}>
                    {room.title}
                </Text>
            </View>
            <ScrollView style={{marginTop: 95}}>
               <Text>{room.description}</Text>
            </ScrollView >
            <TouchableOpacity style={styles.uploadButton} onPress={recordVideo}>
                <Text>Record</Text>
                {uploading && <ActivityIndicator size="large" color="#0000ff" />}
                {finishedUpload && 
                  <Modal
                  isVisible={finishedUpload} 
                  animationIn="slideInUp" 
                  animationOut="slideOutDown" 
                  style={styles.modalContainer}
                  onBackdropPress={() => (
                    setFinishedUpload(false)
                  )}
                  >
                    <Text style={{padding: 5, alignSelf: 'center', fontSize: 25}}>
                      Head over to your Joined Rooms to check out your video!
                    </Text>
                  </Modal>
                }
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
  }, 
  modalContainer: {
    paddingHorizontal: 20,
  },
});

export default NotJoinedRoomPage;