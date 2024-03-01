import React, { useState } from 'react';
import { styles } from './RegistrationStyles';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRegistration } from './RegistrationProvider'; // Adjust the import path as necessary

function Goals({ navigation }) {
    const { userData, handleChange } = useRegistration();
    const [selectedGoal, setSelectedGoal] = useState(userData.goal || '');

    const handleGoalSelection = (goal) => {
        setSelectedGoal(goal);
        handleChange('goal', goal);
    };

    return (
        <View style={styles.fullScreenContainer}>
            <View style={styles.contentContainer}>
            <Text style={styles.label}>What's your goal?</Text>
            <View style={styles.buttonContainer}>
                {['Maintain Weight', 'Gain Weight', 'Lose Weight'].map((goal) => (
                    <TouchableOpacity
                        key={goal}
                        style={[styles.button, selectedGoal === goal && styles.selectedButton]}
                        onPress={() => handleGoalSelection(goal)}
                    >
                        <Text style={styles.buttonText}>{goal}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('UserInformationGenderAge')}>
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
}

export default Goals;
