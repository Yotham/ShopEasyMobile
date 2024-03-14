import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Button, StyleSheet } from 'react-native';
import { useRegistration } from './RegistrationProvider';
import { useNavigation } from '@react-navigation/native';
import { styles } from './RegistrationStyles';

function AccountInformation() {
  const { userData, handleChange, handleSubmit } = useRegistration();
  const navigation = useNavigation(); // Use the useNavigation hook here

  // Update the onPress handler for the "Finish" button
  const handleFinishPress = async () => {
      // Assuming handleSubmit now returns a promise that resolves to a boolean
      const success = await handleSubmit();
      if (success) {
          // Navigate to the 'Home' screen upon successful registration
          navigation.navigate('Home');
      } else {
          // Optionally handle the failure case, e.g., show an alert
          navigation.navigate('AccountInformation');
      }
  };

  return (
    <View style={styles.fullScreenContainer}>
        <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#555"
                value={userData.username}
                onChangeText={(text) => handleChange('username', text)}
                keyboardType= 'default'
                onFocus={() => handleChange('username', "")}
            />
        </View>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#555"
                value={userData.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry={true}
                keyboardType= 'default'
            />
        </View>
        <TouchableOpacity
            style={[styles.nextButton, !userData.username || !userData.password ? { opacity: 0.5 } : {}]}
            onPress={() => {
                if (userData.username && userData.password) { // Check if age is not empty
                    handleFinishPress();
                }
            }}
            >
            <Text style={styles.nextButtonText}>Finish</Text>
        </TouchableOpacity>
        </View>
    </View>
  );
}

export default AccountInformation;