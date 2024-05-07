import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { doc, getDoc, addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
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
  const [expenses, setExpenses] = useState<any[]>([]);
  const navigation = useNavigation();

  const fetchUserName = useCallback(async () => {
    try {
      const currentUser = auth.currentUser;
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
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchUserName();
      // Subskrybujemy na zmiany w kolekcji "wydatki" i aktualizujemy stan expenses
      const unsubscribe = onSnapshot(
        query(collection(db, 'wydatki'), where('uid', '==', auth.currentUser.uid)),
        (snapshot) => {
          const expensesData: any[] = [];
          snapshot.forEach((doc) => {
            expensesData.push({ id: doc.id, ...doc.data() });
          });
          setExpenses(expensesData);
        }
      );
      // Czyszczenie subskrypcji
      return () => unsubscribe();
    }, [fetchUserName])
  );

  const handleAddExpense = () => {
    setIsAddingExpense(true);
  };

  const handleCancelAddExpense = () => {
    setIsAddingExpense(false);
    setItemName('');
    setItemPrice('');
  };

  const handleSaveExpense = async () => {
    try {
      // Dodaj nowy wydatek do kolekcji "wydatki" z nazwą dokumentu UID
      await addDoc(collection(db, 'wydatki'), {
        uid: auth.currentUser.uid, // Dodajemy UID użytkownika jako pole w dokumentcie
        nazwa: itemName,
        cena: itemPrice,
        data: new Date().toISOString() // Możesz dodać również datę, na przykład datę dodania wydatku
      });

      handleCancelAddExpense(); // Po dodaniu wydatku, chcemy ukryć okienko dodawania wydatku i wyczyścić pola
    } catch (error) {
      console.error('Błąd podczas dodawania wydatku:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Witaj {userName} na ekranie głównym!</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <FontAwesome name="plus" size={24} color="white" />
        </TouchableOpacity>
        {/* Lista wydatków */}
        <FlatList
          data={expenses}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <Text>Nazwa: {item.nazwa}</Text>
              <Text>Cena: {item.cena}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
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
                <Text style={styles.Buttontext}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveExpense}>
                <Text style={styles.Buttontext}>Zapisz</Text>
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
    backgroundColor: '#800000',
    borderRadius: 50,
    width: 60,
    height: 60,
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
  Buttontext: {
    color: 'white',
    fontWeight: 'bold',
  },
  expenseItem: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default MainScreen;
