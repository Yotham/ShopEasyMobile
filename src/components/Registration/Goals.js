import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRegistration } from './RegistrationProvider'; // Adjust the import path as necessary

function Goals({ navigation }) {
    // Use useRegistration hook to access and modify the global state
    const { userData, handleChange } = useRegistration();

    // Use userData.goal as the Picker's selected value
    // Update the goal in the global state using handleChange
    return (
        <View style={styles.container}>
            <Text style={styles.label}>What's your goal?</Text>
            <Picker
                selectedValue={userData.goal} // Use the goal from the global state
                style={styles.input}
                onValueChange={(itemValue) => handleChange('goal', itemValue)} // Update the global state
            >
                <Picker.Item label="Maintain Weight" value="Maintain Weight" />
                <Picker.Item label="Gain Weight" value="Gain Weight" />
                <Picker.Item label="Lose Weight" value="Lose Weight" />
            </Picker>
            <Button title="Next" onPress={() => navigation.navigate('UserInformationGenderAge')} />
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

export default Goals;