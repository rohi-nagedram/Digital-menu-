export type DietaryType = 'veg' | 'non-veg' | 'egg';

export interface Dish {
  id: string;
  name: string;
  category: string;
  price: number | null; // null represents "price not clearly readable / Price to be confirmed"
  dietary: DietaryType;
  description?: string;
  image: string;
  isCustom?: boolean;
  imageIsAlternative?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
}

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';

export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: string;
  specialInstructions?: string;
}

export interface RestaurantConfig {
  name: string;
  city: string;
  tagline: string;
  verifiedWhatsAppNumber: string; // If empty, ordering works via universal wa.me share or prompt
  verifiedPhoneNumber: string; // Verified call number (only shown if provided)
  verifiedMapsUrl: string; // Google Maps location (only shown if provided)
  addressDetails: string;
}
