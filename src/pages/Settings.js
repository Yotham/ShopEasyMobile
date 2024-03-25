import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const navigation = useNavigation();

  const { currentUser } = useAuth();
  const username = currentUser ? currentUser.username : null;

  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [heightft, setHeightft] = useState('');
  const [heightcm, setHeightcm] = useState('');
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goal, setGoal] = useState('');

  const handleSave = () => {
    // Perform save operation here
    console.log('Saved!');
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


  

  const ftTocm = (ft) => {
    return (ft / 0.0328084).toFixed(2); // 1 pound is approximately 0.453592 kilograms
  };

  const cmToft = (cm) => {
    return (cm * 0.0328084).toFixed(2); // 1 kilogram is approximately 2.20462 pounds
  };

  const handleHeightftChange = (text) => {
    setHeightft(text);
    setHeightcm(ftTocm(parseFloat(text)).toString());
  };

  const handleHeightcmChange = (text) => {
    setHeightcm(text);
    setHeightft(cmToft(parseFloat(text)).toString());
  };


  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{flex: 1}}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{alignItems: 'center'}}>
          <View style={styles.container}>
            <Text style={styles.title}>Whats new, {username}? </Text>
            <Text style={styles.inputLabel}>Age</Text>
          <TextInput
            placeholderTextColor="#555"
            style={styles.input}
            placeholder={currentUser ? currentUser.age.toString() : ''} // Convert age to string
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />

          <Text style={styles.inputLabel}>Height</Text>
          <View style={styles.weightContainer}>
            <View style={styles.weightInput}>
              <Text style={styles.inputLabel}>feet</Text>
              <TextInput
                placeholderTextColor="#555"
                style={styles.input}
                placeholder={currentUser ? (currentUser.height * 0.0328084).toFixed(2) : ''}
                value={heightft}
                onChangeText={handleHeightftChange}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.weightInput}>
              <Text style={styles.inputLabel}>cm</Text>
              <TextInput
                placeholderTextColor="#555"
                style={styles.input}
                placeholder={currentUser ? (currentUser.height).toFixed(2) : ''}
                value={heightcm}
                onChangeText={handleHeightcmChange}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Weight</Text>
          <View style={styles.weightContainer}>
            <View style={styles.weightInput}>
              <Text style={styles.inputLabel}>lbs</Text>
              <TextInput
                placeholderTextColor="#555"
                style={styles.input}
                placeholder={currentUser ? currentUser.weight.toString() : ''}
                value={weightLbs}
                onChangeText={handleWeightLbsChange}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.weightInput}>
              <Text style={styles.inputLabel}>kg</Text>
              <TextInput
                placeholderTextColor="#555"
                style={styles.input}
                placeholder={currentUser ? (currentUser.weight * 0.453592).toFixed(2) : ''}
                value={weightKg}
                onChangeText={handleWeightKgChange}
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
  modalContent: {
    backgroundColor: '#333333', // Dark background color
    padding: 20,
    borderRadius: 10,
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