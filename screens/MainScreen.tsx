import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { db } from '../FirebaseConfig';
import { collection, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { auth } from '../FirebaseConfig';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const MainScreen: React.FC = () => {
  const [weeklyExpenseSum, setWeeklyExpenseSum] = useState<number>(0);
  const [monthlyExpenseSum, setMonthlyExpenseSum] = useState<number>(0);
  const [yearlyExpenseSum, setYearlyExpenseSum] = useState<number>(0);
  const [weeklyLimit, setWeeklyLimit] = useState<number>(0);
  const [monthlyLimit, setMonthlyLimit] = useState<number>(0);
  const [yearlyLimit, setYearlyLimit] = useState<number>(0);
  const [budget, setBudget] = useState<number>(0);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      // Pobieranie danych dotyczących wydatków
      const currentDate = new Date();
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
      const endOfWeek = new Date(currentDate);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const endOfYear = new Date(currentDate.getFullYear(), 11, 31);

      const userUID = auth.currentUser.uid;
      const expensesRef = collection(db, 'wydatki');
      const querySnapshot = await getDocs(expensesRef);

      let weeklySum = 0;
      let monthlySum = 0;
      let yearlySum = 0;
      let recentExpensesData: any[] = [];

      querySnapshot.forEach((doc) => {
        const expenseData = doc.data();
        if (expenseData.uid === userUID) {
          const expenseAmount = parseFloat(expenseData.cena);
          const expenseDate = new Date(expenseData.data);
          
          if (expenseDate >= startOfWeek && expenseDate <= endOfWeek) {
            weeklySum += expenseAmount;
          }

          if (expenseDate >= startOfMonth && expenseDate <= endOfMonth) {
            monthlySum += expenseAmount;
          }

          if (expenseDate >= startOfYear && expenseDate <= endOfYear) {
            yearlySum += expenseAmount;
          }

          recentExpensesData.push({ id: doc.id, ...expenseData });
        }
      });

      setWeeklyExpenseSum(weeklySum);
      setMonthlyExpenseSum(monthlySum);
      setYearlyExpenseSum(yearlySum);
      setRecentExpenses(recentExpensesData.slice(0, 3)); // Wybieramy tylko trzy ostatnie wydatki

      // Pobieranie danych dotyczących użytkownika
      const userDocRef = doc(db, 'users', userUID);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        if (userData) {
          setWeeklyLimit(userData.weeklyLimit || 0);
          setMonthlyLimit(userData.monthlyLimit || 0);
          setYearlyLimit(userData.yearlyLimit || 0);
          setBudget(userData.budget || 0);
        }
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.title}>Podsumowanie:</Text>
          <Text>Suma wydatków w bieżącym tygodniu: {weeklyExpenseSum} PLN</Text>
          <Text>Suma wydatków w bieżącym miesiącu: {monthlyExpenseSum} PLN</Text>
          <Text>Suma wydatków w bieżącym roku: {yearlyExpenseSum} PLN</Text>
          <Text>Twój tygodniowy limit: {weeklyLimit} PLN</Text>
          <Text>Twój miesięczny limit: {monthlyLimit} PLN</Text>
          <Text>Twój roczny limit: {yearlyLimit} PLN</Text>
          <Text>Twój budżet: {budget} PLN</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Ostatnie wydatki:</Text>
          {recentExpenses.map((expense, index) => (
            <View key={index} style={styles.expense}>
              <FontAwesome name={expense.icon} size={25} color="black" style={styles.icon} />
              <Text style={styles.expenseText}>{expense.nazwa} - {expense.cena} PLN</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  expense: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 20,
  },
  expenseText: {
    fontSize: 16,
  },
});

export default MainScreen;
