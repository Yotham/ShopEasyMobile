import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';

const ip = 'https://shop-ez.netlify.app/';

const Settings = () => {
  const navigation = useNavigation();

  const { currentUser } = useAuth();
  const username = currentUser ? currentUser.username : null;

  const [updatedUser, setUpdatedUser] = useState({
    height: [0, 0],
    weight: '',
    gender: '',
    goal: '',
    age: currentUser ? currentUser.age.toString() : '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const cmToFeetAndInches = (cm) => {
      const totalInches = cm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return [feet, inches];

  };
  useEffect(() => {
    if (currentUser) {
      const [feet, inches] = cmToFeetAndInches(currentUser.height);
      setUpdatedUser(prev => ({
        ...prev,
        height: [feet.toString(), inches.toString()]
      }));
      setIsLoading(false);
      }
  }, [currentUser]);

  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [heightft, setHeightft] = useState('');
  const [heightcm, setHeightcm] = useState('');
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goal, setGoal] = useState('');

  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  const handleSave = async () => {
    try {
      const token = await getToken();
      if (token){
        const response = await fetch(ip + `/api/user/${currentUser._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedUser)
        });

        if (!response.ok) {
            throw new Error('Failed to update user data');
        }

        const updatedData = await response.json();
        //setCurrentUser(updatedData);  // Update the local state to reflect the changes
        alert('Account updated successfully!');
        // Optionally, redirect the user or perform other actions
      } else {
          console.log('Token not found');
      }
  } catch (error) {
      console.error('Error updating user data:', error);
      alert('An error occurred while updating the account.');
  }
    console.log('Saved!');
  };

  const handleChange = (name, value) => {
    setUpdatedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHeightChange = (type, value) => {
    const height = [...updatedUser.height];
    height[type === "feet" ? 0 : 1] = value; // Update the correct index
    setUpdatedUser(prev => ({
      ...prev,
      height
    }));
  };

  const toggleGenderModal = () => {
    setGenderModalVisible(!genderModalVisible);
  };

  const toggleGoalModal = () => {
    setGoalModalVisible(!goalModalVisible);
  };

  const poundsToKilograms = (lbs) => {
    return (lbs * 0.453592).toFixed(2); // 1 pound is approximately 0.453592 kilograms
  };

  const kilogramsToPounds = (kg) => {
    return (kg / 0.453592).toFixed(2); // 1 kilogram is approximately 2.20462 pounds
  };

  const handleWeightLbsChange = (text) => {
    setWeightLbs(text);
    setWeightKg(poundsToKilograms(parseFloat(text)).toString());
  };

  const handleWeightKgChange = (text) => {
    setWeightKg(text);
    setWeightLbs(kilogramsToPounds(parseFloat(text)).toString());
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{alignItems: 'center'}}>
          <View style={styles.container}>
            <Text style={styles.title}>Whats new, {username}? </Text>
            <Text style={styles.inputLabel}>feet</Text>
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={updatedUser.age.toString()}
              onChangeText={value => handleChange('age', value)}
              keyboardType="numeric"
            />

          <Text style={styles.inputLabel}>Height</Text>
          <View style={styles.weightContainer}>
            <View style={styles.weightInput}>
              <Text style={styles.inputLabel}>feet</Text>
              <TextInput
                placeholderTextColor="#555"
                style={styles.input}
                placeholder={currentUser ? currentUser.height.toString() : ''}
                value={updatedUser.height[0].toString()}
                onChangeText={value => handleHeightChange('feet', value)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.weightInput}>
              <Text style={styles.inputLabel}>inches</Text>
              <TextInput
                placeholderTextColor="#555"
                style={styles.input}
                placeholder={currentUser ? (currentUser.height.toString() * 0.453592).toFixed(2) : ''}
                value={updatedUser.height[1].toString()}
                onChangeText={value => handleHeightChange('inches', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Weight (lbs)</Text>
          <View style={styles.weightContainer}>
            <View style={styles.weightInput}>
              <TextInput
                placeholderTextColor="#555"
                style={styles.input}
                placeholder={currentUser && currentUser.weight !== null ? currentUser.weight.toString() : ''}
                value={updatedUser.weight.toString()}
                onChangeText ={value => handleChange('weight', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.input} onPress={toggleGoalModal}>
            <Text style={styles.modalText}>{goal || (currentUser ? currentUser.goal : '')}</Text>
          </TouchableOpacity>

          <Modal visible={goalModalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.modalText} onPress={toggleGoalModal} />
              <TouchableOpacity style={styles.modalItem} onPress={() => { setGoal('Gain Weight'); toggleGoalModal(); }}>
                <Text style={styles.modalText}>Gain Weight</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalItem} onPress={() => { setGoal('Lose Weight'); toggleGoalModal(); }}>
                <Text style={styles.modalText}>Lose Weight</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalItem} onPress={() => { setGoal('Maintain Weight'); toggleGoalModal(); }}>
                <Text style={styles.modalText}>Maintain Weight</Text>
              </TouchableOpacity>
            </View>
          </Modal>


          <Button title="Save" onPress={handleSave} />
          </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Dark background color
    color: '#ffffff', // Light text color
  },
  title: {
    paddingBottom: 150,
    justifyContent: 'flex-start',
    fontFamily: 'AvenirNextCondensed-Heavy',
    fontSize: 40,
    color: '#ffffff', // Light text color
  },  
  input: {
    height: 40,
    width: '80%',
    borderColor: '#ffffff', // Light border color
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    textAlign: 'center', // Center text horizontally
    backgroundColor: '#333333', // Dark background color
    color: 'white'
  },
  weightContainer: {
    flexDirection: 'row', // Display children side by side
    justifyContent: 'space-between', // Space evenly between children
    alignItems: 'center', // Center content horizontally
    width: '80%',
    borderRadius: 20, // Added borderRadius
    paddingHorizontal: 10, // Added paddingHorizontal for spacing
    paddingVertical: 10, // Added paddingVertical for spacing
    backgroundColor: '#333333', // Dark background color
    marginBottom: 20,
  },
  weightInput: {
    width: '48%', // Adjust width to accommodate both inputs with a small space between
    alignItems: 'center', // Center content horizontally
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark background
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc', // Light border color
  },
  inputLabel: {
    marginBottom: 5,
    color: '#ffffff', // Light text color
    fontSize: 14, // Adjust the font size of the label text
  },
  modalText: {
    color: '#555', // Set text color to #555
    justifyContent: 'center',
    textAlign: 'center',
  },  
});


export default Settings;