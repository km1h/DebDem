import React, { useState, useEffect, } from 'react';
import {ScrollView, Text, StyleSheet, View, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../components/NavigationTypes';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Video from 'react-native-video';

import firestore from '@react-native-firebase/firestore';

import { fetchVideosFromRoom, fetchVideoDownloadURLs, fetchCommentsFromVideo, fetchRoom, fetchUser } from '../database/Fetch';
import { Video as VideoStruct, Comment, Room, User } from '../database/Structures';
import { getRandomId, postComment } from '../database/Post';
import { VIDEO_COLLECTION } from '../database/Constants';


type JoinedRoomRouteProp = RouteProp<RootStackParamList, 'JoinedRoomPage'>;
type JoinedRoomNavigationProp = NavigationProp<RootStackParamList, 'JoinedRoomPage'>;

interface JoinedRoomProps {
    route: JoinedRoomRouteProp;
}

const JoinedRoomPage: React.FC<JoinedRoomProps> = ({ route }) => {
    const roomId = route.params.data.roomId
    const [room, setRoom] = useState<Room>()
    const navigation = useNavigation<JoinedRoomNavigationProp>();

    const [commentsVisible, setCommentsVisible] = useState(false);
    const [commentVideoId, setCommentVideoId] = useState<string>();
    const [comments, setComments] = useState<Comment[]>([]);
    const [haveComments, setHaveComments] = useState(false);
    const [madeComment, setMadeComment] = useState<string>();

    const [videos, setVideos] = useState<VideoStruct[]>([]);
    const [videoUrls, setVideoUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchVideos = async () => {
          try {
            const videos = await fetchVideosFromRoom(roomId);
            console.log("retrieved videos")
            console.log(videos);

            if (!videos) {
              console.error('No video paths found');
              setVideoUrls([]);
              setLoading(false);
              return;
            }

            const urls = await fetchVideoDownloadURLs(videos);
            setVideoUrls(urls);
            setVideos(videos);
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

    // update comments
    useEffect(() => {
      firestore().collection(VIDEO_COLLECTION).onSnapshot(snapshot => {
        console.log('Video collection updated');
        if (!commentVideoId) return;
        console.log('Updating comments for video: ', commentVideoId);
        let updatedVideo = snapshot.docs.map(doc => doc.data() as VideoStruct).find(video => video.videoId === commentVideoId);
        console.log('Updated video: ', updatedVideo);
        if (!updatedVideo) {
          return;
        }
        console.log('Fetching comments for video: ', updatedVideo.videoId)
        fetchCommentsFromVideo(updatedVideo.videoId).then(async (comments) => {
          updateCommentUser(comments);
        });
      });

      const updateCommentUser = async (comments : Comment[]) => {
        setComments(await Promise.all(comments.map(async (comment) => {
          let user = await fetchUser(comment.userId);
          let updatedComment = comment;
          updatedComment.firstName = user.firstName;
          updatedComment.lastName = user.lastName;
          return updatedComment;
        })));
      }

    }, [commentVideoId]);

    const handleGoBack = () => {
        navigation.goBack();
    };



    const toggleComments = (videoId?: string) => {
      console.log('Toggling comments for video: ', videoId);
        setCommentsVisible(!commentsVisible)
        console.log('Comments visible: ', commentsVisible)
        
        if (videoId) {
          const getComments = async () => {
            try {
              console.log('Fetching comments for video: ', videoId)
              const comments_data = await fetchCommentsFromVideo(videoId);
              console.log('Comments for video: ', comments_data);
              setComments(comments_data);
              console.log('Comments: ', comments);
              setCommentVideoId(videoId);
              console.log('Comment video id: ', commentVideoId);
              setHaveComments(true);
            } catch(error) {
              console.error(error);
              setHaveComments(false);
            }
          }
          getComments();
        } else {
          setHaveComments(false); // assumed that if no param is passed in, the comments are being toggled OFF - thus clearing that we have comments
        }
    };

    const sendComment = (videoId?: string) => {
      if (!videoId) return;
      
      let newComment : Comment = {
        commentId: getRandomId(),
        content: madeComment,
        userId: globalThis.userId,
        timePosted: Date.now(),
      }

      postComment(newComment, videoId);
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleBox}>
                <TouchableOpacity onPress={() => handleGoBack()} style={{marginBottom: 10}}>
                    <Ionicons name='arrow-back-outline' size={30}/>
                </TouchableOpacity>
                <Text style={styles.titleText}>
                    {room?.title}
                </Text>
            </View>
            <View style={{marginTop: 95, flex: 1}}>
              <ScrollView  style={{flex: 1}} contentContainerStyle={{ paddingBottom: 600 }}>
                <Text> {room?.description} </Text>
                {loading ? ( <ActivityIndicator size="large" color="#0000ff" /> ) : (
                  videoUrls.map((url, index) => (
                    <View key={url}>
                      <Video
                        source={{ uri: url }}
                        style={styles.video}
                        controls={true}
                        resizeMode="contain"
                      />
                      <TouchableOpacity 
                        onPress={() => toggleComments(videos[index].videoId)}
                        style={styles.toggleCommentsBox}
                      >
                        <Text style={{color: 'white'}}> Comments </Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
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
                              
                              <View key={comment.commentId} style={styles.commentContainer}>
                                <Text style={{marginRight: 10, marginLeft: 5}}>{comment.firstName}:</Text>
                                <Text>{comment.content}</Text>
                              </View>
                            ))
                          : 
                            <Text style={{marginTop: 10, marginLeft: 5}}> Empty for now </Text>
                          }
                        </View>
                      </ScrollView>
                    <KeyboardAvoidingView
                     behavior="padding"
                     style={{flex: 1}}
                    >
                      <View style={styles.makeCommentContainer}>
                          <TextInput style={styles.input}
                              placeholder="Join the discussion"
                              onChangeText={(text) => {
                                setMadeComment(text);
                              }}
                          />
                          <TouchableOpacity 
                            onPress={() => sendComment(commentVideoId)}
                            style={styles.sendCommentButton}
                          >
                              <Text style={{marginRight: 10, marginTop: 7, alignSelf: 'center'}}> Send </Text>
                          </TouchableOpacity>
                      </View>
                    </KeyboardAvoidingView>

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
    marginBottom: 10,
    marginTop: 5,
    flexDirection: 'row'
  },
  input: {
    height: 30,
    width: '70%',
    backgroundColor: 'rgba(239, 198, 155, 0.70)',
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  sendCommentButton: {
    borderRadius: 10,
    backgroundColor: 'rgb(75, 78, 109)',
    height: 30,
    width: 50,
    marginRight: 10
  },
  toggleCommentsBox: {
    backgroundColor: 'rgb(75, 78, 109)',
    borderRadius: 10,
    width: '25%',
    justifyContent: 'center',
    alignItems:'center',
    height: '7%',
    marginLeft: 8
  }
});

export default JoinedRoomPage;