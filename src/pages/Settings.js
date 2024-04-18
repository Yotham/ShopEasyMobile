import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Modal,
  ScrollView,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

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
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleGoalSelection = (selectedGoal) => {
    setGoal(selectedGoal);
    setDropdownVisible(false);
  };

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <View style={styles.row}>

                <Text style={styles.rowLabel}>Age</Text>

                <View style={[styles.rowSpacer, { flexDirection: 'row', alignItems: 'center' }]}>
                    {/* Empty space to push the text further right */}
                    <View style={{ flex: 1 }}></View>

                    {/* Text input */}
                    <TextInput
                    style={{ backgroundColor: '#ccc', borderRadius: 8, padding: 8, marginLeft: 8 }}
                    placeholderTextColor="#999"
                    placeholder="Age"
                    value={updatedUser.age.toString()}
                    onChangeText={value => handleChange('age', value)}
                    keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={styles.row}>

                <Text style={styles.rowLabel}>Height</Text>

                <View style={[styles.rowSpacer, { flexDirection: 'row', alignItems: 'center' }]}>
                    {/* Empty space to push the text further right */}
                    <View style={{ flex: 1 }}></View>

                    {/* Text input */}
                    <TextInput
                        placeholderTextColor="#555"
                        style={{ backgroundColor: '#ccc', borderRadius: 8, padding: 8, marginLeft: 8 }}
                        placeholder={currentUser ? currentUser.height.toString() : ''}
                        value={updatedUser.height[0].toString()}
                        onChangeText={value => handleHeightChange('feet', value)}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={{ backgroundColor: '#ccc', borderRadius: 8, padding: 8, marginLeft: 8 }}
                        placeholderTextColor="#555"
                        placeholder={currentUser ? (currentUser.height.toString() * 0.453592).toFixed(2) : ''}
                        value={updatedUser.height[1].toString()}
                        onChangeText={value => handleHeightChange('inches', value)}
                        keyboardType="numeric"
                    />
                    
                </View>
            </View>

            <View style={styles.row}>

                <Text style={styles.rowLabel}>Weight</Text>

                <View style={[styles.rowSpacer, { flexDirection: 'row', alignItems: 'center' }]}>
                    {/* Empty space to push the text further right */}
                    <View style={{ flex: 1 }}></View>

                    {/* Text input */}
                    <TextInput
                    style={{ backgroundColor: '#ccc', borderRadius: 8, padding: 8, marginLeft: 8 }}
                    placeholderTextColor="#999"
                    placeholder={currentUser && currentUser.weight !== null ? currentUser.weight.toString() : ''}
                    value={updatedUser.weight.toString()}
                    onChangeText ={value => handleChange('weight', value)}
                    keyboardType="numeric"
                    />
                </View>
            </View>
            <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
                <View style={styles.row}>
                    <Text style={styles.rowLabel}>Goal</Text>
                    <View style={[styles.rowSpacer, { flexDirection: 'row', alignItems: 'center' }]}>
                    {/* Empty space to push the text further right */}
                    <View style={{ flex: 1 }}></View>
                    {/* Text input */}
                    <Text
                        style={{ backgroundColor: '#ccc', borderRadius: 8, padding: 8, marginLeft: 8, overflow: 'hidden' }}
                        placeholderTextColor="#999"
                        value={updatedUser.goal.toString()}
                        onChangeText={value => handleChange('goal', value)}
                    />
                    </View>
                </View>
            </TouchableOpacity>

            {dropdownVisible && (
                <View style={styles.dropdown}>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => handleGoalSelection('Gain Weight')}>
                    <Text style={styles.dropdownText}>Gain Weight</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => handleGoalSelection('Lose Weight')}>
                    <Text style={styles.dropdownText}>Lose Weight</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dropdownItem} onPress={() => handleGoalSelection('Maintain Weight')}>
                    <Text style={styles.dropdownText}>Maintain Weight</Text>
                </TouchableOpacity>
                </View>
            )}
                            
            


            <Button title="Save" onPress={handleSave} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Section */
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#9e9e9e',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '400',
    color: '#0c0c0c',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    marginTop: 8,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Settings;