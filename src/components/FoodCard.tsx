import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface FoodCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export default function FoodCard({ id, name, price, description, image, category }: FoodCardProps) {
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Please login to add favorites');
      navigate('/login');
      return;
    }
    await toggleFavorite(id);
    toast.success(isFavorite(id) ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleAddToCart = () => {
    addItem({ id, name, price, quantity: 1, image });
    toast.success('Added to cart');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleFavorite}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite(id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <span className="text-lg font-bold text-blue-600">${price}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}