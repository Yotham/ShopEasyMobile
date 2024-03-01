import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
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

export default AccountInformation;