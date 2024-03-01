import React from 'react';
import { View, TextInput, TouchableOpacity, Text, Button, StyleSheet } from 'react-native';
import { useRegistration } from './RegistrationProvider';
import { styles } from './RegistrationStyles'; // Ensure your styles are defined here

function UserInformationHeightWeight({ navigation }) {
    const { userData, handleChange } = useRegistration();

    return (
        <View style={styles.fullScreenContainer}>
            <View style={styles.contentContainer}>
            <Text style={styles.label}>How tall are you?</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Height (Feet)"
                        value={userData.heightFeet.toString()} // Ensure it's a string for TextInput
                        onChangeText={(text) => handleChange('heightFeet', text)} // Update global state
                        keyboardType="numeric"
                    />
                    <Text style={styles.inputLabel}>feet</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Height (Inches)"
                        value={userData.heightInches.toString()} // Ensure it's a string for TextInput
                        onChangeText={(text) => handleChange('heightInches', text)} // Update global state
                        keyboardType="numeric"
                    />
                    <Text style={styles.inputLabel}>inches</Text>
                </View>
                <Text style={styles.label}>How much do you weigh?</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input} // Keep original input styles, ensure text aligns right
                        placeholder="Weight"
                        value={userData.weight.toString()} // Ensure it's a string for TextInput
                        onChangeText={(text) => handleChange('weight', text)} // Update global state
                        keyboardType="numeric"
                    />
                    <Text style={styles.inputLabel}>lbs</Text>
                </View>
                <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('AccountInformation')}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default UserInformationHeightWeight;
