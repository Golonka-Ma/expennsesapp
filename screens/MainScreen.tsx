import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, ImageBackground } from 'react-native';
import { db } from '../FirebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth } from '../FirebaseConfig';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Progress from 'react-native-progress';

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
      setRecentExpenses(recentExpensesData.slice(0, 3));

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
    <ImageBackground source={require('../assets/white.jpg')} style={styles.backgroundImage}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.title}>Podsumowanie twoich wydatków:</Text>
            <Text style={styles.normaltext}>Suma wydatków w bieżącym tygodniu: {weeklyExpenseSum} PLN</Text>
            <Text style={styles.normaltext}>Suma wydatków w bieżącym miesiącu: {monthlyExpenseSum} PLN</Text>
            <Text style={styles.normaltext}>Suma wydatków w bieżącym roku: {yearlyExpenseSum} PLN</Text>
            <Text style={styles.subtitle}>Twoje limity oraz budżet:</Text>
            <Text style={styles.normaltext}>Twój tygodniowy limit: {weeklyLimit} PLN</Text>
            <Text style={styles.normaltext}>Twój miesięczny limit: {monthlyLimit} PLN</Text>
            <Text style={styles.normaltext}>Twój roczny limit: {yearlyLimit} PLN</Text>
            <Text style={styles.normaltext}>Twój budżet: {budget} PLN</Text>
            <Text style={styles.title2}>Wykres wydatków:</Text>
          </View>

          <View style={styles.chartContainer}>
            <Progress.Circle
              style={{ height: 100, width: 100}}
              progress={weeklyLimit ? weeklyExpenseSum / weeklyLimit : 0}
              color={'red'}
              size={90}
              thickness={12}
              showsText={true}
              textStyle={styles.chartext}
            />
            <Progress.Circle
              style={{ height: 100, width: 100 }}
              progress={monthlyLimit ? monthlyExpenseSum / monthlyLimit : 0}
              color={'green'}
              size={90}
              thickness={12}
              showsText={true}
              textStyle={styles.chartext}
            />
            <Progress.Circle
              style={{ height: 100, width: 100 }}
              progress={yearlyLimit ? yearlyExpenseSum / yearlyLimit : 0}
              color={'blue'}
              size={90}
              thickness={12}
              showsText={true}
              textStyle={styles.chartext}
            />
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
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
    color:"#800000",
  },
  title2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop:20,
    color:"#800000",
  },
  subtitle:{
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop:20,
    color:"#800000",
  },
  normaltext:{
    color:"black",
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  chartText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    color:"black",
  },
  chartext:{
    fontSize:18,
    fontWeight:"bold",
  }
});

export default MainScreen;
