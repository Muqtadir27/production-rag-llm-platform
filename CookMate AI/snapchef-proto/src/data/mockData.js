export const mockPantry = [
    { id: 1, name: 'Organic Eggs', quantity: 6, unit: 'pcs', category: 'Protein', expiry: 'Fresh', icon: '🥚' },
    { id: 2, name: 'Whole Milk', quantity: 1, unit: 'L', category: 'Dairy', expiry: 'Expires Tomorrow', isExpiring: true, icon: '🥛' },
    { id: 3, name: 'Avocados', quantity: 3, unit: 'pcs', category: 'Produce', expiry: '5 days left', icon: '🥑' },
    { id: 4, name: 'Sourdough Bread', quantity: 1, unit: 'loaf', category: 'Bakery', expiry: '2 days left', icon: '🍞' },
    { id: 5, name: 'Cherry Tomatoes', quantity: 200, unit: 'g', category: 'Produce', expiry: 'Fresh', icon: '🍅' },
    { id: 6, name: 'Pasta', quantity: 500, unit: 'g', category: 'Pantry', expiry: 'Long life', icon: '🍝' },
];

export const mockRecipes = [
    {
        id: 101,
        title: 'One-Pan Student Pasta',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=2080&auto=format&fit=crop',
        matchPercentage: 98,
        time: '15 mins',
        difficulty: 'Easy',
        calories: '450 kcal',
        protein: '12g',
        tags: ['Student Hack', 'One Pan'],
        missingIngredients: [],
        servings: 2,
        ingredients: [
            { name: 'Pasta', amount: '200g' },
            { name: 'Cherry Tomatoes', amount: '100g' },
            { name: 'Olive Oil', amount: '2 tbsp' },
            { name: 'Garlic', amount: '2 cloves' },
            { name: 'Basil', amount: 'Handful' }
        ],
        steps: [
            { id: 1, text: 'Boil water in a large pan and add salt.', time: 300 },
            { id: 2, text: 'Add pasta and cook for 10 minutes.', time: 600 },
            { id: 3, text: 'In a separate pan, sauté garlic and tomatoes.', time: 180 },
            { id: 4, text: 'Mix pasta with the sauce and serve with basil.', time: 60 }
        ]
    },
    {
        id: 102,
        title: 'Gourmet Grilled Cheese',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=2073&auto=format&fit=crop',
        matchPercentage: 72,
        time: '8 mins',
        difficulty: 'Very Easy',
        calories: '320 kcal',
        protein: '14g',
        tags: ['Toaster Oven'],
        missingIngredients: ['Sourdough Bread', 'Brie'],
        servings: 1,
        ingredients: [
            { name: 'Sourdough Bread', amount: '2 slices' },
            { name: 'Cheese', amount: '50g' },
            { name: 'Butter', amount: '10g' }
        ],
        steps: [
            { id: 1, text: 'Butter the bread slices on one side.', time: 60 },
            { id: 2, text: 'Place cheese between unbuttered sides.', time: 30 },
            { id: 3, text: 'Grill until golden brown on both sides.', time: 300 }
        ]
    },
    {
        id: 103,
        title: 'Avocado Toast & Egg',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?q=80&w=2080&auto=format&fit=crop',
        matchPercentage: 100,
        time: '10 mins',
        difficulty: 'Easy',
        calories: '380 kcal',
        protein: '16g',
        tags: ['Breakfast', 'Healthy'],
        missingIngredients: [],
        servings: 1,
        ingredients: [
            { name: 'Avocado', amount: '1/2' },
            { name: 'Sourdough Bread', amount: '1 slice' },
            { name: 'Egg', amount: '1' }
        ],
        steps: [
            { id: 1, text: 'Toast the bread slice.', time: 120 },
            { id: 2, text: 'Mash the avocado with salt and pepper.', time: 120 },
            { id: 3, text: 'Fry the egg to your liking.', time: 180 },
            { id: 4, text: 'Assemble toast with avocado and egg.', time: 60 }
        ]
    }
];
