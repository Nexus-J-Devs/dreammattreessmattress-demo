import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { Mattress, QuizSubmission, DiscountPromo, Category } from '../../types';
import {
  Package, Tag, Sparkles, AlertTriangle, Radio, Plus, Trash2, Edit3, Save,
  Check, Search, RefreshCw, LogOut, Bell, Flame, ShieldAlert, Phone, Mail
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { session, logout } = useAuth();
  const { isConnected, notifications, clearAllNotifications } = useWebSocket();

  const [activeTab, setActiveTab] = useState<'inventory' | 'sales' | 'quizLeads' | 'websocketLog'>('inventory');
  
  // Data State
  const [products, setProducts] = useState<Mattress[]>([]);
  const [quizLeads, setQuizLeads] = useState<QuizSubmission[]>([]);
  const [discounts, setDiscounts] = useState<DiscountPromo[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Inline Table Edit State (ProductId -> { price, stock, category })
  const [editingRows, setEditingRows] = useState<Record<string, { price: number; stock: number; category: Category }>>({});
  const [savingProductId, setSavingProductId] = useState<string | null>(null);

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    tagline: '',
    price: 1199,
    originalPrice: 1599,
    stock: 10,
    category: 'Hybrid' as Category,
    firmness: 6,
    firmnessLabel: 'Medium Plush (6/10)',
    thickness: '14 Inches',
    coilCount: '1,200 Pocket Coils',
    coolingTech: 'Copper Phase Change Foam',
    description: 'High performance sleep system.'
  });

  // New Discount Form State
  const [isAddDiscountOpen, setIsAddDiscountOpen] = useState(false);
  const [newDiscountForm, setNewDiscountForm] = useState({
    code: '',
    title: '',
    discountType: 'fixed' as 'fixed' | 'percentage',
    discountValue: 150,
    description: '',
    validUntil: '2026-12-31'
  });

  // Simulation Status State
  const [simulating, setSimulating] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${session.token}` };

      // Fetch products
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      setProducts(prodData.products || []);

      // Fetch quiz submissions
      const quizRes = await fetch('/api/admin/quiz-submissions', { headers });
      if (quizRes.ok) {
        const quizData = await quizRes.json();
        setQuizLeads(quizData.submissions || []);
      }

      // Fetch discounts
      const discRes = await fetch('/api/discounts');
      const discData = await discRes.json();
      setDiscounts(discData.discounts || []);

    } catch (e) {
      console.error('Failed to fetch admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [session.token]);

  // Handle inline field edits
  const handleInlineChange = (id: string, field: 'price' | 'stock' | 'category', value: any) => {
    setEditingRows(prev => {
      const current = prev[id] || {
        price: products.find(p => p.id === id)?.price || 0,
        stock: products.find(p => p.id === id)?.stock || 0,
        category: products.find(p => p.id === id)?.category || 'Hybrid'
      };
      return {
        ...prev,
        [id]: {
          ...current,
          [field]: value
        }
      };
    });
  };

  const handleSaveProductRow = async (product: Mattress) => {
    const edits = editingRows[product.id];
    if (!edits) return;

    setSavingProductId(product.id);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify({
          price: Number(edits.price),
          stock: Number(edits.stock),
          category: edits.category
        })
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(prev => prev.map(p => p.id === product.id ? data.product : p));
        setEditingRows(prev => {
          const copy = { ...prev };
          delete copy[product.id];
          return copy;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProductId(null);
    }
  };

  // Add Product Submit
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify(newProductForm)
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(prev => [data.product, ...prev]);
        setIsAddProductOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product from inventory?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.token}` }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Discount
  const handleAddDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify(newDiscountForm)
      });
      if (res.ok) {
        const data = await res.json();
        setDiscounts(prev => [...prev, data.discount]);
        setIsAddDiscountOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Discount
  const handleDeleteDiscount = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/sales/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.token}` }
      });
      if (res.ok) {
        setDiscounts(prev => prev.filter(d => d.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger Low Stock WebSocket Simulation
  const handleSimulateLowStock = async () => {
    setSimulating(true);
    try {
      await fetch('/api/admin/simulate-low-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify({ productId: products[1]?.id || products[0]?.id })
      });
      fetchAdminData();
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = products.filter(p => p.stock <= 5).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs uppercase">
                Admin Control Room
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
                <Radio className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
                <span>WS Feed: {isConnected ? 'Online' : 'Reconnecting'}</span>
              </div>
            </div>
            <h1 className="text-2xl font-serif font-bold text-white mt-1">
              Dream Haven Store Management & Live Feeds
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateLowStock}
              disabled={simulating}
              className="px-3.5 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
              title="Test WebSocket low stock alert trigger"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Simulate Low Stock Push</span>
            </button>

            <button
              onClick={logout}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Real-time Status Alert Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-serif font-bold text-white">{products.length}</div>
              <div className="text-xs text-slate-400">Active Mattress SKUs</div>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
            lowStockCount > 0 ? 'bg-rose-950/60 border-rose-500/40 text-rose-100' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
              lowStockCount > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-serif font-bold text-white">{lowStockCount} SKUs</div>
              <div className="text-xs text-slate-300">Low Stock Alerts (&le; 5 units)</div>
            </div>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-serif font-bold text-white">{quizLeads.length} Leads</div>
              <div className="text-xs text-slate-400">Sleep Quiz Submissions</div>
            </div>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-serif font-bold text-white">{discounts.length} Active</div>
              <div className="text-xs text-slate-400">Sales & Promo Codes</div>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
          {[
            { id: 'inventory', label: 'Product Inventory & Pricing', icon: <Package className="w-4 h-4" /> },
            { id: 'sales', label: 'Sales, Coupons & Promos', icon: <Tag className="w-4 h-4" /> },
            { id: 'quizLeads', label: `Quiz Results (${quizLeads.length})`, icon: <Sparkles className="w-4 h-4" /> },
            { id: 'websocketLog', label: `WebSocket Feed (${notifications.length})`, icon: <Bell className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: PRODUCT INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Search & Category Filter */}
              <div className="flex items-center gap-3 flex-1 max-w-lg">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search mattresses by title or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Cooling Gel">Cooling Gel</option>
                  <option value="Organic Latex">Organic Latex</option>
                  <option value="Orthopedic">Orthopedic</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddProductOpen(!isAddProductOpen)}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>

                <button
                  onClick={fetchAdminData}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
                  title="Refresh Inventory"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add Product Modal Drawer */}
            {isAddProductOpen && (
              <form onSubmit={handleAddProductSubmit} className="p-6 bg-slate-900 rounded-2xl border border-amber-400/30 space-y-4 shadow-2xl">
                <h3 className="font-serif font-bold text-lg text-white">Add New Mattress to Inventory</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Mattress Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Reserve Pillowtop"
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Price ($)</label>
                    <input
                      type="number"
                      required
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Stock Count (Units)</label>
                    <input
                      type="number"
                      required
                      value={newProductForm.stock}
                      onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Category Tag</label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as any })}
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    >
                      <option value="Hybrid">Hybrid</option>
                      <option value="Cooling Gel">Cooling Gel</option>
                      <option value="Organic Latex">Organic Latex</option>
                      <option value="Orthopedic">Orthopedic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Tagline</label>
                    <input
                      type="text"
                      placeholder="Targeted lumbar pressure relief"
                      value={newProductForm.tagline}
                      onChange={(e) => setNewProductForm({ ...newProductForm, tagline: e.target.value })}
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Firmness (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={newProductForm.firmness}
                      onChange={(e) => setNewProductForm({ ...newProductForm, firmness: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
                  >
                    Save & Broadcast
                  </button>
                </div>
              </form>
            )}

            {/* Inventory Table View with Direct Inline Edits */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Product Details</th>
                      <th className="p-4">Category Tag</th>
                      <th className="p-4">Direct Price ($)</th>
                      <th className="p-4">Stock Units</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredProducts.map((p) => {
                      const isEdited = !!editingRows[p.id];
                      const currentPrice = editingRows[p.id]?.price ?? p.price;
                      const currentStock = editingRows[p.id]?.stock ?? p.stock;
                      const currentCat = editingRows[p.id]?.category ?? p.category;
                      const isLow = currentStock <= 5;

                      return (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-10 object-cover rounded border border-slate-800 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-sm text-white">{p.name}</div>
                                <div className="text-[11px] text-slate-400 truncate max-w-xs">{p.tagline}</div>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <select
                              value={currentCat}
                              onChange={(e) => handleInlineChange(p.id, 'category', e.target.value)}
                              className="bg-slate-950 border border-slate-700 rounded p-1 text-xs text-white"
                            >
                              <option value="Hybrid">Hybrid</option>
                              <option value="Cooling Gel">Cooling Gel</option>
                              <option value="Organic Latex">Organic Latex</option>
                              <option value="Orthopedic">Orthopedic</option>
                            </select>
                          </td>

                          <td className="p-4">
                            <input
                              type="number"
                              value={currentPrice}
                              onChange={(e) => handleInlineChange(p.id, 'price', e.target.value)}
                              className="w-24 p-1.5 rounded bg-slate-950 border border-slate-700 text-white font-bold text-xs"
                            />
                          </td>

                          <td className="p-4">
                            <input
                              type="number"
                              value={currentStock}
                              onChange={(e) => handleInlineChange(p.id, 'stock', e.target.value)}
                              className={`w-20 p-1.5 rounded bg-slate-950 border text-xs font-bold ${
                                isLow ? 'border-rose-500 text-rose-300' : 'border-slate-700 text-white'
                              }`}
                            />
                          </td>

                          <td className="p-4">
                            {isLow ? (
                              <span className="px-2 py-1 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-bold inline-flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-rose-400" />
                                Low Stock ({currentStock})
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                                In Stock ({currentStock})
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isEdited && (
                                <button
                                  onClick={() => handleSaveProductRow(p)}
                                  disabled={savingProductId === p.id}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-emerald-400"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>Save</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                                title="Delete SKU"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SALES & DISCOUNT CAMPAIGNS */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl text-white">Active Promotional Discounts</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage store coupons, seasonal banners & senior discount codes.</p>
              </div>

              <button
                onClick={() => setIsAddDiscountOpen(!isAddDiscountOpen)}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Promo Code</span>
              </button>
            </div>

            {isAddDiscountOpen && (
              <form onSubmit={handleAddDiscountSubmit} className="p-6 bg-slate-900 rounded-2xl border border-amber-400/30 space-y-4">
                <h4 className="font-bold text-sm text-white">New Discount Campaign</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Coupon Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FALL200"
                      value={newDiscountForm.code}
                      onChange={(e) => setNewDiscountForm({ ...newDiscountForm, code: e.target.value })}
                      className="w-full p-2 rounded bg-slate-950 border border-slate-700 text-white uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Campaign Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Labor Day Sleep Event"
                      value={newDiscountForm.title}
                      onChange={(e) => setNewDiscountForm({ ...newDiscountForm, title: e.target.value })}
                      className="w-full p-2 rounded bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Discount Amount ($)</label>
                    <input
                      type="number"
                      required
                      value={newDiscountForm.discountValue}
                      onChange={(e) => setNewDiscountForm({ ...newDiscountForm, discountValue: Number(e.target.value) })}
                      className="w-full p-2 rounded bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddDiscountOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
                  >
                    Launch Campaign
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {discounts.map((disc) => (
                <div key={disc.id} className="p-5 bg-slate-900 rounded-2xl border border-slate-800 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20 text-xs">
                        {disc.code}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        {disc.discountType === 'fixed' ? `$${disc.discountValue} OFF` : `${disc.discountValue}% OFF`}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-base text-white mt-2">{disc.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{disc.description}</p>
                    <p className="text-[11px] text-slate-500 mt-2 font-mono">Valid until: {disc.validUntil}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteDiscount(disc.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER SLEEP QUIZ LEADS */}
        {activeTab === 'quizLeads' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif font-bold text-xl text-white">Customer Sleep Preference Submissions</h3>
              <p className="text-xs text-slate-400 mt-0.5">Live leads captured from the 60-Second Sleep Quiz.</p>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Customer Contact</th>
                      <th className="p-4">Sleep Profile</th>
                      <th className="p-4">Pain Points</th>
                      <th className="p-4">Recommended SKU</th>
                      <th className="p-4">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {quizLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/40">
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{lead.answers.customerName || 'Anonymous Customer'}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            <span>{lead.answers.customerEmail || 'N/A'}</span>
                          </div>
                          {lead.answers.customerPhone && (
                            <div className="text-[11px] text-amber-300 flex items-center gap-1 mt-0.5 font-mono">
                              <Phone className="w-3 h-3" />
                              <span>{lead.answers.customerPhone}</span>
                            </div>
                          )}
                        </td>

                        <td className="p-4">
                          <div className="font-semibold text-slate-200 capitalize">
                            Position: {lead.answers.sleepPosition}
                          </div>
                          <div className="text-[11px] text-slate-400 capitalize">
                            Firmness: {lead.answers.firmnessPreference} | Temp: {lead.answers.temperature}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {lead.answers.painPoints.map((pain, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10px]">
                                {pain.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-amber-300 text-xs">
                            {lead.recommendedProduct?.name} ({lead.matchScore}% Match)
                          </div>
                        </td>

                        <td className="p-4 text-[11px] text-slate-500 font-mono">
                          {new Date(lead.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WEBSOCKET LIVE EVENT LOG */}
        {activeTab === 'websocketLog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl text-white">Live WebSocket Notifications History</h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time alerts streamed directly from the Express server.</p>
              </div>

              <button
                onClick={clearAllNotifications}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white"
              >
                Clear Log
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
                  <Bell className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-white">{notif.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(notif.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
