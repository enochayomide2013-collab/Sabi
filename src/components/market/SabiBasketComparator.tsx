import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  Sparkles, 
  TrendingDown, 
  MapPin, 
  Share2, 
  Check, 
  DollarSign, 
  Calculator,
  ArrowRight
} from 'lucide-react';
import { storageService } from '../../services/storageService';

interface BasketItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  // Base price per unit across market hubs
  prices: {
    mile12: number;
    bodija: number;
    wuse: number;
    dawanau: number;
    oilmill: number;
  };
}

const DEFAULT_STAPLES: BasketItem[] = [
  {
    id: 'b1',
    name: 'Parboiled Foreign Rice',
    unit: '50kg Bag',
    quantity: 1,
    prices: { mile12: 105000, bodija: 102000, wuse: 106000, dawanau: 98000, oilmill: 108000 }
  },
  {
    id: 'b2',
    name: 'Fresh Tomatoes (Rafia)',
    unit: 'Large Basket',
    quantity: 1,
    prices: { mile12: 52000, bodija: 28000, wuse: 48000, dawanau: 22000, oilmill: 55000 }
  },
  {
    id: 'b3',
    name: 'Pure Palm Oil',
    unit: '25L Yellow Keg',
    quantity: 1,
    prices: { mile12: 44500, bodija: 43000, wuse: 46000, dawanau: 45000, oilmill: 42000 }
  },
  {
    id: 'b4',
    name: 'Yellow Ijebu Garri',
    unit: '50kg Bag',
    quantity: 1,
    prices: { mile12: 38000, bodija: 35000, wuse: 41000, dawanau: 39000, oilmill: 42000 }
  },
  {
    id: 'b5',
    name: 'Fresh Farm Eggs',
    unit: 'Crate (30 eggs)',
    quantity: 2,
    prices: { mile12: 5400, bodija: 5100, wuse: 5800, dawanau: 5200, oilmill: 5600 }
  }
];

const MARKET_HUBS = [
  { key: 'mile12', name: 'Mile 12 Market', location: 'Lagos' },
  { key: 'bodija', name: 'Bodija Market', location: 'Ibadan, Oyo' },
  { key: 'wuse', name: 'Wuse / Dei-Dei', location: 'Abuja FCT' },
  { key: 'dawanau', name: 'Dawanau Depot', location: 'Kano' },
  { key: 'oilmill', name: 'Oil Mill Market', location: 'Port Harcourt' }
];

interface SabiBasketComparatorProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onShowToast: (points: number, message: string) => void;
}

export const SabiBasketComparator: React.FC<SabiBasketComparatorProps> = ({ onNavigate, onShowToast }) => {
  const [basket, setBasket] = useState<BasketItem[]>(DEFAULT_STAPLES);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(250000);
  const [selectedHub, setSelectedHub] = useState<string>('mile12');
  const [copied, setCopied] = useState<boolean>(false);

  // Custom Item Adding State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemUnit, setNewItemUnit] = useState<string>('1 Bag / Unit');
  const [newItemPrice, setNewItemPrice] = useState<string>('');

  const updateQuantity = (id: string, delta: number) => {
    setBasket(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setBasket(prev => prev.filter(item => item.id !== id));
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(newItemPrice.replace(/[^0-9]/g, ''), 10);
    if (!newItemName.trim() || !priceNum) return;

    const newItem: BasketItem = {
      id: `custom_${Date.now()}`,
      name: newItemName.trim(),
      unit: newItemUnit || '1 Unit',
      quantity: 1,
      prices: {
        mile12: priceNum,
        bodija: Math.round(priceNum * 0.95),
        wuse: Math.round(priceNum * 1.05),
        dawanau: Math.round(priceNum * 0.9),
        oilmill: Math.round(priceNum * 1.08)
      }
    };

    setBasket(prev => [...prev, newItem]);
    setShowAddModal(false);
    setNewItemName('');
    setNewItemPrice('');
    onShowToast(5, `Added ${newItemName} to your Sabi Household Basket!`);
  };

  // Calculate totals per market hub
  const calculateHubTotal = (hubKey: keyof BasketItem['prices']) => {
    return basket.reduce((sum, item) => sum + (item.prices[hubKey] * item.quantity), 0);
  };

  const hubTotals = MARKET_HUBS.map(hub => ({
    ...hub,
    total: calculateHubTotal(hub.key as any)
  }));

  // Find lowest and highest prices
  const sortedHubs = [...hubTotals].sort((a, b) => a.total - b.total);
  const cheapestHub = sortedHubs[0];
  const mostExpensiveHub = sortedHubs[sortedHubs.length - 1];
  const maxSavings = mostExpensiveHub ? mostExpensiveHub.total - cheapestHub.total : 0;

  const activeHubData = hubTotals.find(h => h.key === selectedHub) || hubTotals[0];

  const handleShareBasket = () => {
    const lines = [
      `🛒 *My Sabi Household Shopping Basket*`,
      `Estimated Cost at ${activeHubData.name} (${activeHubData.location}): *₦${activeHubData.total.toLocaleString()}*`,
      ``,
      `*Items:*`
    ];

    basket.forEach(item => {
      const lineCost = item.prices[selectedHub as keyof BasketItem['prices']] * item.quantity;
      lines.push(`- ${item.name} (${item.unit}) x${item.quantity}: ₦${lineCost.toLocaleString()}`);
    });

    lines.push(``);
    lines.push(`💡 *Cheapest Market:* ${cheapestHub.name} (₦${cheapestHub.total.toLocaleString()})`);
    lines.push(`Verified on SABI Nigeria (https://sabi.ng)`);

    const textToCopy = lines.join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6" id="sabi-basket-comparator-widget">
      
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 mb-1.5">
            <Calculator className="w-3.5 h-3.5 text-emerald-700" />
            <span>Sabi Household Basket & Price Saver</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-display">
            Multi-Market Cost Comparator
          </h2>
          <p className="text-xs text-gray-500">
            Build your family grocery list and compare prices live across Nigeria's major wholesale market hubs.
          </p>
        </div>

        <button
          onClick={handleShareBasket}
          className="bg-[#0A3D2E] hover:bg-[#0c4a37] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#FFD60A]" />
              <span>Copied Shopping List!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[#FFD60A]" />
              <span>Export Shopping List</span>
            </>
          )}
        </button>
      </div>

      {/* MULTI-MARKET PRICE SAVINGS SUMMARY BAR */}
      <div className="bg-emerald-950 text-white rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-300 block">
              Estimated Total at {activeHubData.name} ({activeHubData.location})
            </span>
            <div className="text-3xl font-black font-display text-white mt-0.5">
              ₦{activeHubData.total.toLocaleString()}
            </div>
          </div>

          {maxSavings > 0 && (
            <div className="bg-emerald-900/80 border border-emerald-700/60 p-3 rounded-xl text-xs space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#FFD60A] flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Max Market Savings</span>
              </span>
              <p className="font-extrabold text-white">
                Save up to <span className="text-[#FFD60A] font-black">₦{maxSavings.toLocaleString()}</span> at {cheapestHub.name}
              </p>
            </div>
          )}
        </div>

        {/* MARKET HUB SELECTOR TABS */}
        <div className="pt-2 border-t border-emerald-900/80">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-2">
            Select Market Hub to Compare:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {hubTotals.map(hub => {
              const isSelected = hub.key === selectedHub;
              const isCheapest = hub.key === cheapestHub.key;

              return (
                <button
                  key={hub.key}
                  onClick={() => setSelectedHub(hub.key)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#FFD60A] text-[#0A3D2E] border-[#FFD60A] shadow-sm'
                      : 'bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 border-emerald-800'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{hub.name}</span>
                  <span className="text-[10px] opacity-80">(₦{hub.total.toLocaleString()})</span>
                  {isCheapest && (
                    <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black uppercase">
                      Best Rate
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* BASKET ITEM BUILDER TABLE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-gray-900 font-display flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#0A3D2E]" />
            <span>Your Household Basket ({basket.length} items)</span>
          </h3>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#0A3D2E]" />
            <span>Add Custom Item</span>
          </button>
        </div>

        <div className="space-y-2">
          {basket.map(item => {
            const unitPrice = item.prices[selectedHub as keyof BasketItem['prices']];
            const lineTotal = unitPrice * item.quantity;

            return (
              <div 
                key={item.id} 
                className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-extrabold text-sm text-gray-900 font-display">
                    {item.name}
                  </div>
                  <div className="text-gray-500 text-[11px] flex items-center gap-2">
                    <span>Unit: {item.unit}</span>
                    <span>·</span>
                    <span className="font-semibold text-gray-700">₦{unitPrice.toLocaleString()} / unit</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  {/* Quantity Controller */}
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-extrabold text-xs w-6 text-center text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-24">
                    <span className="text-[10px] text-gray-400 block font-medium">Subtotal</span>
                    <span className="font-black text-sm text-[#0A3D2E]">
                      ₦{lineTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-600 p-1 rounded-lg transition-all cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ASK SABO AI BUYING ADVICE BUTTON */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="font-extrabold text-amber-900 font-display flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Need Market Bargaining Tips for this Basket?</span>
          </span>
          <p className="text-gray-600 text-[11px]">
            Ask Sabo AI for seasonal harvest predictions and wholesale bargaining strategies across Nigerian markets.
          </p>
        </div>

        <button
          onClick={() => onNavigate('sabiers')}
          className="bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer"
        >
          <span>Ask Sabo AI</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#FFD60A]" />
        </button>
      </div>

      {/* ADD CUSTOM ITEM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleAddCustomItem} className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 font-display">
                Add Item to Household Basket
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Frozen Chicken, Semovita, Frozen Fish..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Unit Description</label>
                <input
                  type="text"
                  placeholder="e.g., 10kg Carton, 1 Crate, 1 Paint Rubber..."
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Estimated Unit Price (₦)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 25000"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none text-gray-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#0A3D2E] hover:bg-[#0c4a37] text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span>Add to Basket</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
