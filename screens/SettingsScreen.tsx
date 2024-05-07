import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, TextInput, Keyboard, ImageBackground } from 'react-native';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { auth } from '../FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SettingsScreen: React.FC = () => {
  const [budget, setBudget] = useState<number>(0);
  const [weeklyLimit, setWeeklyLimit] = useState<number>(0);
  const [monthlyLimit, setMonthlyLimit] = useState<number>(0);
  const [yearlyLimit, setYearlyLimit] = useState<number>(0);
  const [editable, setEditable] = useState<boolean>(false);
  const [newBudget, setNewBudget] = useState<number>(0);

  const navigation = useNavigation();

  // Funkcja do pobierania danych budżetu i limitów z bazy danych
  const fetchData = useCallback(async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userUID = currentUser.uid;
        const docRef = doc(db, 'users', userUID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setBudget(userData.budget || 0);
          setNewBudget(userData.budget || 0); // Zmiana wartości na pustą
          setWeeklyLimit(userData.weeklyLimit || 0); // Dodane przypisanie wartości pola weeklyLimit
          setMonthlyLimit(userData.monthlyLimit || 0); // Dodane przypisanie wartości pola monthlyLimit
          setYearlyLimit(userData.yearlyLimit || 0); // Dodane przypisanie wartości pola yearlyLimit
        } else {
          console.log('Document not found!');
        }
      } else {
        console.log('User not logged in!');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [navigation]);

  // Uruchamianie funkcji fetchData po zmianie fokusu ekranu
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // Funkcja do zapisywania nowego budżetu i limitów do bazy danych
  const saveData = async () => {
    try {
      if (isNaN(newBudget) || isNaN(weeklyLimit) || isNaN(monthlyLimit) || isNaN(yearlyLimit)) {
        console.error('Podane dane są nieprawidłowe!');
        return;
      }

      const currentUser = auth.currentUser;
      if (currentUser) {
        const userUID = currentUser.uid;
        const userDocRef = doc(db, 'users', userUID);
        await updateDoc(userDocRef, {
          budget: newBudget,
          weeklyLimit,
          monthlyLimit,
          yearlyLimit,
          updatedAt: serverTimestamp()
        });
        setBudget(newBudget);
        Keyboard.dismiss();
      }

      setEditable(false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Funkcja do anulowania edycji
  const cancelEditing = () => {
    setEditable(false);
    setNewBudget(budget);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
    <ImageBackground source={require('../assets/white.jpg')} style={styles.backgroundImage}>
      <View style={styles.content}>
        <View style={styles.budgetContainer}>
          <Text style={styles.label}>Dostępny budżet:</Text>
          <View style={styles.budgetRow}>
            <TextInput
              style={[styles.input, editable && styles.editableInput]}
              value={editable ? newBudget.toString() : budget.toString()}
              onChangeText={value => setNewBudget(parseFloat(value))}
              editable={editable}
              keyboardType="numeric"
            />
            <Text style={styles.textpln}>PLN</Text>
          </View>
        </View>

        <View style={styles.limitContainer}>
          <Text style={styles.label}>Limit tygodniowy:</Text>
          <View style={styles.limitRow}>
            <TextInput
              style={[styles.input, editable && styles.editableInput]}
              value={weeklyLimit.toString()}
              onChangeText={value => setWeeklyLimit(parseFloat(value))}
              editable={editable}
              keyboardType="numeric"
            />
            <Text style={styles.textpln}>PLN</Text>
          </View>
        </View>
        <View style={styles.limitContainer}>
          <Text style={styles.label}>Limit miesięczny:</Text>
          <View style={styles.limitRow}>
            <TextInput
              style={[styles.input, editable && styles.editableInput]}
              value={monthlyLimit.toString()}
              onChangeText={value => setMonthlyLimit(parseFloat(value))}
              editable={editable}
              keyboardType="numeric"
            />
            <Text style={styles.textpln}>PLN</Text>
          </View>
        </View>
        <View style={styles.limitContainer}>
          <Text style={styles.label}>Limit roczny:       </Text>
          <View style={styles.limitRow}>
            <TextInput
              style={[styles.input, editable && styles.editableInput]}
              value={yearlyLimit.toString()}
              onChangeText={value => setYearlyLimit(parseFloat(value))}
              editable={editable}
              keyboardType="numeric"
            />
            <Text style={styles.textpln}>PLN</Text>
          </View>
        </View>
        {editable && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelEditing}>
              <Text style={styles.buttonText}>Anuluj</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={saveData}>
              <Text style={styles.buttonText}>Zapisz</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {!editable && (
        <TouchableOpacity style={styles.settingsButton} onPress={() => setEditable(true)}>
          <FontAwesome name="cog" size={24} color="white" />
        </TouchableOpacity>
      )} 
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
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    marginTop:60,
    alignItems: 'center',
  },
  budgetContainer: {
    marginBottom: 20,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  limitContainer: {
    marginBottom: 10,
  },
  limitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5,
    color: "#800000",
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 2,
    fontSize: 25,
    borderColor: '#800000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    color: "black",
    fontWeight: "bold",
    minWidth:100,
  },
  editableInput: {
    backgroundColor: 'lightgray',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  settingsButton: {
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
  saveButton: {
    backgroundColor: '#800000',
    paddingVertical: 12,
    paddingHorizontal: 60,
    marginLeft:8,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#800000',
    paddingVertical: 12,
    marginRight:8,
    paddingHorizontal: 60,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  textpln: {
    fontSize:17,
    fontWeight: "bold",
    marginLeft: 10,
  }
});

export default SettingsScreen;
