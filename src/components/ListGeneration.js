export function getRandomItems(data, caloricGoal, minMeals = 10) {
    caloricGoal *= 7; // Convert to weekly goal
    let allItems = [];

    // Gather all valid items and their nutritional information
    Object.entries(data).forEach(([pageNumber, items]) => {
        Object.entries(items).forEach(([name, {Nutrition: nutrition}]) => {
            if (Object.keys(nutrition).length > 1 || (Object.keys(nutrition).length === 1 && !("None" in nutrition))) {
                const caloriesForAllServings = nutrition.numServings * ((nutrition.ProteinPS * 4) + (nutrition.CarbPS * 4) + (nutrition.FatPS * 9));
                if (!isNaN(caloriesForAllServings)) {
                    allItems.push({ name, pageNumber, caloriesForAllServings, numServings: nutrition.numServings });
                }
            }
        });
    });

    // Shuffle allItems to ensure a random selection
    allItems = allItems.sort(() => 0.5 - Math.random());

    // Initial selections
    let selectedItems = [];
    let totalCalories = 0;

    const tryAddItem = (item) => {
        const newTotal = totalCalories + item.caloriesForAllServings;
        if (newTotal <= caloricGoal && selectedItems.length < minMeals) {
            selectedItems.push({ ...item, count: 1 });
            totalCalories = newTotal;
            return true;
        }
        return false;
    };

    allItems.forEach(item => {
        // Try to add each item; if it doesn't fit, move on
        tryAddItem(item);

        // Early exit if close to caloric goal
        if (totalCalories >= caloricGoal) return;
    });

    // Ensure selectedItems meet the minimum meal requirement, if possible
    while (selectedItems.length < minMeals && allItems.length > selectedItems.length) {
        const item = allItems.find(i => !selectedItems.includes(i));
        if (item && !tryAddItem(item)) break; // Stop if we can't add without exceeding the goal
    }

    // Adjust counts for variety, if needed, without exceeding caloricGoal
    selectedItems.forEach((item, index) => {
        while (item.count < 3) { // Allow up to 3 of each item
            if (totalCalories + item.caloriesForAllServings <= caloricGoal) {
                item.count++;
                totalCalories += item.caloriesForAllServings;
            } else {
                break; // Exit if adding another would exceed caloricGoal
            }
        }
    });

    return selectedItems;
}

export default getRandomItems