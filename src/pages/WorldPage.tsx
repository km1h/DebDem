import React, { useState, useEffect, } from 'react';
import {ScrollView, Text, StyleSheet, View, TextInput, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../components/NavigationTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchAllQuestions } from '../database/Fetch';
import { postQuestion, voteQuestion, getRandomId } from '../database/Post';
import { Question } from '../database/Structures';
import firestore from '@react-native-firebase/firestore';

import { QUESTION_COLLECTION } from '../database/Constants';

type WorldPageNavigationProp = NavigationProp<RootStackParamList, 'WorldPage'>;

const WorldPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [draft, setDraft] = useState('');
  const navigation = useNavigation<WorldPageNavigationProp>();

  useEffect(() => {
    fetchAllQuestions().then(questions => {
      console.log(questions);
      setQuestions(questions);
    });
  }, []);

  useEffect(() => {
    firestore().collection(QUESTION_COLLECTION).onSnapshot(snapshot => {
      let updatedQuestions = snapshot.docs.map(doc => doc.data() as Question);
      setQuestions(updatedQuestions);
    });
  }, []);

  const hasUpvoted = (questionIndex: number) => {
    return questions[questionIndex].yesUserIds.includes(globalThis.userId);
  }

  const hasDownvoted = (questionIndex: number) => {
    return questions[questionIndex].noUserIds.includes(globalThis.userId);
  }

  const changeVotes = (questionId: string, yes: boolean) => {
    let questionIndex = questions.findIndex(question => question.questionId === questionId);
    if (hasUpvoted(questionIndex) || hasDownvoted(questionIndex)) {
      return;
    }
    let myUserId = globalThis.userId;
    voteQuestion(questionId, myUserId, yes);
    const updatedQuestions = questions.map(question => {
      if (question.questionId === questionId) {
        let updatedQuestion = question;
        if (yes) {
          updatedQuestion.yesUserIds.push(myUserId);
          updatedQuestion.yesVotes += 1;
        } else {
          updatedQuestion.noUserIds.push(myUserId);
          updatedQuestion.noVotes += 1;
        }
        return updatedQuestion;
      }
      return question;
    });
    setQuestions(updatedQuestions);
  }
  
  const upvote = (questionId: string) => {
    changeVotes(questionId, true);
  }

  const downvote = (questionId: string) => {
    changeVotes(questionId, false);
  }

  const makePostButton = () => {
    setIsPosting(!isPosting);
  }

  const makePost = (content: string) => {
    const newPost = {
      questionId: getRandomId(),
      title: content,
      description: '',
      noVotes: 0,
      yesVotes: 0,
      yesUserIds: [],
      noUserIds: [],
    };
    postQuestion(newPost);
    setQuestions([...questions, newPost]);
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

        {questions.map((question, index) => (
          <View style={styles.postContatiner} key={question.questionId}>
            <LinearGradient
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 0}}
              colors={['rgba(239, 198, 155, 0.60)', 'rgba(119, 156, 171, 0.10)', 'rgba(0, 0, 0, 0)']}
              style={{height: 50, borderRadius: 10, width: '80%'}}
            >
              <Text style={styles.postText}>
                {question.title}
              </Text>
            </LinearGradient>
            <View style={styles.interactables}>
              <TouchableOpacity onPress={() => upvote(question.questionId)}>
                  <Text style={{fontSize: 20, fontWeight: hasUpvoted(index) ? 'bold' : 'normal'}}> + </Text>
              </TouchableOpacity>
              <Text> {question.yesVotes - question.noVotes} </Text>
              <TouchableOpacity onPress={() => downvote(question.questionId)}>
                  <Text style={{fontSize: 30, fontWeight: hasDownvoted(index) ? 'bold' : 'normal'}}> - </Text>
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