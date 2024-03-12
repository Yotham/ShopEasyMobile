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
        marginTop: 30,

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
        borderRadius: 15,
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
        borderRadius: 15,
        marginTop: 30,
    },
    nextButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Centers the TextInput
        alignItems: 'center',
        width: '60%', // Container width
        alignSelf: 'center', // Centers the container
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 5,
        position: 'relative', // Needed for absolute positioning of the label
    },
        
    input: {
        color: '#FFFFFF',
        textAlign: 'center',
        width: '70%', // Adjust if necessary to ensure the input is centered
        // Ensure the input takes full height to align text vertically
        height: '100%',
    },
    
    inputLabel: {
        color: '#FFFFFF',
        position: 'absolute', // Position the label absolutely within the container
        right: 10, // Adjust this value to set the offset from the right (end of the container)
        // Add height and line height if the label's vertical alignment is off
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    
});