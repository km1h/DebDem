import React, { useState, useEffect, } from 'react';
import {ScrollView, Text, StyleSheet, View, TextInput, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import postsData from '../data/posts.json'


const WorldPage: React.FC = () => {
  const [posts, setPosts] = useState(postsData.posts);
  const [isPosting, setIsPosting] = useState(false);
  const [draft, setDraft] = useState('');

  const upvote = (postId: number) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {...post, count: post.count + 1 };
      }
      return post
    });
    setPosts(updatedPosts);
  }

  const downvote = (postId: number) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, count: post.count - 1 };
      }
      return post
    });
    setPosts(updatedPosts);
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
  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.titleText}>
          World
        </Text>
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
                    <Text style={{fontSize: 20}}> + </Text>
                </TouchableOpacity>
                <Text> {post.count} </Text>
                <TouchableOpacity onPress={() => downvote(post.id)}>
                    <Text style={{fontSize: 30}}> - </Text>
                </TouchableOpacity>
              </View>
            </View>
        ))}
      </ScrollView>
      <View style={styles.postButtonContainer}>
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
    justifyContent: 'center',
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