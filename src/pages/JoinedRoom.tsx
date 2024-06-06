import React, { useState, useEffect, } from 'react';
import {ScrollView, Text, StyleSheet, View, TouchableOpacity, ActivityIndicator, TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../components/NavigationTypes';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Video from 'react-native-video';

<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
=======
import { fetchVideoDownloadURLs } from '../database/CloudStorage';
import { fetchVideosFromRoom, fetchVideo, fetchComments } from '../database/Firestore';

>>>>>>> Stashed changes
=======
import { fetchVideosFromRoom, fetchVideoDownloadURLs, fetchCommentsFromVideo, fetchRoom } from '../database/Fetch';
import { Video as VideoStruct, Comment, Room } from '../database/Structures';
import { postComment } from '../database/Post';
>>>>>>> Stashed changes

type JoinedRoomRouteProp = RouteProp<RootStackParamList, 'JoinedRoomPage'>;
type JoinedRoomNavigationProp = NavigationProp<RootStackParamList, 'JoinedRoomPage'>;

interface JoinedRoomProps {
    route: JoinedRoomRouteProp;
}

const JoinedRoomPage: React.FC<JoinedRoomProps> = ({ route }) => {
    const roomId = route.params.data.roomId // for future use when pulling room specific data from backend
<<<<<<< Updated upstream
    const roomContent = route.params.data.roomContent
    const [commentsVisible, setCommentsVisible] = useState(false);
    const navigation = useNavigation<JoinedRoomNavigationProp>();
    const [videos, setVideos] = useState([]);
    const [comments, setComments] = useState([]);

    const [videoUrls, setVideoUrls] = useState([]);
    const [loading, setLoading] = useState(true);
=======
    const [room, setRoom] = useState<Room>()
    const navigation = useNavigation<JoinedRoomNavigationProp>();

    const [commentsVisible, setCommentsVisible] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [haveComments, setHaveComments] = useState(false);
    const [madeComment, setMadeComment] = useState<string>();

    const [videos, setVideos] = useState<VideoStruct[]>([]);
    const [videoUrls, setVideoUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
>>>>>>> Stashed changes

    useEffect(() => {
        const fetchVideos = async () => {
          try {
<<<<<<< Updated upstream
            // Fetch video paths from Firestore -- assuming the video urls are stored here, based on room specific ID's
            const roomDoc = await firestore().collection('videos').doc(roomId).get();
            const videoPaths = roomDoc.data().videos;
    
            // Fetch video URLs from Firebase Storage
            const videoUrlsPromises = videoPaths.map(async (path: string | undefined) => {
              const url = await storage().ref(path).getDownloadURL();
              return url;
            });
    
            const urls = await Promise.all(videoUrlsPromises);
=======
            const video_data = await fetchVideosFromRoom(roomId);
            console.log(video_data);

            if (!video_data) {
              console.error('No video paths found');
              setVideoUrls([]);
              setLoading(false);
              return;
            }

            const urls = await fetchVideoDownloadURLs(video_data.videos.paths);
>>>>>>> Stashed changes
            setVideoUrls(urls);
            setVideos(video_data.videos);
            setLoading(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        };

        const getRoomData = async () => {
          try {
            const data = await fetchRoom(roomId);
            console.log(data);
  
            if (!data) {
              console.error('No room found');
              return;
            }
  
            setRoom(data);
  
          } catch (error) {
            console.error(error);
          }
        };

        getRoomData();
        fetchVideos();
      }, [roomId]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const toggleComments = (videoId?: string) => {
        setCommentsVisible(!commentsVisible)
        
<<<<<<< Updated upstream
        const getComments = async () => {
          try {
            const comments_data = fetchComments(videoId);

            if (!comments_data) {
              console.error('No comments found');
            }
    
            setComments(comments_data);
          } catch(error) {
            console.error(error);
=======
        if (videoId) {
          const getComments = async () => {
            try {
              const comments_data = await fetchCommentsFromVideo(videoId);
              setComments(comments_data);
              setHaveComments(true);
            } catch(error) {
              console.error(error);
              setHaveComments(false);
            }
>>>>>>> Stashed changes
          }
          getComments();
        } else {
          setHaveComments(false); // assumed that if no param is passed in, the comments are being toggled OFF - thus clearing that we have comments
        }
    };

<<<<<<< Updated upstream
=======
    const sendComment = () => {
      let newComment : Comment = {
        commentId: generateUniqueId(),
        content: madeComment,
        userId: globalThis.userId,
        timePosted: new Date().toISOString()
      }

      postComment(newComment);
    };

    const generateUniqueId = (): string => {
      return Math.random().toString(36).substring(2, 11);
>>>>>>> Stashed changes
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleBox}>
                <TouchableOpacity onPress={() => handleGoBack()} style={{marginBottom: 10}}>
                    <Ionicons name='arrow-back-outline' size={30}/>
                </TouchableOpacity>
                <Text style={styles.titleText}>
<<<<<<< Updated upstream
                    {roomContent}
=======
                    {room?.title}
>>>>>>> Stashed changes
                </Text>
            </View>
            <ScrollView style={{marginTop: 95}}>
                <Text> {room?.description} </Text>
                {loading ? ( <ActivityIndicator size="large" color="#0000ff" /> ) : (
                        videoUrls.map((url, index) => (
                          <View>
                            <Video
                              key={index}
                              source={{ uri: url }}
                              style={styles.video}
                              controls={true}
                              resizeMode="contain"
                            />
                            <TouchableOpacity onPress={() => toggleComments(videos.video.id)}>
                              <Text> Comments </Text>
                            </TouchableOpacity>
                          </View>
                        )))
                  }
            </ScrollView >
            <Modal
                isVisible={commentsVisible} 
                animationIn="slideInUp" 
                animationOut="slideOutDown" 
                style={styles.modalContainer}
                onBackdropPress={toggleComments}
            >
                <View style={styles.commentsWrapper}>
                    <View style={styles.commentTitleBox}>
                        <Text style={{marginTop: 10, fontSize: 30}}> Comments </Text>
                        <TouchableOpacity onPress={() => toggleComments()}>
                            <Text style={{marginTop: 10, fontSize: 30, marginRight: 5}} > X </Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <View> 
                            {haveComments ?
                              comments.map((comment, index) =>(
                                <View style={styles.commentContainer}>
                                  <Text>{comment.content}</Text>
                                </View>
                              ))
                            : 
                              <Text style={{marginTop: 10, marginLeft: 5}}> Empty for now </Text>
                            }

                        </View>
                    </ScrollView>
                    <View style={styles.makeCommentContainer}>
                        <TextInput style={styles.input}
                            placeholder="Join the discussion"
                            onChangeText={(text) => {
                              setMadeComment(text);
                            }}
                        />
                        <TouchableOpacity onPress={() => sendComment()}>
                            <Text style={{marginRight: 10, marginTop: 5}}> Send </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
  videosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'center'
  },
  video: {
    marginBottom: 15, 
    width: 150, 
    height: 220,
    margin: 10,
    borderRadius: 10,
  },
  modalContainer: {
    paddingHorizontal: 20,
  },
  commentsWrapper: {
    backgroundColor: 'rgb(119, 156, 171)',
    height: '70%',
    borderRadius: 10,
    borderColor: 'rgb(75, 78, 109)',
    borderWidth: 3
  },
  commentTitleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'rgb(75, 78, 109)',
    borderBottomWidth: 4,
    paddingHorizontal: 10
  },
  makeCommentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  commentContainer: {
    width: '80%',
    marginBottom: 10
  },
  input: {
    height: 30,
    width: '70%',
    backgroundColor: 'rgba(239, 198, 155, 0.70)',
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 10,
  }
});

export default JoinedRoomPage;