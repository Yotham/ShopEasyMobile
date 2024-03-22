import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Modal, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import getRandomItems from '../components/ListGeneration.js';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import HannafordData from '../Data/HannafordData.json';
import TraderJoesData from '../Data/TraderJoesData.json';

const GenerateScreen = () => {
  const [randomItems, setRandomItems] = useState([]);
  const [isItemModalOpen, setItemModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('HannafordData');
  const [selectedData, setSelectedData] = useState(HannafordData);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Initialize selectedItem state as null
  const navigation = useNavigation();
  const isMounted = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {setIsLoading(false);}, 500);
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
    setSelectedLabel(selectedValue);
    setSelectedData(selectedValue === 'HannafordData' ? HannafordData : TraderJoesData);
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
        {randomItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => {
              setSelectedItem(randomItems[index]); // Update selectedItem state with the details of the selected item
              setItemModalOpen(true);
            }}
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {isItemModalOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setItemModalOpen(false)} // Close the modal when clicking on the overlay
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={isItemModalOpen}
            onRequestClose={() => {
              setItemModalOpen(false);
            }}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Item Details</Text>
              <Text style={styles.modalText}>Name: {selectedItem && selectedItem.name}</Text>
              <Text style={styles.modalText}>Serving Size: {selectedItem && selectedItem.servingSize}</Text>
              <Text style={styles.modalText}>Number of Servings: {selectedItem && selectedItem.numServings}</Text>
              <Text style={styles.modalText}>Calories Per Serving: {selectedItem && selectedItem.caloriesPS}</Text>
              {/* Add more details as needed */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setItemModalOpen(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}  

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
  buttonContainer: { 
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollViewContent: {
    padding: 10,
  },
  item: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,
  },
  itemText: {
    color: '#ffffff',
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
  menuOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    marginTop: 150, 
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 200,
  },
  menuItemText: {
    fontSize: 16,
  },

  modalContainer: {
    backgroundColor: 'gray',
    marginTop: '50%',
    marginLeft: '10%',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: 'white',
  },

  modalText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },

  closeButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },

  closeButtonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});

export default GenerateScreen;
