import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Check, AlertCircle, Save, Phone, MapPin, MessageCircle, RotateCcw, Download, Upload } from 'lucide-react';
import { Category, DietaryType, Dish, RestaurantConfig } from '../types';

interface OwnerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: Dish[];
  categories: Category[];
  restaurantConfig: RestaurantConfig;
  onSaveDishes: (updatedDishes: Dish[]) => void;
  onSaveCategories: (updatedCategories: Category[]) => void;
  onSaveConfig: (updatedConfig: RestaurantConfig) => void;
  onResetToDefaults: () => void;
}

export const OwnerEditModal: React.FC<OwnerEditModalProps> = ({
  isOpen,
  onClose,
  dishes,
  categories,
  restaurantConfig,
  onSaveDishes,
  onSaveCategories,
  onSaveConfig,
  onResetToDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'unconfirmed' | 'all-dishes' | 'add-dish' | 'contact' | 'backup'>('unconfirmed');
  
  // Temporary state for restaurant config
  const [configDraft, setConfigDraft] = useState<RestaurantConfig>(restaurantConfig);

  // New Dish Form State
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState(categories[0]?.id || 'veg-starters');
  const [newDishPrice, setNewDishPrice] = useState<string>('');
  const [newDishDietary, setNewDishDietary] = useState<DietaryType>('veg');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishImage, setNewDishImage] = useState('');

  // Editing dish state
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');

  // New Category State
  const [newCategoryName, setNewCategoryName] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Find dishes needing price confirmation
  const unconfirmedDishes = dishes.filter((d) => d.price === null);

  const handleQuickConfirmPrice = (dishId: string, priceValue: number) => {
    if (isNaN(priceValue) || priceValue <= 0) return;
    const updated = dishes.map((d) => (d.id === dishId ? { ...d, price: priceValue } : d));
    onSaveDishes(updated);
    showNotification('Dish price updated successfully!');
  };

  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    const parsedPrice = newDishPrice.trim() !== '' ? parseFloat(newDishPrice) : null;
    const fallbackImage =
      newDishDietary === 'veg'
        ? '/dishes/vc-3.jpg'
        : newDishDietary === 'egg'
        ? '/dishes/es-2.jpg'
        : '/dishes/cs-1.jpg';

    const newDish: Dish = {
      id: `custom-${Date.now()}`,
      name: newDishName.trim(),
      category: newDishCategory,
      price: parsedPrice,
      dietary: newDishDietary,
      description: newDishDesc.trim() || undefined,
      image: newDishImage.trim() || fallbackImage,
      isCustom: true,
    };

    onSaveDishes([...dishes, newDish]);
    setNewDishName('');
    setNewDishPrice('');
    setNewDishDesc('');
    setNewDishImage('');
    showNotification(`"${newDish.name}" added to menu!`);
    setActiveTab('all-dishes');
  };

  const handleDeleteDish = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from menu?`)) {
      onSaveDishes(dishes.filter((d) => d.id !== id));
      showNotification(`"${name}" removed.`);
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newId = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (categories.some((c) => c.id === newId)) {
      alert('Category with this name already exists.');
      return;
    }
    const updated = [...categories, { id: newId, name: newCategoryName.trim() }];
    onSaveCategories(updated);
    setNewCategoryName('');
    showNotification(`Category "${newCategoryName}" added!`);
  };

  const handleSaveContactConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(configDraft);
    showNotification('Restaurant contact details saved!');
  };

  const handleExportData = () => {
    const data = {
      categories,
      dishes,
      restaurantConfig,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `the_dark_house_inn_menu_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#121218] border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl text-[#f5f2eb] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-[#f3df95]">
              Owner Menu Management
            </h2>
            <p className="text-xs text-zinc-400">
              Easily update prices, verify contact info, or add new dishes
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification pill */}
        {notification && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-200 text-xs px-5 py-2 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-zinc-950/80 border-b border-zinc-800 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('unconfirmed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'unconfirmed'
                ? 'bg-[#d4af37] text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Confirm Prices</span>
            {unconfirmedDishes.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/30 text-amber-300">
                {unconfirmedDishes.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all-dishes')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'all-dishes'
                ? 'bg-[#d4af37] text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Dishes ({dishes.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('add-dish')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeTab === 'add-dish'
                ? 'bg-[#d4af37] text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Dish</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'contact'
                ? 'bg-[#d4af37] text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Contact & WhatsApp
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'backup'
                ? 'bg-[#d4af37] text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Backup & Reset
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          
          {/* TAB 1: UNCONFIRMED PRICES */}
          {activeTab === 'unconfirmed' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/40 text-amber-200 text-xs">
                <strong>Menu Accuracy Rule:</strong> The following items had unreadable prices in the original menu screenshot and are currently labeled <em>"Price to be confirmed"</em>. Enter their verified prices below to instantly publish them on the live menu!
              </div>

              {unconfirmedDishes.length === 0 ? (
                <div className="p-8 text-center text-zinc-400 space-y-2">
                  <Check className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="text-sm font-medium text-zinc-200">All dish prices are confirmed!</p>
                  <p className="text-xs text-zinc-500">Every single item on the menu has a verified price.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {unconfirmedDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="p-3 bg-[#171720] border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-[#f5f2eb]">{dish.name}</h4>
                          <span className="text-[10px] text-zinc-400 uppercase font-mono">
                            {categories.find((c) => c.id === dish.category)?.name || dish.category}
                          </span>
                        </div>
                        <p className="text-xs text-amber-300 mt-0.5">Currently: Price to be confirmed</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-xs text-zinc-400">₹</span>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Price"
                            defaultValue=""
                            id={`input-price-${dish.id}`}
                            className="w-24 pl-6 pr-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-[#f5f2eb] font-mono focus:border-[#d4af37] focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById(
                              `input-price-${dish.id}`
                            ) as HTMLInputElement;
                            if (input && input.value) {
                              handleQuickConfirmPrice(dish.id, parseFloat(input.value));
                              input.value = '';
                            }
                          }}
                          className="px-3 py-1.5 bg-[#d4af37] text-zinc-950 font-semibold text-xs rounded-lg hover:bg-[#e6ca65] transition-colors"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ALL DISHES */}
          {activeTab === 'all-dishes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span>Manage existing items ({dishes.length} total)</span>
                <span>Click price to edit</span>
              </div>

              <div className="space-y-2">
                {dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-3 bg-[#171720] border border-zinc-800/80 rounded-lg flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#f5f2eb] truncate">
                          {dish.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {categories.find((c) => c.id === dish.category)?.name}
                        </span>
                      </div>
                      <div className="text-zinc-400 text-[11px] truncate mt-0.5">
                        {dish.description || 'No description'}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {editingDishId === dish.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={editingPrice}
                            onChange={(e) => setEditingPrice(e.target.value)}
                            className="w-18 px-2 py-1 bg-zinc-900 border border-[#d4af37] rounded text-xs text-[#f5f2eb] font-mono"
                            placeholder="Price"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const val = editingPrice.trim() !== '' ? parseFloat(editingPrice) : null;
                              const updated = dishes.map((d) =>
                                d.id === dish.id ? { ...d, price: val } : d
                              );
                              onSaveDishes(updated);
                              setEditingDishId(null);
                              showNotification(`Updated ${dish.name} price`);
                            }}
                            className="p-1 bg-[#d4af37] text-zinc-950 rounded hover:bg-[#e6ca65]"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDishId(dish.id);
                            setEditingPrice(dish.price !== null ? dish.price.toString() : '');
                          }}
                          className="font-mono text-zinc-200 hover:text-[#f3df95] px-2 py-1 rounded bg-zinc-900 border border-zinc-800 flex items-center gap-1"
                        >
                          <span>{dish.price !== null ? `₹${dish.price}` : 'TBC'}</span>
                          <Edit2 className="w-3 h-3 text-zinc-500" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteDish(dish.id, dish.name)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 rounded transition-colors"
                        title="Delete dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ADD NEW DISH */}
          {activeTab === 'add-dish' && (
            <form onSubmit={handleAddDish} className="space-y-4">
              <h3 className="font-semibold text-sm text-[#f5f2eb]">Add New Dish to Menu</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="e.g. Apollo Fish or Paneer Tikka"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-[#f5f2eb] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Category</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-[#f5f2eb] focus:border-[#d4af37] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Price in ₹ (leave blank if price to be confirmed)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-[#f5f2eb] font-mono focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Dietary Type</label>
                  <select
                    value={newDishDietary}
                    onChange={(e) => setNewDishDietary(e.target.value as DietaryType)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-[#f5f2eb] focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="veg">Pure Vegetarian (🟢)</option>
                    <option value="egg">Contains Egg (🟡)</option>
                    <option value="non-veg">Non-Vegetarian (🔴)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Short Description (verified)</label>
                <input
                  type="text"
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="e.g. Crispy boneless fish cubes tossed in tangy yogurt-curry leaf tempering"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-[#f5f2eb] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Food Image URL (optional)</label>
                <input
                  type="url"
                  value={newDishImage}
                  onChange={(e) => setNewDishImage(e.target.value)}
                  placeholder="https://... (or leave blank for automatic styled culinary visual)"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-[#f5f2eb] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              {/* Add New Category subsection */}
              <div className="pt-3 border-t border-zinc-800">
                <label className="block text-xs text-zinc-400 mb-1">Or create a new Category:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Seafood Starters, Desserts"
                    className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-[#f5f2eb]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white rounded-lg"
                  >
                    Add Category
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-zinc-950 font-bold text-xs rounded-lg hover:opacity-95 shadow transition-all"
                >
                  Save & Publish Dish
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: CONTACT & WHATSAPP */}
          {activeTab === 'contact' && (
            <form onSubmit={handleSaveContactConfig} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300">
                <strong>Authentic Contact Rule:</strong> By default, no phone number or Google Maps link is invented. When you enter your verified restaurant WhatsApp number, phone number, and Google Maps URL below, the <em>"Call Restaurant"</em> and <em>"Get Directions"</em> buttons will automatically light up on the hero section, and all WhatsApp customer orders will route directly to your device!
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Verified Restaurant WhatsApp Number
                  </label>
                  <div className="relative">
                    <MessageCircle className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={configDraft.verifiedWhatsAppNumber}
                      onChange={(e) =>
                        setConfigDraft({ ...configDraft, verifiedWhatsAppNumber: e.target.value })
                      }
                      placeholder="e.g. +91 98765 43210 or 919876543210"
                      className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-[#f5f2eb] font-mono focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    Format: Country code + 10-digit mobile (e.g. 919876543210 for India)
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Verified Phone Number for Direct Calls
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#d4af37] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={configDraft.verifiedPhoneNumber}
                      onChange={(e) =>
                        setConfigDraft({ ...configDraft, verifiedPhoneNumber: e.target.value })
                      }
                      placeholder="e.g. +91 40 1234 5678"
                      className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-[#f5f2eb] font-mono focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Verified Google Maps Location Link
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-rose-400 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      value={configDraft.verifiedMapsUrl}
                      onChange={(e) =>
                        setConfigDraft({ ...configDraft, verifiedMapsUrl: e.target.value })
                      }
                      placeholder="e.g. https://maps.google.com/?q=..."
                      className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-[#f5f2eb] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Restaurant City / Address</label>
                  <input
                    type="text"
                    value={configDraft.addressDetails}
                    onChange={(e) =>
                      setConfigDraft({ ...configDraft, addressDetails: e.target.value })
                    }
                    placeholder="Hyderabad, Telangana, India"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-[#f5f2eb] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#d4af37] text-zinc-950 font-bold text-xs rounded-lg hover:bg-[#e6ca65] shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Verified Contact Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: BACKUP & RESET */}
          {activeTab === 'backup' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
                <h4 className="font-semibold text-sm text-[#f5f2eb] flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#d4af37]" />
                  <span>Export Menu Data</span>
                </h4>
                <p className="text-zinc-400">
                  Save a copy of your entire custom menu, dishes, prices, and categories as a JSON file.
                </p>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="mt-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
                >
                  Download Menu JSON
                </button>
              </div>

              <div className="p-4 bg-rose-950/20 border border-rose-800/40 rounded-xl space-y-2">
                <h4 className="font-semibold text-sm text-rose-300 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Original Menu</span>
                </h4>
                <p className="text-zinc-400">
                  Restore all original 48 verified dishes from the restaurant's authentic menu. Any custom dishes you added will be reverted.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset menu back to original 48 dishes and default settings?')) {
                      onResetToDefaults();
                      showNotification('Menu reset to original items.');
                      onClose();
                    }
                  }}
                  className="mt-2 px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 font-medium rounded-lg transition-colors"
                >
                  Reset Menu to Defaults
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
