import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal } from 'react-native';
import { doc, getDoc, addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { auth } from '../FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const MainScreen: React.FC = () => {
  return (
    <View>
      <Text>Ekran główny</Text>
    </View>
  );
};

export default MainScreen;
