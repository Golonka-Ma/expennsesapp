import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MainScreen from './screens/MainScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import SettingsScreen from './screens/SettingsScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import AboutUsScreen from './screens/AboutUsScreen';
import CustomDrawerContent from './screens/CustomDrawerContent'; // Importujemy CustomDrawerContent
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';

const Drawer = createDrawerNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Main" drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Login" component={LoginScreen} options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
        <Drawer.Screen name='Registration' component={RegistrationScreen} options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
        <Drawer.Screen name="Ekran domowy" component={MainScreen} />
        <Drawer.Screen name="Wydatki" component={ExpensesScreen} />
        <Drawer.Screen name="Ustawienia" component={SettingsScreen} />
        <Drawer.Screen name="Statystyki" component={StatisticsScreen} />
        <Drawer.Screen name="O nas" component={AboutUsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
