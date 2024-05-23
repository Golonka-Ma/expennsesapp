import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ImageBackground } from 'react-native';

const AboutUsScreen: React.FC = () => {
  return (
    <ImageBackground source={require('../assets/white.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/university-logo.png')} style={styles.logo} />
        </View>
        <Text style={styles.title}>O nas</Text>
        <Text style={styles.description}>
          Aplikacja do zarządzania wydatkami jest projektem realizowanym w ramach przedmiotu
          "Zaawansowane tworzenie aplikacji mobilnych".
        </Text>
        <Text style={styles.description}>
          Aplikacja została stworzona przez:
        </Text>
        <Text style={styles.name}>Marcin Golonka</Text>
        <Text style={styles.name}>Tomasz Fela</Text>
        <Text style={styles.name}>Jakub Jędrychowski</Text>
        <Text style={styles.description}>
          Mamy nadzieję, że aplikacja będzie przydatna w zarządzaniu Waszymi wydatkami i pomoże
          w lepszym planowaniu budżetu.
        </Text>
        <View style={styles.versionContainer}>
          <Text style={styles.version}>Wersja aplikacji: 1.0.0</Text>
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
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#555',
  },
  versionContainer: {
    marginTop: 30,
  },
  version: {
    fontSize: 14,
    color: '#777',
  },
});

export default AboutUsScreen;
