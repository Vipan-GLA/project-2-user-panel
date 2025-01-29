import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

// const mockFoodItems = [
//     {
//         name: 'Cheeseburger',
//         price: 12,
//         description: 'A juicy beef patty with cheese, lettuce, and tomato.',
//         image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=999&q=80',
//         category: 'non-vegetarian',
//     },
//     {
//         name: 'Margherita Pizza',
//         price: 15,
//         description: 'Classic Italian pizza with fresh mozzarella and basil.',
//         image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
//         category: 'vegetarian',
//     },
//     {
//         name: 'Grilled Chicken Salad',
//         price: 10,
//         description: 'A healthy salad with grilled chicken, veggies, and dressing.',
//         image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
//         category: 'non-vegetarian',
//     },
//     {
//         name: 'Chocolate Cake',
//         price: 8,
//         description: 'Rich chocolate cake topped with ganache and whipped cream.',
//         image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1089&q=80',
//         category: 'dessert',
//     },
//     {
//         name: 'Tacos',
//         price: 14,
//         description: 'Spicy Mexican tacos with fresh salsa and guacamole.',
//         image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
//         category: 'non-vegetarian',
//     },
//     {
//         name: 'Pasta Alfredo',
//         price: 13,
//         description: 'Creamy Alfredo sauce over fettuccine pasta with parmesan.',
//         image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
//         category: 'vegetarian',
//     },
//     {
//         name: 'Sushi Platter',
//         price: 22,
//         description: 'A selection of fresh sushi rolls with soy sauce and wasabi.',
//         image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80',
//         category: 'non-vegetarian',
//     },
//     {
//         name: 'Pancakes',
//         price: 9,
//         description: 'Fluffy pancakes served with maple syrup and butter.',
//         image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
//         category: 'dessert',
//     },
//     {
//         name: 'Veggie Burger',
//         price: 11,
//         description: 'A delicious plant-based burger with lettuce and tomato.',
//         image: 'https://images.unsplash.com/photo-1550319106-9d28f0b94b95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
//         category: 'vegetarian',
//     },
//     {
//         name: 'Steak',
//         price: 25,
//         description: 'Juicy grilled steak served with mashed potatoes and veggies.',
//         image: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=685&q=80',
//         category: 'non-vegetarian',
//     },
//     {
//         name: 'Ice Cream Sundae',
//         price: 7,
//         description: 'Vanilla ice cream topped with chocolate sauce and cherries.',
//         image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
//         category: 'dessert',
//     },
//     {
//         name: 'Biryani',
//         price: 16,
//         description: 'Aromatic spiced rice with marinated chicken and yogurt.',
//         image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
//         category: 'non-vegetarian',
//     },
//     {
//         name: 'Grilled Salmon',
//         price: 20,
//         description: 'Fresh salmon fillet grilled to perfection with lemon sauce.',
//         image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
//         category: 'non-vegetarian',
//     },
//     {
//         name: 'Milkshake',
//         price: 6,
//         description: 'Thick and creamy milkshake available in multiple flavors.',
//         image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
//         category: 'dessert',
//     },
//     {
//         name: 'Caesar Salad',
//         price: 10,
//         description: 'Romaine lettuce, parmesan, croutons, and Caesar dressing.',
//         image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
//         category: 'vegetarian',
//     },
// ];

const mockFoodItems = [
    // Previous items...
    {
        name: 'Chicken Wings',
        price: 14,
        description: 'Crispy fried chicken wings tossed in your choice of sauce.',
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1680&q=80',
        category: 'non-vegetarian',
    },
    {
        name: 'Vegetable Stir Fry',
        price: 12,
        description: 'A mix of fresh vegetables stir-fried in a savory sauce.',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80',
        category: 'vegetarian',
    },
    {
        name: 'Fish and Chips',
        price: 18,
        description: 'Crispy battered fish served with golden fries and tartar sauce.',
        image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        category: 'non-vegetarian',
    },
    {
        name: 'Falafel Wrap',
        price: 10,
        description: 'Crispy falafel balls wrapped in a pita with hummus and veggies.',
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
        category: 'vegetarian',
    },
    {
        name: 'BBQ Ribs',
        price: 28,
        description: 'Slow-cooked ribs glazed with smoky BBQ sauce.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
        category: 'non-vegetarian',
    },
    {
        name: 'Mushroom Risotto',
        price: 16,
        description: 'Creamy risotto with sautéed mushrooms and parmesan cheese.',
        image: 'https://images.unsplash.com/photo-1608212589631-2c1a5c4baf5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        category: 'vegetarian',
    },
    {
        name: 'Shrimp Scampi',
        price: 24,
        description: 'Juicy shrimp sautéed in garlic butter and white wine sauce.',
        image: 'https://images.unsplash.com/photo-1605209671121-67020c996b3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        category: 'non-vegetarian',
    },
    {
        name: 'Tiramisu',
        price: 9,
        description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        category: 'dessert',
    },
    {
        name: 'Pho',
        price: 14,
        description: 'Vietnamese noodle soup with beef, herbs, and rice noodles.',
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
        category: 'non-vegetarian',
    },
    {
        name: 'Fruit Tart',
        price: 8,
        description: 'A sweet tart filled with custard and topped with fresh fruits.',
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        category: 'dessert',
    },
];

export const uploadMockData = async () => {
    try {
        const foodCollection = collection(db, 'foods');

        for (const food of mockFoodItems) {
            await addDoc(foodCollection, food);
        }

        toast.success('Mock food items added successfully!');
    } catch (error) {
        console.error('Error uploading data:', error);
        toast.error('Failed to upload mock data.');
    }
};
