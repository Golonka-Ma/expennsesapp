import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainScreen from './screens/MainScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import SettingsScreen from './screens/SettingsScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import AboutUsScreen from './screens/AboutUsScreen';
import CustomDrawerContent from './screens/CustomDrawerContent';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const Drawer = createDrawerNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Main"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#800000', // Ustawienie koloru tła paska nawigacji
          },
          headerTintColor: '#fff', // Ustawienie koloru ikon i tekstu w pasku nawigacji
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Drawer.Screen
          name="Login"
          component={LoginScreen}
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false,
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesomeIcon name="sign-in" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name='Registration'
          component={RegistrationScreen}
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false,
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesomeIcon name="user-plus" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Ekran domowy"
          component={MainScreen}
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesomeIcon name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Wydatki"
          component={ExpensesScreen}
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesomeIcon name="money" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Ustawienia"
          component={SettingsScreen}
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesomeIcon name="cog" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Statystyki"
          component={StatisticsScreen}
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesomeIcon name="bar-chart" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="O nas"
          component={AboutUsScreen}
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesomeIcon name="info-circle" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
