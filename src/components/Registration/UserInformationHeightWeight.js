import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useRegistration } from './RegistrationProvider'; // Ensure the import path is correct

function UserInformationHeightWeight({ navigation }) {
    // Access global state and handleChange function from context
    const { userData, handleChange } = useRegistration();

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Height (Feet)"
                value={userData.heightFeet} // Use heightFeet from global state
                onChangeText={(text) => handleChange('heightFeet', text)} // Update global state
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Height (Inches)"
                value={userData.heightInches} // Use heightInches from global state
                onChangeText={(text) => handleChange('heightInches', text)} // Update global state
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Weight"
                value={userData.weight} // Use weight from global state
                onChangeText={(text) => handleChange('weight', text)} // Update global state
                keyboardType="numeric"
            />
            <Button title="Next" onPress={() => navigation.navigate('AccountInformation')} />
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

export default UserInformationHeightWeight;