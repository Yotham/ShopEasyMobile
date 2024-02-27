import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRegistration } from './RegistrationProvider'; // Ensure the path is correct

function UserInformationGenderAge({ navigation }) {
    // Access global state and functions via useRegistration hook
    const { userData, handleChange } = useRegistration();

    // Utilize userData for gender and age, and manage changes with handleChange
    return (
        <View style={styles.container}>
            <Picker
                selectedValue={userData.gender} // Use gender from global state
                style={styles.input}
                onValueChange={(itemValue) => handleChange('gender', itemValue)} // Update global state on change
            >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
            </Picker>
            <TextInput
                style={styles.input}
                placeholder="Age"
                value={userData.age.toString()} // Use age from global state, ensure it's a string for TextInput
                onChangeText={(text) => handleChange('age', text)} // Update global state on change
                keyboardType="numeric"
            />
            <Button title="Next" onPress={() => navigation.navigate('UserInformationHeightWeight')} />
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

export default UserInformationGenderAge;