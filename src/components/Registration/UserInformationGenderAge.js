import React from 'react';
import { View, TextInput, TouchableOpacity, Text, Button, StyleSheet } from 'react-native';
import { useRegistration } from './RegistrationProvider'; // Ensure the path is correct
import { styles } from './RegistrationStyles'; // Assuming styles are defined here

function UserInformationGenderAge({ navigation }) {
    const { userData, handleChange } = useRegistration();

    const selectGender = (gender) => {
        handleChange('gender', gender);
    };

    return (
        <View style={styles.fullScreenContainer}>
            <View style={styles.contentContainer}>
            <Text style={styles.label}>What's your gender?</Text>
            <View style={styles.buttonContainer}>
                {['Male', 'Female', 'Other'].map((gender) => (
                    <TouchableOpacity
                        key={gender}
                        style={[
                            styles.button,
                            userData.gender === gender && styles.selectedButton,
                        ]}
                        onPress={() => selectGender(gender)}
                    >
                        <Text style={styles.buttonText}>{gender}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.label}>How old are you ?</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Age"
                    placeholderTextColor="#555"
                    value={userData.age.toString()} // Convert age to string for TextInput
                    onChangeText={(text) => handleChange('age', text)} // Update global state on change
                    keyboardType="numeric"
                    maxLength={3}
                />
            </View>
            <TouchableOpacity
                style={[styles.nextButton, !userData.age ? { opacity: 0.5 } : {}]} // Make button look disabled if no age
                onPress={() => {
                    if (userData.age) { // Check if age is not empty
                        navigation.navigate('UserInformationHeightWeight');
                    }
                }}
            >
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
}

export default UserInformationGenderAge;
