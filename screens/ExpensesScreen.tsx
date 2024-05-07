import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal, ImageBackground, StatusBar, Alert } from 'react-native';
import { doc, getDoc, addDoc, collection, onSnapshot, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { auth } from '../FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ExpensesScreen: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [isAddingExpense, setIsAddingExpense] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [itemPrice, setItemPrice] = useState<string>('');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [showActions, setShowActions] = useState<boolean>(false);
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
      return () => unsubscribe();
    }, [fetchUserName])
  );

  const handleAddExpense = () => {
    setIsAddingExpense(true);
    setShowActions(false);
  };

  const handleCancelAddExpense = () => {
    setIsAddingExpense(false);
    setSelectedItem('');
    setSelectedIcon('');
    setItemPrice('');
    setSelectedExpense(null);
  };

  const handleSaveExpense = async () => {
    try {
      const parsedPrice = parseFloat(itemPrice);

      if (isNaN(parsedPrice)) {
        console.error('Podana cena jest nieprawidłowa!');
        return;
      }
  
      const formattedPrice = parsedPrice.toFixed(2);

      if (selectedExpense) {
        await updateDoc(doc(db, 'wydatki', selectedExpense.id), {
          nazwa: selectedItem,
          cena: formattedPrice,
          icon: selectedIcon,
        });
      } else {
        await addDoc(collection(db, 'wydatki'), {
          uid: auth.currentUser.uid,
          nazwa: selectedItem,
          cena: formattedPrice,
          icon: selectedIcon,
          data: new Date().toISOString()
        });
      }
  
      handleCancelAddExpense();
    } catch (error) {
      console.error('Błąd podczas zapisywania wydatku:', error);
    }
  };

  const handleEditExpense = (item: any) => {
    setSelectedItem(item.nazwa);
    setItemPrice(item.cena);
    setSelectedIcon(item.icon);
    setSelectedExpense(item);
    setIsAddingExpense(true);
    setShowActions(false);
  };

  const handleDeleteExpense = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, 'wydatki', itemId));
    } catch (error) {
      console.error('Błąd podczas usuwania wydatku:', error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <View style={styles.expenseItem}>
        <FontAwesome name={item.icon} size={24} color="black" style={styles.icon} />
        <Text style={styles.productName}>{item.nazwa}</Text>
        <Text style={styles.productPrice}>{item.cena} PLN</Text>
      </View>
    </TouchableOpacity>
  );

  const handlePress = (item: any) => {
    setSelectedExpense(item);
    setShowActions(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../assets/white.jpg')} style={styles.backgroundImage}>
        <StatusBar translucent backgroundColor="transparent" />
        <View style={styles.content}>
          <Text style={styles.title}>Witaj {userName}</Text>
          <Text style={styles.title2}>Tutaj możesz zobaczyć swoje wydatki:</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
            <FontAwesome name="plus" size={24} color="white" />
          </TouchableOpacity>
          <FlatList
            data={expenses}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
          {showActions && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowActions(false)}>
                <FontAwesome name="times" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEditExpense(selectedExpense)}>
                <FontAwesome name="edit" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteExpense(selectedExpense.id)}>
                <FontAwesome name="trash" size={24} color="white" />
              </TouchableOpacity>
              
            </View>
          )}
          {isAddingExpense && (
            <View style={styles.addExpenseContainer}>
              <TouchableOpacity style={styles.input} onPress={() => setShowModal(true)}>
                <Text style={styles.pickertext}>{selectedItem || 'Wybierz przedmiot'}</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Cena"
                value={itemPrice}
                onChangeText={setItemPrice}
              />
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelAddExpense}>
                  <Text style={styles.buttonText}>Anuluj</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveExpense}>
                  <Text style={styles.buttonText}>Zapisz</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <Modal visible={showModal} animationType="slide">
            <SafeAreaView>
              <View style={styles.modalContent}>
                <Text style={styles.title3}>Wybierz produkt z listy:</Text>
                <FlatList
                  data={[
                    { name: 'Tekstylia', icon: 'scissors' },
                    { name: 'Zakupy spożywcze', icon: 'shopping-basket' },
                    { name: 'Mechanik', icon: 'car' },
                    { name: 'Podróże', icon: 'plane' },
                    { name: 'Dom i ogórd', icon: 'home' },
                    { name: 'Kredyt', icon: 'credit-card' },
                    { name: 'Leki', icon: 'medkit' },
                    { name: 'Lekarz', icon: 'user-md' },
                    { name: 'Edukacja', icon: 'graduation-cap' },
                    { name: 'Taxi', icon: 'taxi' },
                    { name: 'Internet', icon: 'wifi' },
                    { name: 'Prąd', icon: 'plug' },
                    { name: 'Restauracje', icon: 'cutlery' }, 
                    { name: 'Rozrywka', icon: 'beer' },    
                    { name: 'Ogrzewanie', icon: 'thermometer-three-quarters' },        
                    { name: 'Telewizja', icon: 'television' },
                    { name: 'Prezent urodzinowy', icon: 'birthday-cake' },
                    { name: 'Spotify', icon: 'spotify' },
                    { name: 'Abonament', icon: 'mobile' },
                    { name: 'Elektronika', icon: 'laptop' },
                    { name: 'Mandaty', icon: 'money' },   
                  ]}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => {
                        setSelectedItem(item.name);
                        setSelectedIcon(item.icon);
                        setShowModal(false);
                      }}
                    >
                      <FontAwesome name={item.icon} size={27} color="black" style={styles.icon} />
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.name}
                />
              </View>
            </SafeAreaView>
          </Modal>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    height: 850,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: "gray",
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop:15,
    fontSize: 24,
    fontWeight: 'bold',
    color: "#800000",
  },
  title2: {
    fontSize: 15,
    marginBottom: 15,
    color: "#800000",
  },
  title3: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#800000",
    marginStart:15,
    marginBottom:15,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: '#800000',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: "column",
    position: "absolute",
    top: 470,
    right: 18,
    zIndex: 999,
  },
  editButton: {
    backgroundColor: '#ffa500',
    padding: 10,
    borderRadius: 50,
    marginTop:10,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#800000',
    padding: 10,
    borderRadius: 50,
    marginTop:10,
    marginRight: 10,
  },
  closeButton: {
    backgroundColor: '#808080',
    padding: 10,
    borderRadius: 50,

  },
  addExpenseContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    marginRight: 50,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 50,
    fontWeight: "bold",
    color: "black",
  },
  pickertext: {
    color: "black",
    fontWeight: "bold",
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  expenseItem: {
    borderWidth: 1,
    borderColor: '#800000',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  productName: {
    fontSize: 15,
    flex: 0,
    padding: 15,
    marginRight: 50,
    color: "#800000",
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 15,
    marginLeft: 'auto',
    color: "#800000",
    fontWeight: "bold",
  },
  modalContent: {
    marginTop: 50,
    marginBottom:100,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ExpensesScreen;
