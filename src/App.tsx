import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryNav } from './components/CategoryNav';
import { FilterToolbar } from './components/FilterToolbar';
import { DishCard } from './components/DishCard';
import { CartDrawer } from './components/CartDrawer';
import { MobileCartBar } from './components/MobileCartBar';
import { OwnerEditModal } from './components/OwnerEditModal';
import { ShareModal } from './components/ShareModal';
import { FooterSection } from './components/FooterSection';
import {
  INITIAL_CATEGORIES,
  INITIAL_DISHES,
  INITIAL_RESTAURANT_CONFIG,
} from './data/initialMenu';
import { Category, DietaryType, Dish, CartItem, RestaurantConfig } from './types';
import { AlertCircle, Sparkles, Utensils } from 'lucide-react';

const STORAGE_KEY_DISHES = 'darkhouse_menu_dishes_v3';
const STORAGE_KEY_CATEGORIES = 'darkhouse_menu_categories_v1';
const STORAGE_KEY_CONFIG = 'darkhouse_menu_config_v1';
const STORAGE_KEY_CART = 'darkhouse_menu_cart_v1';

export default function App() {
  // 1. Dishes State
  const [dishes, setDishes] = useState<Dish[]>(() => {
    try {
      const stored =
        localStorage.getItem('darkhouse_menu_dishes_v3') ||
        localStorage.getItem('darkhouse_menu_dishes_v2') ||
        localStorage.getItem('darkhouse_menu_dishes_v1');
      if (stored) {
        const parsed: Dish[] = JSON.parse(stored);
        // Ensure all standard dishes use the verified local static image assets
        const synced = parsed.map((item) => {
          const fresh = INITIAL_DISHES.find((d) => d.id === item.id);
          if (fresh) {
            return {
              ...item,
              image: fresh.image,
              imageIsAlternative: fresh.imageIsAlternative,
            };
          }
          return item;
        });
        localStorage.setItem(STORAGE_KEY_DISHES, JSON.stringify(synced));
        return synced;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DISHES;
  });

  // 2. Categories State
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CATEGORIES;
  });

  // 3. Restaurant Config State
  const [restaurantConfig, setRestaurantConfig] = useState<RestaurantConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_RESTAURANT_CONFIG;
  });

  // 4. Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CART);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 5. Navigation & Filter State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDietary, setSelectedDietary] = useState<'all' | DietaryType>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'confirmed' | 'unconfirmed'>('all');

  // 6. Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DISHES, JSON.stringify(dishes));
    } catch (e) {
      console.error(e);
    }
  }, [dishes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(restaurantConfig));
    } catch (e) {
      console.error(e);
    }
  }, [restaurantConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Cart operations
  const handleAddToCart = (dish: Dish) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Quantity map for quick card lookup
  const quantityMap = useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((item) => {
      map[item.dish.id] = item.quantity;
    });
    return map;
  }, [cartItems]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dishes.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, [dishes]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // Category filter
      if (selectedCategoryId !== 'all' && dish.category !== selectedCategoryId) {
        return false;
      }
      // Dietary filter
      if (selectedDietary !== 'all' && dish.dietary !== selectedDietary) {
        return false;
      }
      // Price filter
      if (priceFilter === 'confirmed' && dish.price === null) {
        return false;
      }
      if (priceFilter === 'unconfirmed' && dish.price !== null) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesDesc = dish.description?.toLowerCase().includes(query) ?? false;
        const categoryName = categories.find((c) => c.id === dish.category)?.name.toLowerCase() || '';
        const matchesCat = categoryName.includes(query);
        return matchesName || matchesDesc || matchesCat;
      }

      return true;
    });
  }, [dishes, selectedCategoryId, selectedDietary, priceFilter, searchQuery, categories]);

  // Group dishes by category if "All" is active and not searching
  const groupedCategories = useMemo(() => {
    if (selectedCategoryId !== 'all' || searchQuery.trim() !== '') {
      return null;
    }

    const groups: { category: Category; dishes: Dish[] }[] = [];
    categories.forEach((cat) => {
      const itemsInCat = filteredDishes.filter((d) => d.category === cat.id);
      if (itemsInCat.length > 0) {
        groups.push({ category: cat, dishes: itemsInCat });
      }
    });
    return groups;
  }, [selectedCategoryId, searchQuery, categories, filteredDishes]);

  const isFiltered =
    selectedCategoryId !== 'all' ||
    searchQuery.trim() !== '' ||
    selectedDietary !== 'all' ||
    priceFilter !== 'all';

  const handleResetFilters = () => {
    setSelectedCategoryId('all');
    setSearchQuery('');
    setSelectedDietary('all');
    setPriceFilter('all');
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetToDefaults = () => {
    setDishes(INITIAL_DISHES);
    setCategories(INITIAL_CATEGORIES);
    setRestaurantConfig(INITIAL_RESTAURANT_CONFIG);
    localStorage.removeItem(STORAGE_KEY_DISHES);
    localStorage.removeItem('darkhouse_menu_dishes_v2');
    localStorage.removeItem('darkhouse_menu_dishes_v1');
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_CONFIG);
  };

  return (
    <div className="min-h-screen bg-[#0c0c10] text-[#f5f2eb] flex flex-col selection:bg-[#d4af37]/30 selection:text-[#f3df95]">
      {/* 1. Header Navigation */}
      <Navbar
        totalCartItems={totalCartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenOwnerModal={() => setIsOwnerModalOpen(true)}
      />

      {/* 2. Restaurant Hero Section */}
      <HeroSection
        config={restaurantConfig}
        onExploreMenu={scrollToMenu}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      {/* 3. Horizontal Sticky Category Navigation */}
      <CategoryNav
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          scrollToMenu();
        }}
        categoryItemCounts={categoryCounts}
      />

      {/* 4. Menu & Dishes Section */}
      <main id="menu-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Search & Filter Controls */}
        <FilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDietary={selectedDietary}
          onDietaryChange={setSelectedDietary}
          priceFilter={priceFilter}
          onPriceFilterChange={setPriceFilter}
          totalVisibleDishes={filteredDishes.length}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
        />

        {/* Menu Items Container */}
        <div className="mt-6">
          {filteredDishes.length === 0 ? (
            <div className="p-12 text-center bg-[#15151e] border border-zinc-800 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-base text-zinc-200">No dishes found</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                No items match your selected filters. Try clearing your search query or dietary filter.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 text-xs font-semibold text-zinc-950 bg-[#d4af37] rounded-lg hover:bg-[#e6ca65] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : groupedCategories ? (
            // Grouped view by category
            <div className="space-y-12">
              {groupedCategories.map(({ category, dishes: catDishes }) => (
                <section
                  key={category.id}
                  id={category.id.startsWith('veg') ? 'starters' : category.id.startsWith('chicken-curries') ? 'curries' : undefined}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>
                      <h2 className="font-display font-bold text-xl sm:text-2xl text-[#f5f2eb]">
                        {category.name}
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-[#d4af37] font-medium">
                      {catDishes.length} {catDishes.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                    {catDishes.map((dish) => (
                      <DishCard
                        key={dish.id}
                        dish={dish}
                        quantityInCart={quantityMap[dish.id] || 0}
                        onAddToCart={handleAddToCart}
                        onUpdateQuantity={handleUpdateQuantity}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            // Flat filtered view (when category is selected or search query active)
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[#f5f2eb]">
                  {selectedCategoryId === 'all'
                    ? 'Search Results'
                    : categories.find((c) => c.id === selectedCategoryId)?.name || 'Dishes'}
                </h2>
                <span className="text-xs font-mono text-[#d4af37] font-medium">
                  {filteredDishes.length} items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {filteredDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    quantityInCart={quantityMap[dish.id] || 0}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 5. Restaurant Footer & Disclaimer */}
      <FooterSection
        config={restaurantConfig}
        onOpenOwnerModal={() => setIsOwnerModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      {/* 6. Mobile Sticky Bottom Cart Bar (Strictly < 15% viewport height) */}
      <MobileCartBar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 7. Slide-over Cart & WhatsApp Ordering Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        restaurantConfig={restaurantConfig}
        onOpenOwnerModal={() => {
          setIsCartOpen(false);
          setIsOwnerModalOpen(true);
        }}
      />

      {/* 8. Owner Menu Management Modal */}
      <OwnerEditModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        dishes={dishes}
        categories={categories}
        restaurantConfig={restaurantConfig}
        onSaveDishes={setDishes}
        onSaveCategories={setCategories}
        onSaveConfig={setRestaurantConfig}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* 9. Branded Link Sharing Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        config={restaurantConfig}
      />
    </div>
  );
}
