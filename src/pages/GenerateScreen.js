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
  const { handleLogout, setCurrentUser } = useAuth();
  const [selectedItem, setSelectedItem] = useState(null); // Initialize selectedItem state as null
  const navigation = useNavigation();
  const [showAverages, setShowAverages] = useState(false);
  const [generatePressed, setGeneratePressed] = useState(false);
  const isMounted = useRef(true);
  const [viewMode, setViewMode] = useState('meals'); // 'meals' or 'weeklyPlan'
  const [weeklyPlan, setWeeklyPlan] = useState([]);

  const [dailyAverages, setDailyAverages] = useState({
    calories: 0,
    protein: 0,
    fats: 0,
    carbs: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {setIsLoading(false);}, 500);
    return () => {
        clearTimeout(timer);
    isMounted.current = false;
    }
  }, []);

  useEffect(() => {
    if (generatePressed && randomItems.length > 0) {
      const totals = randomItems.reduce(
        (acc, item) => {
          acc.calories += item.caloriesPS;
          acc.protein += item.ProteinPS;
          acc.fats += item.FatPS;
          acc.carbs += item.CarbPS;
          return acc;
        },
        { calories: 0, protein: 0, fats: 0, carbs: 0 }
      );
  
      setDailyAverages({
        calories: totals.calories / 7,
        protein: totals.protein / 7,
        fats: totals.fats / 7,
        carbs: totals.carbs / 7,
      });
  
      setShowAverages(true); // Ensure this is set to show the averages
    }
  }, [randomItems, generatePressed]); // Depend on randomItems and generatePressed
  
  useEffect(() => {
    if (viewMode === 'weeklyPlan' && randomItems.length > 0) {
      const plan = distributeMealsWeekly(randomItems);
      setWeeklyPlan(plan);
    }
  }, [randomItems, viewMode]);  

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
    setGeneratePressed(true);
    if (currentUser && currentUser.caloricGoal) {
      const items = getRandomItems(selectedData, currentUser.caloricGoal);
      const totalCalories = items.reduce((acc, item) => acc + item.caloriesForAllServings * item.count, 0);
      console.log(`Total Calories: ${totalCalories}`);
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

    const totals = randomItems.reduce(
      (acc, item) => {
        acc.calories += item.caloriesPS;
        acc.protein += item.ProteinPS;
        acc.fats += item.FatPS;
        acc.carbs += item.CarbPS;
        return acc;
      },
      { calories: 0, protein: 0, fats: 0, carbs: 0 }
    );
  
    setDailyAverages({
      calories: totals.calories / 7,
      protein: totals.protein / 7,
      fats: totals.fats / 7,
      carbs: totals.carbs / 7,
    });
  
    setShowAverages(true);
  };

  const distributeMealsWeekly = (items) => {
    const totalCalories = items.reduce((acc, item) => acc + (item.caloriesPS * item.numServings * item.count), 0);
    const targetDailyCalories = totalCalories / 7;
  
    let days = Array(7).fill(null).map(() => ({ meals: [], totalCalories: 0 }));
  
    const sortedItems = items.sort((a, b) => (b.caloriesPS * b.numServings * b.count) - (a.caloriesPS * a.numServings * a.count));
  
    sortedItems.forEach(item => {
      let day = days.reduce((prev, current) => (prev.totalCalories < current.totalCalories) ? prev : current);
      day.meals.push(item);
      day.totalCalories += (item.caloriesPS * item.numServings * item.count);
    });
    return days.map(day => ({
      breakfast: day.meals[0] || null,
      lunch: day.meals[1] || null,
      dinner: day.meals[2] || null,
      totalCalories: day.totalCalories
    }));
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <IconButton
        icon="cog"
        size={20}
        style={styles.SettingsIcon}
        iconColor="white"
        onPress={() => {
          console.log('IconButton pressed');
          setShowMenu(true)
        }}
      />

      <Menu />

      <Picker
        selectedValue={selectedLabel}
        onValueChange={(itemValue) => handleSelectionChange(itemValue)}
        itemStyle={{color: "white", fontSize:17, top:0, height: 200 }}
      >
        <Picker.Item label="Hannaford" value="HannafordData" />
        <Picker.Item label="Trader Joe's" value="TraderJoesData" />
      </Picker>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
          <Text style={styles.generateButtonText}>Generate</Text>
        </TouchableOpacity>
      </View>
      
      {showAverages && (
        <View style={styles.averagesContainer}>
          <Text style={styles.averagesDetail}>Daily Averages:</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <Text style={styles.averagesDetail}>Calories: <Text style={styles.boldText}>{dailyAverages.calories.toFixed(2)}</Text></Text>
            <Text style={styles.averagesDetail}>Protein: <Text style={styles.boldText}>{dailyAverages.protein.toFixed(2)}g</Text></Text>
            <Text style={styles.averagesDetail}>Fats: <Text style={styles.boldText}>{dailyAverages.fats.toFixed(2)}g</Text></Text>
            <Text style={styles.averagesDetail}>Carbs: <Text style={styles.boldText}>{dailyAverages.carbs.toFixed(2)}g</Text></Text>
          </View>
        </View>
      )}

      {generatePressed && (
        <View style={styles.viewModeContainer}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'meals' ? styles.selectedButton : {}]}
            onPress={() => setViewMode('meals')}>
            <Text style={styles.viewModeButtonText}>Meals for the Week</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'weeklyPlan' ? styles.selectedButton : {}]}
            onPress={() => setViewMode('weeklyPlan')}>
            <Text style={styles.viewModeButtonText}>Weekly Plan</Text>
          </TouchableOpacity>
        </View>
      )}

      {viewMode === 'meals' && (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {randomItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => {
                setSelectedItem(randomItems[index]);
                setItemModalOpen(true);
              }}
            >
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {viewMode === 'weeklyPlan' && (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {weeklyPlan.map((day, index) => (
            <View key={index} style={styles.dayContainer}>
              <Text style={styles.dayTitle}>Day {index + 1}</Text>
              {day.breakfast && (
                <View style={styles.mealItem}>
                  <Text style={styles.mealItemText}>Breakfast: {day.breakfast.name}</Text>
                </View>
              )}
              {day.lunch && (
                <View style={styles.mealItem}>
                  <Text style={styles.mealItemText}>Lunch: {day.lunch.name}</Text>
                </View>
              )}
              {day.dinner && (
                <View style={styles.mealItem}>
                  <Text style={styles.mealItemText}>Dinner: {day.dinner.name}</Text>
                </View>
              )}
              <Text style={styles.mealItemText}>Total Calories: {day.totalCalories.toFixed(2)}</Text>
            </View>
          ))}
        </ScrollView>
      )}
      
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
            <Text style={styles.modalTitle}>{selectedItem && selectedItem.name}</Text>
            <Text style={styles.modalText}>Serving Size: <Text style={{fontWeight: 'bold'}}>{selectedItem && selectedItem.servingSize}</Text></Text>
            <Text style={styles.modalText}>Number of Servings: <Text style={{fontWeight: 'bold'}}>{selectedItem && Math.round(selectedItem.numServings)}</Text></Text>
            <Text style={styles.modalText}>Calories Per Serving: <Text style={{fontWeight: 'bold'}}>{selectedItem && selectedItem.caloriesPS}</Text></Text>
            <Text style={styles.modalText}>Protein Per Serving: <Text style={{fontWeight: 'bold'}}>{selectedItem && selectedItem.ProteinPS} g</Text></Text>
            <Text style={styles.modalText}>Fat Per Serving: <Text style={{fontWeight: 'bold'}}>{selectedItem && selectedItem.FatPS} g</Text></Text>
            <Text style={styles.modalText}>Carbs Per Serving: <Text style={{fontWeight: 'bold'}}>{selectedItem && selectedItem.CarbPS} g</Text></Text>
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
    backgroundColor: '#2272FF',
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
  SettingsIcon: {
    top: -15,
    right: -320
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
    backgroundColor: '#2272FF',
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

  averagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'space-evenly', 
    alignItems: 'center', 
    marginTop: 10, 
  },
  averagesDetail: {
    color: '#ffffff',
    fontSize: 12,
    marginHorizontal: 5,
  },
  mealsTitle: {
    color: '#ffffff',
    fontSize: 16,
    marginHorizontal: 5,
    marginTop: 20
  },
  boldText: {
    fontWeight: 'bold',
  },
  viewModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  viewModeButton: {
    marginHorizontal: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  selectedButton: {
    backgroundColor: 'grey',
  },
  viewModeButtonText: {
    color: 'white',
  },
  weeklyPlanContainer: {
    padding: 10,
    marginTop: 10,
  },
  dayContainer: {
    alignItems: 'center', 
    backgroundColor: '#2a2e35',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  
  mealItem: {
    alignSelf: 'stretch',
    backgroundColor: '#3a3e45',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,

  },
  mealItemText: {
    color: '#ffffff',
    fontSize: 16,
  },
  
});

export default GenerateScreen;
