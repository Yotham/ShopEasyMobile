import React, { createContext, useState, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegistrationContext = createContext();

export const useRegistration = () => useContext(RegistrationContext);

export const RegistrationProvider = ({ children }) => {
    const { register } = useAuth();
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        heightFeet: '5',
        heightInches: '0',
        weight: '',
        gender: 'Male',
        goal: 'Maintain Weight',
        age: ''
    });

    const handleChange = (name, value) => {
        setUserData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
      // Conversions
      const heightInCm = ((parseInt(userData.heightFeet, 10) * 12) + parseInt(userData.heightInches, 10)) * 2.54;

      const weightInKg = userData.weight * 0.453592;
      
      // BMR Calculation using userData.age
      let bmr;
      if (userData.gender === "Male") {
          bmr = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * userData.age);
      } else if (userData.gender === "Female") {
          bmr = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * userData.age);
      } else {  // For "Other" gender
          const bmrMale = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * userData.age);
          const bmrFemale = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * userData.age);
          bmr = (bmrMale + bmrFemale) / 2;
      }
  
      // Caloric Goal Calculation
      let caloricGoal;
      if (userData.goal === "Lose Weight") {
          caloricGoal = bmr - 500; // Subtract 500 calories for weight loss
      } else if (userData.goal === "Gain Weight") {
          caloricGoal = bmr + 500; // Add 500 calories for weight gain
      } else {
          caloricGoal = bmr; // Maintain current weight
      }
  
      // Prepare user data for registration
      const userRegistrationData = {
          username: userData.username,
          password: userData.password,
          height: heightInCm,
          weight: userData.weight,
          gender: userData.gender,
          goal: userData.goal,
          age: userData.age,
          bmr: bmr,
          caloricGoal: caloricGoal
      };
      try {
          const isRegistrationSuccessful = await register(userRegistrationData);
          if (isRegistrationSuccessful) {
              // Navigate only if registration was successful
              return isRegistrationSuccessful;
          } else {
              // Handle registration failure as needed
              console.log("Registration failed");
              return false;
          }
      } catch (error) {
          console.error("Registration Error", error);
          return false;
      }    
    };

    return (
        <RegistrationContext.Provider value={{ userData, handleChange, handleSubmit }}>
            {children}
        </RegistrationContext.Provider>
    );
};

export default RegistrationProvider;