import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  LayoutDashboard,
  Box,
  Settings,
  Moon,
  Sun,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ServerCrash,
  Loader2,
  Info,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080';

const MOCK_INITIAL_DATA = [
  { id: 1, productName: 'Sony WH-1000XM5', productPrice: 348.99, productDescription: 'Industry leading noise canceling headphones.', productStatus: 'Available' },
  { id: 2, productName: 'Apple MacBook Pro 16"', productPrice: 2499.00, productDescription: 'M2 Max chip, 32GB RAM, 1TB SSD.', productStatus: 'Available' },
  { id: 3, productName: 'Logitech MX Master 3S', productPrice: 99.99, productDescription: 'Advanced wireless mouse with ultra-fast scrolling.', productStatus: 'Not Available' },
  { id: 4, productName: 'Keychron Q1 Pro', productPrice: 199.00, productDescription: 'Custom mechanical keyboard with wireless connectivity.', productStatus: 'Available' },
  { id: 5, productName: 'Dell UltraSharp 32', productPrice: 850.00, productDescription: '4K USB-C Hub Monitor for professionals.', productStatus: 'Not Available' }
];

export default function App() {
  const [products, setProducts] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'products', 'form'
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // 1. Initialize dark mode from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      // Fallback to the user's computer system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; 
  });

  // 2. Apply dark mode to HTML element AND save it to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (isDemoMode) return; 
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.warn('Backend unreachable. Switched to demo mode.', err);
      setIsDemoMode(true);
      setProducts(MOCK_INITIAL_DATA);
      setError('Preview Mode: The cloud environment cannot connect to your local Spring Boot server (localhost:8080). Running with mock data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    if (isDemoMode) {
      setProducts(prev => prev.filter(p => p.id !== id));
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/deleteProduct/${id}`, { method: 'GET' });
      if (response.ok) fetchProducts();
      else throw new Error('Failed to delete');
    } catch (err) {
      alert('Error deleting product.');
      console.error(err);
    }
  };

  const handleSaveProduct = async (productData) => {
    setLoading(true);
    if (isDemoMode) {
      setTimeout(() => {
        if (productData.id) {
          setProducts(prev => prev.map(p => p.id === productData.id ? productData : p));
        } else {
          const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
          setProducts(prev => [...prev, { ...productData, id: newId }]);
        }
        setCurrentView('products');
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const isEditing = !!productData.id;
      const endpoint = isEditing ? `${API_BASE_URL}/editProduct/${productData.id}` : `${API_BASE_URL}/saveProduct`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to save product');
      await fetchProducts();
      setCurrentView('products');
    } catch (err) {
      alert('Error saving product.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.productDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.productStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-[#F9FAFB] dark:bg-[#0E0E11] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-slate-200 dark:border-[#2D2D30] bg-white dark:bg-[#161618] transition-colors duration-300 z-20">
          
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 gap-3">
            <div className="h-6 w-6 rounded-full border-2 border-slate-900 dark:border-white flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-slate-900 dark:bg-white"></div>
            </div>
            <span className="text-lg font-bold tracking-tight">Quantro</span>
          </div>

          {/* Quick Create Button */}
          <div className="px-4 pb-4 mt-2">
            <button 
              onClick={() => { setCurrentProduct(null); setCurrentView('form'); }}
              className="w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm font-medium transition-all bg-slate-100 hover:bg-slate-200 dark:bg-[#2A2A2E] dark:hover:bg-[#36363B] text-slate-900 dark:text-white"
            >
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Quick Create
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400">⌘N</span>
            </button>
          </div>

          {/* Navigation - Cleaned up to only essentials */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
            <NavItem 
              icon={<LayoutDashboard />} 
              label="Dashboard" 
              active={currentView === 'dashboard'} 
              onClick={() => setCurrentView('dashboard')} 
            />
            <NavItem 
              icon={<Box />} 
              label="Products (Orders)" 
              active={currentView === 'products' || currentView === 'form'} 
              onClick={() => setCurrentView('products')} 
            />
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-200 dark:border-[#2D2D30]">
            <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-[#2D2D30] transition-colors">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                R
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-slate-900 dark:text-white truncate">Revanth</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">rpalukur2@gitam.in</span>
              </div>
            </div>
            <div className="mt-2 space-y-1">
               <NavItem icon={<Settings size={18}/>} label="Settings" active={false} onClick={() => {}} />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          
          {/* Top Header */}
          <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-[#2D2D30] bg-[#F9FAFB] dark:bg-[#0E0E11] z-10 transition-colors duration-300">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
               <LayoutDashboard className="h-4 w-4" />
               <ChevronRight className="h-4 w-4 opacity-50" />
               <span className="hover:text-indigo-500 cursor-pointer" onClick={() => setCurrentView('dashboard')}>Dashboard</span>
               <ChevronRight className="h-4 w-4 opacity-50" />
               <span className="text-slate-900 dark:text-white">
                 {currentView === 'dashboard' ? 'Overview' : currentView === 'products' ? 'Products' : 'Edit Product'}
               </span>
            </div>
            
            {/* 3. Add type="button" to prevent accidental page reloads */}
            <button 
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg border border-slate-200 dark:border-[#2D2D30] hover:bg-slate-50 dark:hover:bg-[#2D2D30] transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-slate-300" /> : <Moon className="h-4 w-4 text-slate-600" />}
            </button>
          </header>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              
              {/* Error / Demo Mode Alert */}
              {error && (
                <div className={`rounded-lg p-4 flex items-start gap-3 border ${
                  isDemoMode 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                }`}>
                  {isDemoMode ? <Info className="h-5 w-5 mt-0.5" /> : <ServerCrash className="h-5 w-5 mt-0.5" />}
                  <div>
                    <h3 className="text-sm font-bold">{isDemoMode ? 'Preview Mode Active' : 'Connection Error'}</h3>
                    <p className="text-sm mt-1 opacity-90">{error}</p>
                  </div>
                </div>
              )}

              {/* Views */}
              {currentView === 'dashboard' && (
                <DashboardView products={products} loading={loading} />
              )}

              {currentView === 'products' && (
                <ProductsTableView 
                  products={filteredProducts} 
                  loading={loading}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  onAdd={() => { setCurrentProduct(null); setCurrentView('form'); }}
                  onEdit={(p) => { setCurrentProduct(p); setCurrentView('form'); }}
                  onDelete={handleDelete}
                />
              )}

              {currentView === 'form' && (
                <ProductForm 
                  initialData={currentProduct} 
                  onSave={handleSaveProduct} 
                  onCancel={() => setCurrentView('products')}
                  loading={loading}
                />
              )}

            </div>
          </div>
        </main>
      </div>
  );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-slate-200 dark:bg-[#2D2D30] text-slate-900 dark:text-white' 
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#2D2D30]'
      }`}
    >
      {React.cloneElement(icon, { className: 'h-4 w-4' })}
      {label}
    </button>
  );
}

// DASHBOARD (Graph Removed)
function DashboardView({ products, loading }) {
  const totalProducts = products.length;
  const availableCount = products.filter(p => p.productStatus === 'Available' || p.productStatus === 'Active').length;
  const notAvailableCount = totalProducts - availableCount;
  const totalValue = products.reduce((sum, p) => sum + (Number(p.productPrice) || 0), 0);

  if (loading && totalProducts === 0) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Value" value={`$${totalValue.toLocaleString()}`} trend="+12.5%" trendLabel="Trending up this month" positive={true} subtitle="Estimated gross value" />
        <MetricCard title="Available Stock" value={availableCount} trend="-2%" trendLabel="Down 2% this period" positive={false} subtitle="Needs restocking soon" />
        <MetricCard title="Out of Stock" value={notAvailableCount} trend="+1.2%" trendLabel="Slight increase" positive={false} subtitle="Action required" />
        <MetricCard title="Total Catalog" value={totalProducts} trend="+4.5%" trendLabel="Steady performance" positive={true} subtitle="Meets growth projections" />
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, trendLabel, positive, subtitle }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-[#2D2D30] bg-white dark:bg-[#1C1C1F] hover:border-slate-500/30 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {trend}
        </span>
      </div>
      <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">{value}</div>
      <div className="text-xs font-medium text-slate-900 dark:text-white">{trendLabel}</div>
      <div className="text-xs mt-1 text-slate-500 dark:text-slate-400">{subtitle}</div>
    </div>
  );
}

// PRODUCTS TABLE (Edit & Delete Always Visible)
function ProductsTableView({ products, loading, searchQuery, setSearchQuery, statusFilter, setStatusFilter, onAdd, onEdit, onDelete }) {
  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Products Library</h1>
        <button 
          onClick={onAdd}
          className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm transition-colors bg-[#0F172A] text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for product..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-[#2D2D30] bg-white dark:bg-[#161618] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
          />
        </div>
        <div className="w-full sm:w-48">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#2D2D30] bg-white dark:bg-[#161618] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm appearance-none"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-slate-200 dark:border-[#2D2D30] bg-white dark:bg-[#1C1C1F] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#2D2D30] bg-black/5 dark:bg-white/5">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 w-10">
                  <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600 bg-transparent" />
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">Product Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 'No products found.'}
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-[#2D2D30] transition-colors">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600 bg-transparent" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm text-slate-900 dark:text-white">{product.productName}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ID: PRD-{product.id.toString().padStart(4, '0')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">{product.productDescription || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={product.productStatus} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">${Number(product.productPrice).toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       {/* Edit & Delete explicitly visible here */}
                       <div className="flex items-center justify-end gap-4">
                         <button onClick={() => onEdit(product)} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 transition-colors">
                           <Edit3 className="h-4 w-4" /> Edit
                         </button>
                         <button onClick={() => onDelete(product.id)} className="text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-500 flex items-center gap-1 transition-colors">
                           <Trash2 className="h-4 w-4" /> Delete
                         </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// PRODUCT FORM
function ProductForm({ initialData, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    productName: initialData?.productName || '',
    productPrice: initialData?.productPrice || '',
    productDescription: initialData?.productDescription || '',
    productStatus: initialData?.productStatus || 'Available'
  });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, productPrice: parseFloat(formData.productPrice) });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-[#2D2D30] bg-white dark:bg-[#1C1C1F]">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {initialData ? 'Edit Product Details' : 'Create New Product'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Product Name</label>
            <input
              type="text" name="productName" required value={formData.productName} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#2D2D30] bg-white dark:bg-[#161618] text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Price ($)</label>
              <input
                type="number" name="productPrice" required step="0.01" min="0" value={formData.productPrice} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#2D2D30] bg-white dark:bg-[#161618] text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Status</label>
              <select
                name="productStatus" value={formData.productStatus} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#2D2D30] bg-white dark:bg-[#161618] text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Description</label>
            <textarea
              name="productDescription" rows={4} required value={formData.productDescription} onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-[#2D2D30] bg-white dark:bg-[#161618] text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-[#2D2D30]">
            <button type="button" onClick={onCancel} disabled={loading} className="px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#2D2D30] text-slate-900 dark:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 bg-[#0F172A] text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-colors">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {initialData ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const isAvailable = status === 'Available' || status === 'Active';
  
  if (isAvailable) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400">
        <CheckCircle2 className="h-3 w-3" /> Available
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400">
      <XCircle className="h-3 w-3" /> Not Available
    </span>
  );
}