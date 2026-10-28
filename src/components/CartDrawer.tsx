import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, MessageCircle, Copy, Check, AlertCircle } from 'lucide-react';
import { CartItem, OrderDetails, OrderType, RestaurantConfig } from '../types';
import { DietaryBadge } from './DietaryBadge';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onClearCart: () => void;
  restaurantConfig: RestaurantConfig;
  onOpenOwnerModal: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  restaurantConfig,
  onOpenOwnerModal,
}) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    customerName: '',
    customerPhone: '',
    orderType: 'takeaway',
    tableNumber: '',
    deliveryAddress: '',
    specialInstructions: '',
  });

  const [copied, setCopied] = useState(false);
  const [customPhone, setCustomPhone] = useState('');
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);

  if (!isOpen) return null;

  // Calculate totals
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  let confirmedTotal = 0;
  let unconfirmedCount = 0;

  cartItems.forEach((item) => {
    if (item.dish.price !== null) {
      confirmedTotal += item.dish.price * item.quantity;
    } else {
      unconfirmedCount += item.quantity;
    }
  });

  // Construct structured WhatsApp message
  const generateWhatsAppMessage = () => {
    const divider = '━━━━━━━━━━━━━━━━━━━━';
    let text = `🍽️ *Order from ${restaurantConfig.name}, ${restaurantConfig.city}*\n${divider}\n`;

    if (orderDetails.customerName.trim()) {
      text += `👤 *Customer:* ${orderDetails.customerName.trim()}\n`;
    }
    if (orderDetails.customerPhone.trim()) {
      text += `📱 *Phone:* ${orderDetails.customerPhone.trim()}\n`;
    }

    const typeLabel =
      orderDetails.orderType === 'dine_in'
        ? `Dine-in (Table: ${orderDetails.tableNumber || 'To be seated'})`
        : orderDetails.orderType === 'takeaway'
        ? 'Takeaway / Self-Pickup'
        : `Home Delivery`;

    text += `📍 *Order Type:* ${typeLabel}\n`;

    if (orderDetails.orderType === 'delivery' && orderDetails.deliveryAddress?.trim()) {
      text += `🏠 *Delivery Address:* ${orderDetails.deliveryAddress.trim()}\n`;
    }

    if (orderDetails.specialInstructions?.trim()) {
      text += `📝 *Instructions:* ${orderDetails.specialInstructions.trim()}\n`;
    }

    text += `\n*Dishes Ordered:*\n`;

    cartItems.forEach((item) => {
      const priceString =
        item.dish.price !== null
          ? item.quantity > 1
            ? `₹${item.dish.price * item.quantity} (₹${item.dish.price} each)`
            : `₹${item.dish.price}`
          : `[Price to be confirmed]`;

      text += `• ${item.quantity}x ${item.dish.name} — ${priceString}\n`;
    });

    text += `\n${divider}\n`;

    if (unconfirmedCount > 0) {
      text += `💰 *Confirmed Subtotal:* ₹${confirmedTotal}\n`;
      text += `⚠️ *Note:* ${unconfirmedCount} dish item(s) awaiting price confirmation.\n`;
      text += `*Estimated Total:* ₹${confirmedTotal} (+ ${unconfirmedCount} item price TBC)\n`;
    } else {
      text += `*Total Amount:* ₹${confirmedTotal}\n`;
    }

    text += `\n_Sent via ${restaurantConfig.name} Digital Menu_`;

    return text;
  };

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage();
    const encoded = encodeURIComponent(message);

    // Destination phone:
    // If owner set verifiedWhatsAppNumber, use it.
    // If not, and customer provided customPhone, use it.
    // Otherwise open universal wa.me/?text=... which prompts user to choose contact in WhatsApp!
    let targetPhone = restaurantConfig.verifiedWhatsAppNumber.replace(/[^0-9]/g, '');
    if (!targetPhone && customPhone.trim()) {
      targetPhone = customPhone.replace(/[^0-9]/g, '');
    }

    if (targetPhone) {
      window.open(`https://wa.me/${targetPhone}?text=${encoded}`, '_blank');
    } else {
      // Universal WhatsApp share link without invented fake number
      window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    }
  };

  const handleCopyOrder = () => {
    const message = generateWhatsAppMessage();
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#121218] border-l border-zinc-800 text-[#f5f2eb] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <h2 className="font-display font-semibold text-lg text-[#f5f2eb]">Your Order</h2>
              <span className="text-xs bg-zinc-800 text-[#f3df95] font-mono px-2 py-0.5 rounded-full">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/80 rounded transition-colors"
                  title="Clear entire cart"
                  aria-label="Clear cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-zinc-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-medium text-zinc-300">Your order list is empty</p>
                <p className="text-xs text-zinc-500 max-w-xs">
                  Browse our starters, curries, and biryani to add delicious dishes to your order.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-4 py-2 text-xs font-semibold text-zinc-950 bg-[#d4af37] rounded-lg hover:bg-[#e6ca65] transition-colors"
                >
                  Explore Dishes
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
                    Selected Dishes
                  </span>

                  {cartItems.map((item) => (
                    <div
                      key={item.dish.id}
                      className="p-3 bg-[#171720] border border-zinc-800/80 rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <div className="mt-1 shrink-0">
                          <DietaryBadge type={item.dish.dietary} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-[#f5f2eb] truncate">
                            {item.dish.name}
                          </h4>
                          <div className="text-xs text-zinc-400 mt-0.5 font-mono">
                            {item.dish.price !== null ? (
                              <span>₹{item.dish.price} each</span>
                            ) : (
                              <span className="text-amber-300/90 text-[11px]">Price to be confirmed</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700/60 rounded-lg p-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.dish.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 text-zinc-200 hover:bg-[#d4af37] hover:text-black transition-colors"
                          aria-label={`Decrease quantity of ${item.dish.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-mono font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.dish.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 text-zinc-200 hover:bg-[#d4af37] hover:text-black transition-colors"
                          aria-label={`Increase quantity of ${item.dish.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right shrink-0 min-w-[50px]">
                        {item.dish.price !== null ? (
                          <span className="text-sm font-semibold font-mono text-[#f3df95]">
                            ₹{item.dish.price * item.quantity}
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-300">TBC</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Notice if any unconfirmed */}
                {unconfirmedCount > 0 && (
                  <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-600/40 text-amber-200 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>{unconfirmedCount} item(s) awaiting confirmation:</strong> In accordance with menu accuracy rules, unverified prices will be confirmed directly by the restaurant when you place your WhatsApp order.
                    </div>
                  </div>
                )}

                {/* Order Type & Customer Details */}
                <div className="space-y-4 pt-2 border-t border-zinc-800/80">
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">
                    Dining / Delivery Preference
                  </span>

                  {/* Order Type Tabs */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setOrderDetails({ ...orderDetails, orderType: 'takeaway' })}
                      className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                        orderDetails.orderType === 'takeaway'
                          ? 'bg-[#d4af37] text-zinc-950 font-semibold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Takeaway
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderDetails({ ...orderDetails, orderType: 'dine_in' })}
                      className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                        orderDetails.orderType === 'dine_in'
                          ? 'bg-[#d4af37] text-zinc-950 font-semibold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Dine-in
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderDetails({ ...orderDetails, orderType: 'delivery' })}
                      className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                        orderDetails.orderType === 'delivery'
                          ? 'bg-[#d4af37] text-zinc-950 font-semibold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Delivery
                    </button>
                  </div>

                  {/* Customer Inputs */}
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Your Name</label>
                      <input
                        type="text"
                        value={orderDetails.customerName}
                        onChange={(e) =>
                          setOrderDetails({ ...orderDetails, customerName: e.target.value })
                        }
                        placeholder="e.g. Rohini Bathini"
                        className="w-full px-3 py-1.5 bg-[#171720] border border-zinc-800 rounded-lg text-xs text-[#f5f2eb] placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    {orderDetails.orderType === 'dine_in' && (
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Table Number (optional)</label>
                        <input
                          type="text"
                          value={orderDetails.tableNumber || ''}
                          onChange={(e) =>
                            setOrderDetails({ ...orderDetails, tableNumber: e.target.value })
                          }
                          placeholder="e.g. Table 4"
                          className="w-full px-3 py-1.5 bg-[#171720] border border-zinc-800 rounded-lg text-xs text-[#f5f2eb] placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    )}

                    {orderDetails.orderType === 'delivery' && (
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Delivery Address & Landmark</label>
                        <textarea
                          rows={2}
                          value={orderDetails.deliveryAddress || ''}
                          onChange={(e) =>
                            setOrderDetails({ ...orderDetails, deliveryAddress: e.target.value })
                          }
                          placeholder="Complete address in Hyderabad..."
                          className="w-full px-3 py-1.5 bg-[#171720] border border-zinc-800 rounded-lg text-xs text-[#f5f2eb] placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Special Cooking Instructions (optional)</label>
                      <input
                        type="text"
                        value={orderDetails.specialInstructions || ''}
                        onChange={(e) =>
                          setOrderDetails({ ...orderDetails, specialInstructions: e.target.value })
                        }
                        placeholder="e.g. Medium spice, less oil, extra onions"
                        className="w-full px-3 py-1.5 bg-[#171720] border border-zinc-800 rounded-lg text-xs text-[#f5f2eb] placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                </div>

                {/* Restaurant WhatsApp Number Status */}
                <div className="pt-2 text-xs">
                  {restaurantConfig.verifiedWhatsAppNumber ? (
                    <div className="text-zinc-400 flex items-center justify-between">
                      <span>Order will be sent to restaurant's verified number</span>
                      <span className="text-[#f3df95] font-mono">{restaurantConfig.verifiedWhatsAppNumber}</span>
                    </div>
                  ) : (
                    <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>Restaurant WhatsApp number:</span>
                        <button
                          type="button"
                          onClick={onOpenOwnerModal}
                          className="text-[#d4af37] hover:underline text-[11px]"
                        >
                          Owner? Set number
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Opening WhatsApp will generate your pre-formatted order so you can send it directly to The Dark House Inn.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-[#0e0e13] border-t border-zinc-800 space-y-3">
              {/* Total Calculation */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Confirmed Items Subtotal</span>
                  <span className="font-mono tabular-nums">₹{confirmedTotal}</span>
                </div>
                {unconfirmedCount > 0 && (
                  <div className="flex items-center justify-between text-xs text-amber-300">
                    <span>Items awaiting price confirmation</span>
                    <span>{unconfirmedCount} dish(es)</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base font-bold text-[#f5f2eb] pt-2 border-t border-zinc-800">
                  <span className="font-display">Estimated Total</span>
                  <div className="text-right">
                    <span className="text-[#f3df95] font-mono tabular-nums text-lg">
                      ₹{confirmedTotal}
                    </span>
                    {unconfirmedCount > 0 && (
                      <span className="text-[10px] text-amber-300 block font-normal">
                        (+ {unconfirmedCount} item price TBC)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Order on WhatsApp Button */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-zinc-950 bg-gradient-to-r from-[#25D366] via-[#20bd5a] to-[#128C7E] hover:opacity-95 shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Order on WhatsApp</span>
                </button>

                {/* Secondary copy order text */}
                <button
                  type="button"
                  onClick={handleCopyOrder}
                  className="w-full py-2 px-3 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Order Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy Order Text Summary</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
