import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { auth } from '../FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const MainScreen: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [isAddingExpense, setIsAddingExpense] = useState<boolean>(false);
  const [itemName, setItemName] = useState<string>('');
  const [itemPrice, setItemPrice] = useState<string>('');
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

  const handleAddExpense = () => {
    setIsAddingExpense(true); // Ustawiamy stan na true, aby wyświetlić okienko dodawania wydatku
  };

  const handleCancelAddExpense = () => {
    setIsAddingExpense(false); // Ustawiamy stan na false, aby ukryć okienko dodawania wydatku
    setItemName(''); // Czyścimy stan nazwy przedmiotu
    setItemPrice(''); // Czyścimy stan ceny przedmiotu
  };

  const handleSaveExpense = () => {
    // Tutaj możesz zapisać nowy wydatek do bazy danych lub wykonać inne operacje
    console.log('Dodano nowy wydatek:', itemName, itemPrice);
    handleCancelAddExpense(); // Po dodaniu wydatku, chcemy ukryć okienko dodawania wydatku i wyczyścić pola
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
  <Text style={styles.title}>Witaj {userName} na ekranie głównym!</Text>
  <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
    <FontAwesome name="plus" size={24} color="white" />
  </TouchableOpacity>
        {/* Okienko dodawania wydatku */}
        {isAddingExpense && (
          <View style={styles.addExpenseContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nazwa przedmiotu"
              value={itemName}
              onChangeText={setItemName}
            />
            <TextInput
              style={styles.input}
              placeholder="Cena"
              value={itemPrice}
              onChangeText={setItemPrice}
            />
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelAddExpense}>
                <Text>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveExpense}>
                <Text>Zapisz</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addExpenseContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
});

export default MainScreen;
