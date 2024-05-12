import React, { useState, useEffect, } from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';

const ProfilePage: React.FC = () => {
  
  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.titleText}>
          Profile
        </Text>
      </View>
      <ScrollView style={styles.scrollContainter}>
        <Text> profile settings </Text>
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
  }
});

export default ProfilePage;