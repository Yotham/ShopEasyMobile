// Import React Native components and hooks
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Modal, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Assuming you'll use Picker for dropdowns
import { useAuth } from '../context/AuthContext'; // Adjust this import based on your React Native project structure
import getRandomItems from '../components/ListGeneration.js';
import { IconButton } from 'react-native-paper';

import HannafordData from '../Data/HannafordData.json';
import TraderJoesData from '../Data/TraderJoesData.json';

const GenerateScreen = () => {
  const [randomItems, setRandomItems] = useState([]);
  const [isItemModalOpen, setItemModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('HannafordData');
  const [selectedData, setSelectedData] = useState(HannafordData); // Adapt data loading for React Native
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth(); // Make sure your authentication context is adapted for React Native
  const [showMenu, setShowMenu] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => {
        clearTimeout(timer);
    isMounted.current = false;
    }
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.centeredView, styles.primaryBg]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  const handleSelectionChange = (selectedValue) => {
    setSelectedLabel(selectedValue); // Update the label
    setSelectedData(selectedValue === 'HannafordData' ? HannafordData : TraderJoesData); // Update the data
  };

  const logout = async () => {
    try {
        await handleLogout();
    } catch (error) {
        if (isMounted.current) {
            console.error("Logout Error", error);
        }
    }
    };

  const Menu = () => (
    <Modal
        animationType="fade"
        transparent={true}
        visible={showMenu}
        onRequestClose={() => {
            setShowMenu(!showMenu);
        }}>
        <TouchableOpacity
            style={styles.menuOverlay}
            activeOpacity={1}
            onPressOut={() => setShowMenu(false)}>
            <View style={styles.menuContainer}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                        navigation.navigate('Settings'); 
                        // Implement Account Settings functionality here
                        setShowMenu(false);
                    }}>
                    <Text style={styles.menuItemText}>Account Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                        logout();
                    }}>
                    <Text style={styles.menuItemText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    </Modal>
    );

  const handleGenerate = () => {
    if (currentUser && currentUser.caloricGoal) {
      const items = getRandomItems(selectedData, currentUser.caloricGoal);
      const itemObjects = items.map(item => {
        // Assuming item structure is { name, pageNumber, count }
        // And selectedData is an array or object from which we can retrieve additional details
        const productData = selectedData[item.pageNumber][item.name];

        return {
          name: item.name,
          link: productData.link,
          servingSize: productData.Nutrition.servingSize,
          numServings: productData.Nutrition.numServings,
          caloriesPS: productData.Nutrition.CaloriesPS,
          FatPS: productData.Nutrition.FatPS,
          CarbPS: productData.Nutrition.CarbPS,
          ProteinPS: productData.Nutrition.ProteinPS,
          count: item.count,
        };
      });

      setRandomItems(itemObjects);
    } else {
      alert('Please log in to generate items based on your nutritional goals.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <IconButton
                icon="cog"
                size={20}
                style={styles.gearIcon}
                color="white"
                onPress={() => {
                    console.log('IconButton pressed');
                    setShowMenu(true)
                }}
            />
        <Menu />
        <Picker
        selectedValue={selectedLabel}
        onValueChange={(itemValue) => handleSelectionChange(itemValue)}
        itemStyle={{color: "white", fontSize:17, top:-30 }}
      >
        <Picker.Item label="Hannaford" value="HannafordData" />
        <Picker.Item label="Trader Joe's" value="TraderJoesData" />
      </Picker>


        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
            <Text style={styles.generateButtonText}>Generate</Text>
        </TouchableOpacity>
        </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Adapt UI components for React Native */}
        {randomItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.item} onPress={() => setItemModalOpen(true)}>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isItemModalOpen}
        onRequestClose={() => {
          setItemModalOpen(!isItemModalOpen);
        }}
      >
        {/* Modal Content */}
      </Modal>
      </SafeAreaView>
  );
};

// Define styles
const styles = StyleSheet.create({
    generateButton: {
        backgroundColor: '#0066cc',
        padding: 10,
        marginTop: -80,
        borderRadius: 5,
        width: '50%',
      },
    generateButtonText: {
        color: '#ffffff',
        textAlign: 'center',
      },
      buttonContainer: { // Adjust button width as needed
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      },
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark mode background color
  },
  scrollViewContent: {
    padding: 10,
  },
  item: {
    backgroundColor: '#1e1e1e', // Darker element background for contrast
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
  },
  itemText: {
    color: '#ffffff', // Text color for dark mode
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBg: {
    backgroundColor: '#121212',
  },
  gearIcon: {
    right: -330,
    top: -10,
},
  // Additional styles...
});

export default GenerateScreen;
