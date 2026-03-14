import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart, Trash2, Download, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Button from './Button';

interface FavoritesProps {
  onBack: () => void;
}

interface SavedHeadshot {
  id: string;
  url: string;
  styleName: string;
  date: string;
}

const Favorites: React.FC<FavoritesProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState<SavedHeadshot[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('proheadshot_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('proheadshot_favorites', JSON.stringify(updated));
  };

  const handleDownload = (url: string, styleName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `ProHeadshot_${styleName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn min-h-[70vh]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="pl-0 hover:bg-transparent">
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('back')}
          </Button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            My Favorites
          </h1>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700/50">
          <ImageIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-300 mb-2">No favorites yet</h2>
          <p className="text-slate-500 mb-6">Generate some headshots and save them here!</p>
          <Button onClick={onBack}>Generate Headshot</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((fav) => (
            <div key={fav.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden group">
              <div className="aspect-[3/4] relative overflow-hidden bg-slate-900">
                <img 
                  src={fav.url} 
                  alt={fav.styleName} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDownload(fav.url, fav.styleName)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <button 
                      onClick={() => removeFavorite(fav.id)}
                      className="bg-red-900/50 hover:bg-red-900 text-red-400 hover:text-red-300 p-2 rounded-lg transition-colors border border-red-900/50"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium truncate">{fav.styleName}</h3>
                <p className="text-xs text-slate-500 mt-1">{new Date(fav.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
