import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInPage from './src/pages/LogInPage';
import * as Registration from './src/components/Registration';
import { RegistrationProvider } from './src/components/Registration/RegistrationProvider';
import GenerateScreen from './src/pages/GenerateScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoadingScreen from './src/components/LoadingScreen';
import Settings from './src/pages/Settings';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  const { userLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      {userLoggedIn ? (
        // User is logged in
        <>
          <Stack.Screen name="Home" component={GenerateScreen} />
          <Stack.Screen name="Settings" component={Settings} />
        </>
      ) : (
        // User is not logged in
        <>
          <Stack.Screen name="LogIn" component={LogInPage} options={{ headerShown: false }}/>
          <Stack.Screen name="Goals" component={Registration.Goals} options={{ title: 'Goals' }}/>
          <Stack.Screen name="UserInformationGenderAge" component={Registration.UserInformationGenderAge} options={{ title: 'About You' }}/>
          <Stack.Screen name="UserInformationHeightWeight" component={Registration.UserInformationHeightWeight} options={{ title: 'About You' }}/>
          <Stack.Screen name="AccountInformation" component={Registration.AccountInformation} options={{ title: 'Create Account' }}/>
        </>
      )}
    </Stack.Navigator>
  );
}

function App() {
  return (
    <AuthProvider>
      {/* Wrap NavigationContainer with RegistrationProvider here */}
      <RegistrationProvider>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </RegistrationProvider>
    </AuthProvider>
  );
}

export default App;
