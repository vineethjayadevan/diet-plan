const calculateBMR = (weight, height, age, gender) => {
    // Mifflin-St Jeor Equation
    let s = gender.toLowerCase() === 'male' ? 5 : -161;
    return (10 * weight) + (6.25 * height) + (5 * age) + s;
};

const calculateTargetCalories = (bmr, goal) => {
    const tdee = bmr * 1.55; // Moderate activity assumed for simplicity
    if (goal === 'loss') return Math.round(tdee - 500);
    if (goal === 'gain') return Math.round(tdee + 500);
    return Math.round(tdee);
};

const generateMealPlan = (calories, type) => {
    // Simple logic to distribute calories
    const breakfast = Math.round(calories * 0.25);
    const lunch = Math.round(calories * 0.35);
    const dinner = Math.round(calories * 0.30);
    const snack = Math.round(calories * 0.10);

    const foods = {
        'veg': {
            breakfast: ['Oatmeal with Fruits', 'Poha with Peanuts', 'Vegetable Upma'],
            lunch: ['Roti + Dal + Sabzi', 'Brown Rice + Paneer Curry', 'Mixed Veg Salad'],
            dinner: ['Vegetable Soup', 'Grilled Paneer Salad', 'Lentil Soup with Toast'],
            snack: ['Almonds & Green Tea', 'Fruit Salad', 'Roasted Chickpeas']
        },
        'non-veg': {
            breakfast: ['Scrambled Eggs + Toast', 'Chicken Sausage Omelet', 'Boiled Eggs + Fruit'],
            lunch: ['Grilled Chicken Breast + Rice', 'Fish Curry + Roti', 'Egg Curry + Rice'],
            dinner: ['Lemon Herb Chicken', 'Grilled Fish + Veggies', 'Chicken Soup'],
            snack: ['Protein Shake', 'Boiled Egg', 'Greek Yogurt']
        }
    };

    const diet = foods[type.includes('non') ? 'non-veg' : 'veg'];

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    return {
        breakfast: { item: getRandom(diet.breakfast), calories: breakfast },
        lunch: { item: getRandom(diet.lunch), calories: lunch },
        dinner: { item: getRandom(diet.dinner), calories: dinner },
        snack: { item: getRandom(diet.snack), calories: snack }
    };
};

module.exports = { calculateBMR, calculateTargetCalories, generateMealPlan };
