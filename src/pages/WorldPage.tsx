import React, { useState, useEffect, } from 'react';
import {ScrollView, Text, StyleSheet, View, TextInput, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../components/NavigationTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import postsData from '../data/posts.json'


// TODO put elsewhere
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import storage from '@react-native-firebase/storage';

function uploadVideo(roomId: number, videoFile: string) {
  // upload video to backend
  console.log(`Uploading video ${videoFile} to room ${roomId}`);

  // Execute FFmpeg command
  console.log(`Compressing video ${videoFile}`);

  FFmpegKit.execute(`-y -i /Users/colinsullivan/Desktop/Mirror/StanfordStuff/CS278/DebDem/src/img/video.mp4 -r 30 -c:v libx264 -vf scale=256:384 -aspect 2:3 -t 60s /Users/colinsullivan/Desktop/Mirror/StanfordStuff/CS278/DebDem/src/img/compressed_video.mp4`).then(async (session) => {
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        console.log(`Compression completed successfully`);
        console.log("Uploading compressed video to backend");
        storage().ref(`/Test/compressed_video1.mp4`).putFile(`/Users/colinsullivan/Desktop/Mirror/StanfordStuff/CS278/DebDem/src/img/compressed_video.mp4`).then(() => {
          console.log(`Video uploaded successfully`);
        });
      } else if (ReturnCode.isCancel(returnCode)) {
          console.log(`Compression was cancelled`);
      } else {
          console.log(`Compression failed. Please check the logs for the details.`);
      }
  });
}

type WorldPageNavigationProp = NavigationProp<RootStackParamList, 'WorldPage'>;

const WorldPage: React.FC = () => {
  const [posts, setPosts] = useState(postsData.posts.sort((a, b) => b.count - a.count));
  const [isPosting, setIsPosting] = useState(false);
  const [draft, setDraft] = useState('');
  const [hasUpvoted, setHasUpvoted] = useState(false); // TODO: update these from the backend
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const navigation = useNavigation<WorldPageNavigationProp>();

  const upvote = (postId: number) => {
    const update = hasUpvoted ? -1 : 1;
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {...post, count: post.count + update };
      }
      return post
    });
    setPosts(updatedPosts);
    setHasUpvoted(!hasUpvoted);
    setHasDownvoted(false);
  }

  useEffect(() => {
    // console.log(require('../img/user1.jpeg'));
    uploadVideo(1, "");
  });

  const downvote = (postId: number) => {
    const update = hasDownvoted ? 1 : -1;
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, count: post.count + update };
      }
      return post
    });
    setPosts(updatedPosts);
    setHasDownvoted(!hasDownvoted);
    setHasUpvoted(false);
  }

  const makePostButton = () => {
    setIsPosting(!isPosting);
  }

  const makePost = (content: string) => {
    const newPost = {
      id: posts.length,
      content: content,
      count: 0
    };
    setPosts([...posts, newPost]);
  }

  const handleNotifPress = () => {
    navigation.navigate('InvitesPage')
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.titleText}>
          World
        </Text>
        <TouchableOpacity style={{marginTop: 20}} onPress={() => handleNotifPress()}>
          <Ionicons name='notifications' size={30}/>
        </TouchableOpacity>
      </View>
      <TextInput style={styles.searchContainer}
        placeholder="Search"
        placeholderTextColor={'white'}
      />
      <ScrollView style={styles.scrollContainer}>
        {posts.map((post, index) => (
          <View style={styles.postContatiner} key={post.id}>
              <LinearGradient
                start={{x: 0, y: 0}} 
                end={{x: 1, y: 0}}
                colors={['rgba(239, 198, 155, 0.60)', 'rgba(119, 156, 171, 0.10)', 'rgba(0, 0, 0, 0)']}
                style={{height: 50, borderRadius: 10, width: '80%'}}
              >
                <Text style={styles.postText}>
                  {post.content}
                </Text>
              </LinearGradient>
              <View style={styles.interactables}>
                <TouchableOpacity onPress={() => upvote(post.id)}>
                    <Text style={{fontSize: 20, fontWeight: hasUpvoted ? 'bold' : 'normal'}}> + </Text>
                </TouchableOpacity>
                <Text> {post.count} </Text>
                <TouchableOpacity onPress={() => downvote(post.id)}>
                    <Text style={{fontSize: 30, fontWeight: hasDownvoted ? 'bold' : 'normal'}}> - </Text>
                </TouchableOpacity>
              </View>
            </View>
        ))}
      </ScrollView>
      <View style={styles.postButtonContainer}>
        <View style={{flexDirection: 'row'}}>
          {isPosting && 
            <TextInput style={styles.postText}
              value={draft}
              onChangeText={text => setDraft(text)}
              placeholder="Write your post here!"
            />
          }
          {isPosting && 
            <TouchableOpacity onPress={() =>  makePost(draft)} style={styles.submitButton}>
              <Text style={{fontSize: 20}}> Submit </Text>
            </TouchableOpacity>
          }
          <TouchableOpacity onPress={() =>  makePostButton()} style={styles.postButton}>
            <Text style={styles.postButtonLabel}>+</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchContainer: {
    width: '100%',
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgb(75, 78, 109)',
    marginTop: 80,
    paddingLeft: 10,
  },
  scrollContainer: {
    marginTop: 30,
  },
  postContatiner: {
    height: 60,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  postText: {
    marginLeft: 10,
    marginTop: 15,
    fontSize: 15,
  },
  interactables: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  postButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  postButton: {
    marginRight: 20,
    width: 50, // IDK I'm just guessing here
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
  postButtonLabel: {
    fontSize: 30,
  },
  submitButton: {
    marginRight: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
});

export default WorldPage;