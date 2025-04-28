import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Search, Filter } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import toast from 'react-hot-toast';

interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export default function Home() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'foods'));
        const foodData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FoodItem[];
        setFoods(foodData);
      } catch (error) {
        console.error('Error fetching foods:', error);
        toast.error('Failed to load food items');
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || food.category === category;
    const price = food.price;
    const matchesPrice =
      priceRange === 'all' ||
      (priceRange === 'under10' && price < 10) ||
      (priceRange === '10to20' && price >= 10 && price <= 20) ||
      (priceRange === 'over20' && price > 20);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 -mx-4 sm:-mx-6 lg:-mx-8 mb-8 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Delicious Food Delivered to Your Door
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Choose from our wide variety of delicious meals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search foods..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
            </div>
            <div className="flex gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="dessert">Dessert</option>
              </select>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="under10">Under $10</option>
                <option value="10to20">$10 - $20</option>
                <option value="over20">Over $20</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredFoods.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No items found</h2>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} {...food} />
          ))}
        </div>
      )}
    </div>
  );
}