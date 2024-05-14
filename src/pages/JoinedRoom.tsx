import React, { useState, useEffect, } from 'react';
import {ScrollView, Text, StyleSheet, View, TouchableOpacity, Image, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import roomsData from '../data/joinedRooms.json'
import { RootStackParamList } from '../components/NavigationTypes';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import Modal from 'react-native-modal';

type JoinedRoomRouteProp = RouteProp<RootStackParamList, 'JoinedRoomPage'>;
type JoinedRoomNavigationProp = NavigationProp<RootStackParamList, 'JoinedRoomPage'>;

interface JoinedRoomProps {
    route: JoinedRoomRouteProp;
}

const JoinedRoomPage: React.FC<JoinedRoomProps> = ({ route }) => {
    const roomId = route.params.data.roomId // for future use when pulling room specific data from backend
    const roomContent = route.params.data.roomContent
    const [commentsVisible, setCommentsVisible] = useState(false);
    const navigation = useNavigation<JoinedRoomNavigationProp>();

    const handleGoBack = () => {
        navigation.goBack();
    };

    const toggleComments = () => {
        setCommentsVisible(!commentsVisible)
    }

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
                <Text> Room Description </Text>
                <View style={styles.videosContainer}>
                    <TouchableOpacity onPress={() => toggleComments()}>
                        <Image 
                            source={require('../img/user1.jpeg')} 
                            style={styles.video} 
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleComments()}>
                        <Image 
                            source={require('../img/user2.jpeg')} 
                            style={styles.video} 
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleComments()}>
                        <Image 
                            source={require('../img/user3.jpeg')} 
                            style={styles.video} 
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleComments()}>
                        <Image 
                            source={require('../img/user4.jpeg')} 
                            style={styles.video} 
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                </View>
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
                            <Text style={{marginTop: 10, marginLeft: 5}}> Empty for now </Text>
                        </View>
                    </ScrollView>
                    <View style={styles.makeCommentContainer}>
                        <TextInput style={styles.input}
                            placeholder="Join the discussion"
                        />
                        <TouchableOpacity>
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