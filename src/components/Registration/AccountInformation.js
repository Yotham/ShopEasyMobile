import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useRegistration } from './RegistrationProvider';
import { useNavigation } from '@react-navigation/native';

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
          Alert.alert('Registration Failed', 'Please try again.');
      }
  };

  return (
      <View style={styles.container}>
          <TextInput
              style={styles.input}
              placeholder="Username"
              value={userData.username}
              onChangeText={(text) => handleChange('username', text)}
          />
          <TextInput
              style={styles.input}
              placeholder="Password"
              value={userData.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry={true}
          />
          <Button title="Finish" onPress={handleFinishPress} />
      </View>
  );
}

const styles = StyleSheet.create({
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20, // Consider the overall padding for the screen, not just the modal
    },
    form: {
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 10,
      borderColor: '#e0e0e0',
      borderWidth: 1,
      borderRadius: 8,
      width: 300, // You might want to use a percentage or 'auto' for responsive design
      backgroundColor: '#f5f5f5',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.2,
      shadowRadius: 15,
      elevation: 20, // elevation for Android shadow
    },
    label: {
      flexDirection: 'column',
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 10, // Assuming you want some space between labels
    },
    input: {
      padding: 5,
      borderRadius: 4,
      borderColor: '#ccc',
      borderWidth: 1,
      fontSize: 14,
      marginBottom: 5, // To replicate 'gap' for inputs
    },
    inputFocus: {
      borderColor: '#007BFF',
      // React Native does not have a pseudo-class like ':focus', handling focus requires state management
    },
    submitButton: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: '#007BFF',
      borderRadius: 4,
      color: '#fff', // Color property is not used for background color in React Native
      fontSize: 14,
      textAlign: 'center', // Align text inside the button
      marginBottom: 10, // To replicate 'gap' for the button
    },
    submitButtonHover: {
      backgroundColor: '#0056b3', // Note: ':hover' is not supported, you might use Touchable opacity or similar for feedback
    },
  });

export default AccountInformation;