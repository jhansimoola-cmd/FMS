import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, X, ChevronDown, Package, Wrench, DollarSign, Globe, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LineItem {
  id: string;
  category: string;
  costCode: string;
  netAmount: number;
  quantity: number;
  partsCost: number;
  labourCost: number;
  labourHours: number;
  labourUnitPrice: number;
  comment: string;
}

interface WorkOrder {
  region: string;
  currency: string;
  trailerType: string;
  lineItems: LineItem[];
}

const REGIONS = ['Denmark', 'Sweden', 'Norway', 'Finland', 'Germany', 'France', 'United Kingdom', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Poland'];
const CURRENCIES = ['DKK','USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'SEK'];
const TRAILER_TYPES = ['Dry Van', 'Curtain','Refrigerated', 'Flatbed', 'Step Deck', 'Lowboy', 'Tanker'];
const LINE_ITEM_CATEGORIES = ['Brakes', 'Tyres','Lights', 'Suspension', 'Electrical', 'Chassis', 'Body', 'Other'];

const INITIAL_DRAFT_NUMBER = Math.floor(Math.random() * 10000);

const generateLineItemId = () => `orderline-${crypto.randomUUID()}`;

export default function App() {
  const [workOrder, setWorkOrder] = useState<WorkOrder>({
    region: '',
    currency: 'USD',
    trailerType: '',
    lineItems: [
      {
        id: generateLineItemId(),
        category: '',
        costCode: '',
        netAmount: 0,
        quantity: 1,
        partsCost: 0,
        labourCost: 0,
        labourHours: 0,
        labourUnitPrice: 0,
        comment: '',
      },
    ],
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const addLineItem = () => {
    setWorkOrder((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        {
          id: generateLineItemId(),
          category: '',
          costCode: '',
          netAmount: 0,
          quantity: 1,
          partsCost: 0,
          labourCost: 0,
          labourHours: 0,
          labourUnitPrice: 0,
          comment: '',
        },
      ],
    }));
  };

  const removeLineItem = (id: string) => {
    if (workOrder.lineItems.length === 1) return;
    setWorkOrder((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setWorkOrder((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Calculate labour cost if hours or unit price changes
          if (field === 'labourHours' || field === 'labourUnitPrice') {
            updatedItem.labourCost = Number(updatedItem.labourHours) * Number(updatedItem.labourUnitPrice);
          }

          // Automatically calculate net amount if parts, labour cost, or quantity changes
          if (field === 'partsCost' || field === 'labourCost' || field === 'quantity' || field === 'labourHours' || field === 'labourUnitPrice') {
            updatedItem.netAmount = (Number(updatedItem.partsCost) + Number(updatedItem.labourCost)) * Number(updatedItem.quantity);
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted Locally');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const totalAmount = workOrder.lineItems.reduce((sum, item) => sum + item.netAmount, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Package size={20} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-800">WorkOrder Pro</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <span>Draft #{INITIAL_DRAFT_NUMBER}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Work Order Level Details */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Globe size={16} />
                General Information
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Region / Country</label>
                <div className="relative">
                  <select
                    required
                    data-field="region"
                    value={workOrder.region}
                    onChange={(e) => setWorkOrder({ ...workOrder, region: e.target.value })}
                    className="w-full h-11 pl-4 pr-10 bg-white border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  >
                    <option value="">Select Region</option>
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Currency</label>
                <div className="relative">
                  <select
                    required
                    data-field="currency"
                    value={workOrder.currency}
                    onChange={(e) => setWorkOrder({ ...workOrder, currency: e.target.value })}
                    className="w-full h-11 pl-4 pr-10 bg-white border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Trailer Type</label>
                <div className="relative">
                  <select
                    required
                    data-field="trailerType"
                    value={workOrder.trailerType}
                    onChange={(e) => setWorkOrder({ ...workOrder, trailerType: e.target.value })}
                    className="w-full h-11 pl-4 pr-10 bg-white border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  >
                    <option value="">Select Type</option>
                    {TRAILER_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <Truck className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </section>

          {/* Line Items Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Wrench size={20} className="text-indigo-600" />
                Line Items
              </h2>
              <button
                type="button"
                onClick={addLineItem}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors border border-indigo-100"
              >
                <Plus size={18} />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {workOrder.lineItems.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={item.id}
                  data-line-item={item.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group"
                >
                  <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Item #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      disabled={workOrder.lineItems.length === 1}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                        <select
                          required
                          data-item-field="category"
                          value={item.category}
                          onChange={(e) => updateLineItem(item.id, 'category', e.target.value)}
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                        >
                          <option value="">Select Category</option>
                          {LINE_ITEM_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cost Code</label>
                        <input
                          required
                          type="text"
                          data-item-field="costCode"
                          placeholder="e.g. BRK-001"
                          value={item.costCode}
                          onChange={(e) => updateLineItem(item.id, 'costCode', e.target.value)}
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</label>
                        <input
                          required
                          type="number"
                          min="1"
                          data-item-field="quantity"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Parts Cost</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                          <input
                            required
                            type="text"
                            inputMode="decimal"
                            data-item-field="partsCost"
                            placeholder="0.00"
                            value={item.partsCost === 0 ? '' : item.partsCost.toString()}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateLineItem(item.id, 'partsCost', val);
                            }}
                            className="w-full h-10 pl-7 pr-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Labour Hours</label>
                        <input
                          required
                          type="number"
                          step="0.1"
                          min="0"
                          data-item-field="labourHours"
                          placeholder="0.0"
                          value={item.labourHours === 0 ? '' : item.labourHours}
                          onChange={(e) => updateLineItem(item.id, 'labourHours', parseFloat(e.target.value) || 0)}
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Labour Unit Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                          <input
                            required
                            type="text"
                            inputMode="decimal"
                            data-item-field="labourUnitPrice"
                            placeholder="0.00"
                            value={item.labourUnitPrice === 0 ? '' : item.labourUnitPrice.toString()}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateLineItem(item.id, 'labourUnitPrice', val);
                            }}
                            className="w-full h-10 pl-7 pr-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Labour Cost</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                          <input
                            readOnly
                            type="text"
                            data-item-field="labourCost"
                            placeholder="0.00"
                            value={item.labourCost}
                            className="w-full h-10 pl-7 pr-3 bg-slate-100 border border-slate-200 rounded-lg outline-none text-sm font-medium text-slate-600 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Amount</label>
                        <div 
                          data-item-field="netAmount"
                          className="w-full h-10 px-3 bg-slate-100 border border-slate-200 rounded-lg flex items-center text-sm font-semibold text-slate-600"
                        >
                          {workOrder.currency} {item.netAmount.toLocaleString(undefined, { minimumFractionDigits: 4 })}
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Comment / Description</label>
                        <input
                          type="text"
                          data-item-field="comment"
                          placeholder="Additional details..."
                          value={item.comment}
                          onChange={(e) => updateLineItem(item.id, 'comment', e.target.value)}
                          className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Footer / Summary */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <DollarSign className="text-indigo-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Work Order Value</p>
                <p className="text-2xl font-bold text-slate-900">
                  {workOrder.currency} {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                className="flex-1 md:flex-none px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit flex-1 md:flex-none px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-[0.98]"
              >
                Submit Work Order
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* Success Popup */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[320px]">
              <div className="bg-white/20 p-1.5 rounded-full">
                <CheckCircle2 size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold">Successfully Submitted</p>
                <p className="text-emerald-50 text-sm">Work order has been recorded.</p>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
