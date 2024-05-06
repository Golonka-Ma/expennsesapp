import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { auth } from '../FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const MainScreen: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const navigation = useNavigation();

  const fetchUserName = useCallback(async () => {
    try {
      const currentUser = auth.currentUser;
      console.log(currentUser);
      if (currentUser) {
        const userUID = currentUser.uid;
        const docRef = doc(db, 'users', userUID); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserName(userData.username);
        } else {
          console.log('Document not found!');
        }
      } else {
        console.log('User not logged in!');
        navigation.navigate('Login'); // Przekieruj użytkownika do ekranu logowania
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchUserName();
    }, [fetchUserName])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Witaj {userName} na ekranie głównym!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default MainScreen;
