import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (foodId: string) => Promise<void>;
  isFavorite: (foodId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: async () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        const docRef = doc(db, 'userFavorites', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFavorites(docSnap.data().favorites || []);
        }
      } else {
        setFavorites([]);
      }
    };

    loadFavorites();
  }, [user]);

  const toggleFavorite = async (foodId: string) => {
    if (!user) return;

    const newFavorites = favorites.includes(foodId)
      ? favorites.filter(id => id !== foodId)
      : [...favorites, foodId];

    setFavorites(newFavorites);
    await setDoc(doc(db, 'userFavorites', user.uid), { favorites: newFavorites });
  };

  const isFavorite = (foodId: string) => favorites.includes(foodId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);