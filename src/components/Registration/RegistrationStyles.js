import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: '#121212', // Dark mode background color
    },
    contentContainer: {
        height: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    label: {
        color: '#FFFFFF', // Dark mode text color
        fontSize: 18,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '50%',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#333333', // Dark mode button background
        padding: 10,
        borderRadius: 20,
        marginBottom: 10,
    },
    selectedButton: {
        backgroundColor: '#007BFF', // Highlight selected button
    },
    buttonText: {
        color: '#FFFFFF', // Dark mode button text color
        textAlign: 'center',
    },
    nextButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 20,
    },
    nextButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Align items to the start to keep input and label close
        alignItems: 'center',
        width: '60%', // Adjust this based on the desired width + label
        alignSelf: 'center', // This centers the container
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 5,
    },
    
    input: {
        color: '#FFFFFF',
        textAlign: 'center',
        width: '50%', // This will be overridden in the component to adjust dynamically
    },
    
    inputLabel: {
        color: '#FFFFFF',
        // Position adjustments if necessary
    },
});