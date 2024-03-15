import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
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


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Whats new, {username}? </Text>
      <Text style={styles.inputLabel}>Age</Text>
    <TextInput
      style={styles.input}
      placeholder={currentUser ? currentUser.age.toString() : ''} // Convert age to string
      value={age}
      onChangeText={setAge}
      keyboardType="numeric"
    />

    <Text style={styles.inputLabel}>Height (cm)</Text>
    <TextInput
      style={styles.input}
      placeholder={currentUser ? currentUser.height.toString() : ''}
      value={height}
      onChangeText={setHeight}
      keyboardType="numeric"
    />

<Text style={styles.inputLabel}>Weight</Text>
<View style={styles.weightContainer}>
    <View style={styles.weightInput}>
      <Text style={styles.inputLabel}>lbs</Text>
      <TextInput
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
        style={styles.input}
        placeholder={currentUser ? (currentUser.weight * 0.453592).toFixed(2) : ''}
        value={weightKg}
        onChangeText={handleWeightKgChange}
        keyboardType="numeric"
      />
    </View>
  </View>

    <TouchableOpacity style={styles.input} onPress={toggleGoalModal}>
      <Text>{goal || (currentUser ? currentUser.goal : '')}</Text>
    </TouchableOpacity>

    <Modal visible={goalModalVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.modalBackground} onPress={toggleGoalModal} />
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalItem} onPress={() => { setGoal('Gain Weight'); toggleGoalModal(); }}>
            <Text>Gain Weight</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem} onPress={() => { setGoal('Lose Weight'); toggleGoalModal(); }}>
            <Text>Lose Weight</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem} onPress={() => { setGoal('Maintain Weight'); toggleGoalModal(); }}>
            <Text>Maintain Weight</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    <Button title="Save" onPress={handleSave} />
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    paddingBottom: 150,
    justifyContent: 'flex-start',
    fontFamily: 'AvenirNextCondensed-Heavy',
    fontSize: 40,
    marginBottom: 20,
  },  
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    textAlign: 'center', // Center text horizontally
  },
  weightContainer: {
    flexDirection: 'row', // Display children side by side
    justifyContent: 'space-between', // Space evenly between children
    alignItems: 'center', // Center content horizontally
    width: '80%',
    borderRadius: 20, // Added borderRadius
    paddingHorizontal: 10, // Added paddingHorizontal for spacing
    paddingVertical: 10, // Added paddingVertical for spacing
    backgroundColor: '#ffffff',
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
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inputLabel: {
    marginBottom: 5,
    color: 'black', // Set the color of the label text
    fontSize: 14, // Adjust the font size of the label text
  },
});

export default Settings;