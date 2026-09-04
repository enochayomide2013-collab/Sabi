import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  ShoppingBasket, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Check, 
  Edit2, 
  ArrowRight, 
  Utensils, 
  Plus, 
  ShieldCheck, 
  Loader2,
  Calculator,
  Store,
  Compass,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { storageService, SelectedLocation } from '../../services/storageService';
import { AiService } from '../../services/aiService';
import { MarketItem } from '../../types';
import { SabiBasketComparator } from './SabiBasketComparator';
import { SmartMarketFinder } from './SmartMarketFinder';

interface MarketViewProps {
  initialItemId?: string;
  onNavigate: (tab: string, extraData?: any) => void;
  onShowPointsToast: (points: number, message: string) => void;
}

export const MarketView: React.FC<MarketViewProps> = ({ initialItemId, onNavigate, onShowPointsToast }) => {
  const [marketSubTab, setMarketSubTab] = useState<'smart-finder' | 'intelligence' | 'basket'>('smart-finder');
  const [marketItems, setMarketItems] = useState<MarketItem[]>(storageService.getMarketItems());
  const [selectedItem, setSelectedItem] = useState<MarketItem>(
    initialItemId ? marketItems.find(m => m.id === initialItemId) || marketItems[0] : marketItems[0]
  );
  const [historyFilter, setHistoryFilter] = useState<'7Days' | '30Days' | '6Months'>('7Days');
  const [location, setLocation] = useState<SelectedLocation>(storageService.getLocation());

  useEffect(() => {
    if (initialItemId) {
      const match = marketItems.find(m => m.id === initialItemId);
      if (match) setSelectedItem(match);
    }
  }, [initialItemId, marketItems]);

  // Snapping & AI Food Detection State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [detectedName, setDetectedName] = useState<string | null>(null);
  const [isSelectingManualFood, setIsSelectingManualFood] = useState<boolean>(false);

  // Submit Fresh Price Modal
  const [isPriceModalOpen, setIsPriceModalOpen] = useState<boolean>(false);
  const [newPriceValue, setNewPriceValue] = useState<string>('');
  const [newUnitType, setNewUnitType] = useState<string>('Large Unit');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      const all = storageService.getMarketItems();
      setMarketItems(all);
      setLocation(storageService.getLocation());
      if (selectedItem) {
        const fresh = all.find(i => i.id === selectedItem.id);
        if (fresh) setSelectedItem(fresh);
      }
    });
    return unsubscribe;
  }, [selectedItem]);

  const handleFoodCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFoodImage(file.name);
  };

  const processFoodImage = async (filename: string) => {
    setIsScanning(true);
    const res = await AiService.recognizeFoodItem(filename);
    setIsScanning(false);
    setDetectedName(res.detectedItemName);

    if (res.marketMatchId) {
      const match = marketItems.find(m => m.id === res.marketMatchId);
      if (match) setSelectedItem(match);
    }
  };

  const handleManualFoodSelect = (item: MarketItem) => {
    setSelectedItem(item);
    setDetectedName(item.name);
    setIsSelectingManualFood(false);
  };

  const handleSubmitNewPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(newPriceValue.replace(/[^0-9]/g, ''), 10);
    if (!priceNum || !selectedItem) return;

    storageService.addMarketPriceReport(
      selectedItem.id,
      location.state,
      location.area || location.lga,
      priceNum,
      newUnitType
    );

    setIsPriceModalOpen(false);
    setNewPriceValue('');
    onShowPointsToast(10, `Earned +10 Stat Points for reporting ${selectedItem.name} price at ${location.area}!`);
  };

  const chartData = selectedItem.history[historyFilter];

  return (
    <div className={`${marketSubTab === 'smart-finder' ? 'max-w-6xl' : 'max-w-2xl'} mx-auto space-y-6 pb-16 animate-fade-in`}>
      
      {/* Mode Sub-tab Navigation */}
      <div className="flex bg-gray-200/80 p-1.5 rounded-2xl gap-1.5 shadow-inner">
        <button
          type="button"
          onClick={() => setMarketSubTab('smart-finder')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            marketSubTab === 'smart-finder'
              ? 'bg-[#0A3D2E] text-white shadow-sm font-extrabold'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/60'
          }`}
        >
          <Store className="w-4 h-4 text-[#FFD60A]" />
          <span>Smart Market Finder</span>
        </button>

        <button
          type="button"
          onClick={() => setMarketSubTab('intelligence')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            marketSubTab === 'intelligence'
              ? 'bg-[#0A3D2E] text-white shadow-sm font-extrabold'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/60'
          }`}
        >
          <ShoppingBasket className="w-4 h-4 text-[#FFD60A]" />
          <span>Spotter Price Tracker</span>
        </button>

        <button
          type="button"
          onClick={() => setMarketSubTab('basket')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            marketSubTab === 'basket'
              ? 'bg-[#0A3D2E] text-white shadow-sm font-extrabold'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/60'
          }`}
        >
          <Calculator className="w-4 h-4 text-[#FFD60A]" />
          <span>Household Basket</span>
        </button>
      </div>

      {marketSubTab === 'smart-finder' ? (
        <SmartMarketFinder
          onSelectItemForSpotter={(itemId) => {
            const match = marketItems.find(i => i.id === itemId);
            if (match) {
              setSelectedItem(match);
              setMarketSubTab('intelligence');
            }
          }}
          onOpenBasketComparator={() => setMarketSubTab('basket')}
        />
      ) : marketSubTab === 'basket' ? (
        <SabiBasketComparator onNavigate={onNavigate} onShowToast={onShowPointsToast} />
      ) : (
        <>
          {/* Page Header (Section 41) */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full uppercase">
              <ShoppingBasket className="w-3.5 h-3.5" />
              <span>Market Price Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
              Market Price Tracker
            </h1>
            <p className="text-sm text-gray-600">
              Take a picture of a food item or select below to view reported prices across Nigerian locations.
            </p>
          </div>

      {/* SNAP FOOD ITEM HERO / UPLOAD ACTIONS */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4">
        
        {isScanning ? (
          <div className="py-8 text-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#0A3D2E] mx-auto" />
            <p className="text-sm font-bold text-gray-800 font-display">
              SABI AI is analyzing the food image...
            </p>
            <p className="text-xs text-gray-500">Detecting produce type and pulling verified local prices</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-grow bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-extrabold text-base py-4 px-6 rounded-2xl shadow-md flex items-center justify-center gap-3 active:scale-95 transition-all font-display"
            >
              <Camera className="w-6 h-6 stroke-[2.5]" />
              <span>SNAP FOOD ITEM</span>
            </button>

            <button
              onClick={() => setIsSelectingManualFood(true)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs py-4 px-5 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBasket className="w-4 h-4" />
              <span>Select Other Item</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFoodCapture}
              className="hidden"
            />
          </div>
        )}

        {/* FOOD IDENTIFICATION BANNER (Section 42) */}
        <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-gray-500 font-medium uppercase text-[10px] tracking-wider block">
              SABI Identifies this as:
            </span>
            <strong className="text-sm text-gray-900 font-bold font-display">
              {selectedItem.name}
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
              ✓ Match
            </span>
            <button
              onClick={() => setIsSelectingManualFood(true)}
              className="text-xs font-bold text-[#0A3D2E] hover:underline"
            >
              Change Item
            </button>
          </div>
        </div>

      </div>

      {/* MANUAL FOOD SELECTOR MODAL */}
      {isSelectingManualFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 font-display">
                Select Market Food Item
              </h3>
              <button
                onClick={() => setIsSelectingManualFood(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {marketItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleManualFoodSelect(item)}
                  className={`p-3 rounded-2xl border text-left space-y-1.5 transition-all ${
                    selectedItem.id === item.id
                      ? 'border-[#0A3D2E] bg-emerald-50 text-[#0A3D2E]'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <img src={item.imageUrl} alt={item.name} className="w-full h-20 rounded-xl object-cover" />
                  <span className="font-bold text-xs block font-display line-clamp-1">{item.name}</span>
                  <span className="text-[10px] text-gray-500 block">{item.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRIMARY MARKET PRICE RESULT CARD (Section 43) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
        
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase text-gray-500 tracking-wider">
              {selectedItem.category} · Community-Reported Prices
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 font-display">
              {selectedItem.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-[#0A3D2E]" />
              <span>{selectedItem.primaryLocation.area} ({selectedItem.primaryLocation.state})</span>
              <span className="text-gray-400">· Updated {selectedItem.primaryLocation.lastUpdated}</span>
            </div>
          </div>

          <button
            onClick={() => setIsPriceModalOpen(true)}
            className="bg-emerald-50 hover:bg-emerald-100 text-[#0A3D2E] border border-emerald-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Price (+10 pts)</span>
          </button>
        </div>

        {/* 2 Primary Price Boxes: Large Unit vs Small Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
              {selectedItem.primaryLocation.largeUnitName}
            </span>
            <div className="text-2xl font-extrabold text-[#0A3D2E] font-display">
              ₦{selectedItem.primaryLocation.largeUnitPrice.toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-500">
              Based on {selectedItem.primaryLocation.reportsCount} on-ground trader receipts
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
              {selectedItem.primaryLocation.smallUnitName}
            </span>
            <div className="text-2xl font-extrabold text-gray-900 font-display">
              ₦{selectedItem.primaryLocation.smallUnitPrice.toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-500">
              Retail portion / consumer measure
            </div>
          </div>

        </div>

        {/* SMALL RETAIL PORTIONS & UNIT PRICING (Sachet, Cup, Mudu, Derica, Paint Rubber, etc.) */}
        {selectedItem.retailPortions && selectedItem.retailPortions.length > 0 && (
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-3" id="retail-portions-section">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShoppingBasket className="w-4 h-4 text-amber-700" />
                <span className="font-bold text-xs text-amber-950 font-display uppercase tracking-wide">
                  Small Retail Quantities & Unit Breakdown
                </span>
              </div>
              <span className="text-[11px] text-amber-800 font-semibold">
                Current Market Rates
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {selectedItem.retailPortions.map((portion, pIdx) => (
                <div
                  key={pIdx}
                  className="bg-white rounded-xl p-3 border border-amber-200/60 shadow-2xs space-y-1 text-center"
                >
                  <span className="text-[10px] font-bold text-gray-500 uppercase block truncate">
                    {portion.unitName}
                  </span>
                  <div className="text-base font-extrabold text-[#0A3D2E] font-display">
                    ₦{portion.price.toLocaleString()}
                  </div>
                  {portion.description && (
                    <span className="text-[9px] text-gray-400 block truncate">
                      {portion.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRICE CONFIDENCE METER (Section 45) */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950 font-display flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Price Confidence: {selectedItem.baseConfidence}%
            </span>
            <span className="text-[11px] font-semibold text-emerald-800">
              {selectedItem.totalReportsCount} Verified Reports
            </span>
          </div>
          <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full"
              style={{ width: `${selectedItem.baseConfidence}%` }}
            />
          </div>
          <p className="text-[11px] text-emerald-900 leading-tight">
            Confidence reflects the volume and freshness of community reports. Always negotiate locally.
          </p>
        </div>

      </div>

      {/* COMPARISON ACROSS NIGERIAN HUBS (Section 43) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-gray-900 font-display">
          Prices in Other Nigerian Locations
        </h3>

        <div className="space-y-2.5">
          {selectedItem.otherLocations.map((loc, idx) => (
            <div
              key={idx}
              className="bg-gray-50 hover:bg-gray-100/80 rounded-2xl p-3.5 border border-gray-200/80 flex items-center justify-between gap-3 text-xs transition-colors"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-gray-900 text-sm font-display flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0A3D2E]" />
                  <span>{loc.state}</span>
                </div>
                <span className="text-gray-500 text-[11px]">{loc.area}</span>
              </div>

              <div className="text-right">
                <div className="font-extrabold text-sm text-gray-900 font-display">
                  ₦{loc.largeUnitPrice.toLocaleString()}
                </div>
                <div className="flex items-center justify-end gap-1 text-[10px] font-semibold text-gray-500">
                  {loc.priceTrend === 'down' ? (
                    <span className="text-emerald-700 flex items-center">
                      <TrendingDown className="w-3 h-3" /> -{loc.trendPercent}%
                    </span>
                  ) : loc.priceTrend === 'up' ? (
                    <span className="text-red-700 flex items-center">
                      <TrendingUp className="w-3 h-3" /> +{loc.trendPercent}%
                    </span>
                  ) : (
                    <span>Stable</span>
                  )}
                  <span>· {loc.reportsCount} reports</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESPONSIVE PRICE HISTORY CHART (Section 44) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-base text-gray-900 font-display">
              Price History Trend
            </h3>
            <p className="text-xs text-gray-500">Track price movements and seasonal cycles</p>
          </div>

          <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold">
            {(['7Days', '30Days', '6Months'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setHistoryFilter(tab)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  historyFilter === tab
                    ? 'bg-white text-[#0A3D2E] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === '7Days' ? '7 Days' : tab === '30Days' ? '30 Days' : '6 Months'}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts responsive Area chart */}
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="priceColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A3D2E" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0A3D2E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: '#6b7280' }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#6b7280' }} 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(val) => `₦${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(val: number | string | Array<number | string> | undefined) => [
                  `₦${Number(val || 0).toLocaleString()}`, 
                  'Reported Price'
                ]}
                labelFormatter={(label) => `Timeline: ${label}`}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#0A3D2E" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#priceColor)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-50 rounded-2xl p-3 text-xs text-gray-600 border border-gray-200">
          <strong>Seasonality Note:</strong> {selectedItem.seasonalityNote}
        </div>
      </div>

      {/* RECIPE SHORTCUT PROMPT */}
      <div className="bg-gradient-to-r from-emerald-900 to-[#0A3D2E] text-white rounded-3xl p-6 flex items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-[#FFD60A] uppercase tracking-wide">
            Cook What You Buy
          </div>
          <h3 className="font-bold text-base font-display">
            Make a Nigerian Recipe with {selectedItem.name}
          </h3>
          <p className="text-xs text-emerald-200">
            Generate simple 3-step recipes and 20-second video walkthroughs.
          </p>
        </div>

        <button
          onClick={() => onNavigate('recipe')}
          className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-bold text-xs px-5 py-3 rounded-2xl shadow-sm transition-all shrink-0 active:scale-95 flex items-center gap-1.5 font-display"
        >
          <Utensils className="w-4 h-4" />
          <span>Generate Recipe</span>
        </button>
      </div>

      {/* SUBMIT FRESH PRICE MODAL */}
      {isPriceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-gray-900 font-display">
                Report Fresh Price for {selectedItem.name}
              </h3>
              <button
                onClick={() => setIsPriceModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewPrice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Location (Current)
                </label>
                <div className="bg-gray-100 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 font-bold flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#0A3D2E]" />
                  <span>{location.area || location.lga}, {location.state}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Unit Measure
                </label>
                <select
                  value={newUnitType}
                  onChange={(e) => setNewUnitType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0A3D2E]"
                >
                  <option value="Large Unit">{selectedItem.primaryLocation.largeUnitName}</option>
                  <option value="Small Unit">{selectedItem.primaryLocation.smallUnitName}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Observed Price (in Naira ₦)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 54000"
                  value={newPriceValue}
                  onChange={(e) => setNewPriceValue(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#0A3D2E]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPriceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md"
                >
                  Submit & Earn +10 Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}

    </div>
  );
};
