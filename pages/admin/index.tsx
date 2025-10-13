import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LayoutDashboard, Package, ShoppingBag, Users, Plus, Upload, Settings, X } from 'lucide-react';
import { getSession } from 'next-auth/react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    nameFa: '',
    description: '',
    descriptionFa: '',
    price: '',
    category: '',
    stock: '',
    image: '',
    featured: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats, products, and users
        const [statsRes, productsRes, usersRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/products'),
          fetch('/api/admin/users')
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }
        
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const sidebarNav = [
    { id: 'dashboard', name: 'داشبورد', icon: LayoutDashboard },
    { id: 'products', name: 'محصولات', icon: Package },
    { id: 'orders', name: 'سفارشات', icon: ShoppingBag },
    { id: 'customers', name: 'مشتریان', icon: Users },
    { id: 'settings', name: 'تنظیمات', icon: Settings },
  ];

  const handleAddProduct = async () => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProduct.name,
          nameFa: newProduct.nameFa,
          description: newProduct.description,
          descriptionFa: newProduct.descriptionFa,
          price: parseFloat(newProduct.price),
          category: newProduct.category,
          stock: parseInt(newProduct.stock),
          image: newProduct.image,
          featured: newProduct.featured
        }),
      });

      if (response.ok) {
        alert('محصول با موفقیت اضافه شد!');
        setShowAddProductModal(false);
        setNewProduct({
          name: '',
          nameFa: '',
          description: '',
          descriptionFa: '',
          price: '',
          category: '',
          stock: '',
          image: '',
          featured: false
        });
        // Refresh products list
        const productsResponse = await fetch('/api/admin/products');
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
        }
      } else {
        const error = await response.json();
        alert(`خطا در اضافه کردن محصول: ${error.message}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('خطا در اضافه کردن محصول');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">داشبورد مدیریت</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-gray-500 text-sm">کل محصولات</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-gray-500 text-sm">کل مشتریان</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100">
                    <ShoppingBag className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-gray-500 text-sm">کل سفارشات</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <LayoutDashboard className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-gray-500 text-sm">کل فروش</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : 0} تومان
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900">مدیریت محصولات</h1>
              <button 
                onClick={() => setShowAddProductModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 ml-2" />
                افزودن محصول
              </button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تصویر</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">قیمت</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">دسته‌بندی</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">موجودی</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ویژه</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.nameFa || product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.nameFa || product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.price ? product.price.toLocaleString() : 0} تومان
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category || 'نامشخص'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            (product.stock || 0) > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.featured ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              ویژه
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              عادی
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Product Modal */}
            {showAddProductModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">افزودن محصول جدید</h2>
                    <button
                      onClick={() => setShowAddProductModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نام محصول (انگلیسی)
                      </label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Product Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نام محصول (فارسی)
                      </label>
                      <input
                        type="text"
                        value={newProduct.nameFa}
                        onChange={(e) => setNewProduct({...newProduct, nameFa: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="نام محصول"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        قیمت (تومان)
                      </label>
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        دسته‌بندی
                      </label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">انتخاب دسته‌بندی</option>
                        <option value="coffee">قهوه</option>
                        <option value="tea">چای</option>
                        <option value="dessert">دسر</option>
                        <option value="snack">تنقلات</option>
                        <option value="beverage">نوشیدنی</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        موجودی
                      </label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        آدرس تصویر
                      </label>
                      <input
                        type="url"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        توضیحات (فارسی)
                      </label>
                      <textarea
                        value={newProduct.descriptionFa}
                        onChange={(e) => setNewProduct({...newProduct, descriptionFa: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={3}
                        placeholder="توضیحات محصول"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProduct.featured}
                          onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                          className="ml-2"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          محصول ویژه (نمایش در صفحه اصلی)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => setShowAddProductModal(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      انصراف
                    </button>
                    <button
                      onClick={handleAddProduct}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      افزودن محصول
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'customers':
        return (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">مدیریت مشتریان</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">لیست مشتریان</h2>
                <div className="text-sm text-gray-600">
                  مجموع: {stats?.totalUsers || 0} مشتری
                </div>
              </div>
              
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">هیچ مشتری ثبت‌نام نکرده است</p>
                  <p className="text-gray-400 text-sm mt-2">مشتریان پس از ثبت‌نام در اینجا نمایش داده می‌شوند</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          نام
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ایمیل
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          تلفن
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          نقش
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          تاریخ ثبت‌نام
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          وضعیت
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name || 'بدون نام'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email || 'بدون ایمیل'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.phone || 'بدون تلفن'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'ADMIN' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role === 'ADMIN' ? 'مدیر' : 'کاربر'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.emailVerified || user.phoneVerified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.emailVerified || user.phoneVerified ? 'تأیید شده' : 'در انتظار تأیید'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">مدیریت سفارشات و پرداخت‌ها</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">آمار فروش</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">کل فروش:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : 0} تومان
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">تعداد سفارشات:</span>
                    <span className="text-xl font-semibold text-blue-600">
                      {stats?.totalOrders || 0} سفارش
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">میانگین سفارش:</span>
                    <span className="text-lg font-medium text-purple-600">
                      {stats?.totalOrders && stats?.totalRevenue 
                        ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() 
                        : 0} تومان
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">وضعیت پرداخت‌ها</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">پرداخت‌های موفق:</span>
                    <span className="text-lg font-semibold text-green-600">
                      {stats?.totalOrders || 0} پرداخت
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">در انتظار پرداخت:</span>
                    <span className="text-lg font-semibold text-yellow-600">0 پرداخت</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">پرداخت‌های ناموفق:</span>
                    <span className="text-lg font-semibold text-red-600">0 پرداخت</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">لیست سفارشات</h2>
              
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">هیچ سفارشی ثبت نشده است</p>
                <p className="text-gray-400 text-sm mt-2">سفارشات پس از تکمیل خرید در اینجا نمایش داده می‌شوند</p>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">تنظیمات سایت</h1>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">مدیریت لوگو</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    آپلود لوگو جدید
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    <button
                      onClick={() => {
                        if (logoUrl) {
                          localStorage.setItem('siteLogo', logoUrl);
                          alert('لوگو با موفقیت ذخیره شد!');
                        }
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      ذخیره لوگو
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    پیش‌نمایش لوگو فعلی
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Logo Preview"
                        className="max-h-20 object-contain"
                        onError={() => alert('خطا در بارگذاری تصویر')}
                      />
                    ) : (
                      <p className="text-gray-500">هیچ لوگویی انتخاب نشده است</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">راهنمای استفاده:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• آدرس تصویر را در فیلد بالا وارد کنید</li>
                    <li>• تصویر باید در فرمت PNG یا JPG باشد</li>
                    <li>• اندازه توصیه شده: 200x60 پیکسل</li>
                    <li>• پس از ذخیره، صفحه را رفرش کنید</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">صفحه در حال توسعه</h1>
            <p className="text-gray-600">این بخش به زودی اضافه خواهد شد.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">پنل مدیریت</h2>
          </div>
          <nav className="mt-6">
            {sidebarNav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-right text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 ml-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'fa', ['common'])),
    },
  };
};

export default AdminPanel;