import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Package, Filter, X, Coffee, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  type: string;
  image: string;
  stock: number;
  featured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ShopPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { state: cart, addItem } = useCart();
  const [addedProductName, setAddedProductName] = useState<string>('');
  const [showAddedModal, setShowAddedModal] = useState<boolean>(false);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { id: 'all', name: 'همه محصولات', icon: '☕' },
    { id: 'coffee', name: 'قهوه', icon: '☕' },
    { id: 'tea', name: 'چای', icon: '🫖' },
    { id: 'dessert', name: 'دسر', icon: '🍰' },
    { id: 'snack', name: 'تنقلات', icon: '🥜' },
    { id: 'beverage', name: 'نوشیدنی', icon: '🥤' },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    // Show quick confirmation modal
    setAddedProductName(product.name);
    setShowAddedModal(true);
    // Auto-hide after 3s
    setTimeout(() => setShowAddedModal(false), 3000);
  };

  return (
    <div className="min-h-screen cafe-bg-gradient">
      {/* Header */}
      <section className="bg-gradient-to-br from-cafe-green via-cafe-green-light to-cafe-green-dark text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 cafe-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full mb-6">
              <Coffee className="w-5 h-5" />
              <span className="font-medium">فروشگاه کافه مارگارت</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 cafe-text-shadow">
              فروشگاه ما
            </h1>
            <p className="text-xl lg:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              بهترین محصولات قهوه و چای ایرانی و جهانی را از ما بخرید
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-[73px] z-40 shadow-md">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-cafe-green to-cafe-green-light text-white shadow-cafe-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-cafe-cream border-2 border-gray-200 hover:border-cafe-green/30 shadow-md hover:shadow-lg'
                }`}
              >
                <span className="ml-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-padding bg-cafe-light cafe-pattern">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cafe-green border-t-transparent mb-6"></div>
                <p className="text-xl text-gray-600 font-medium">در حال بارگذاری محصولات...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl shadow-cafe-lg">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  محصولی یافت نشد
                </h3>
                <p className="text-gray-600 text-lg">
                  در این دسته‌بندی محصولی موجود نیست
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="bg-white rounded-3xl overflow-hidden shadow-cafe hover:shadow-cafe-xl transition-all duration-300 h-full flex flex-col transform hover:scale-[1.02]">
                      <div className="relative overflow-hidden">
                        <div className="aspect-w-16 aspect-h-12 h-56 bg-cafe-cream">
                          <img
                            src={product.image || '/images/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder-product.jpg';
                            }}
                          />
                        </div>
                        
                        {product.featured && (
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-cafe-lg flex items-center gap-1">
                            <Sparkles className="w-4 h-4" />
                            ویژه
                          </div>
                        )}
                        
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl font-bold text-red-600">
                              ناموجود
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < 4 ? 'text-amber-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">(4.5)</span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-cafe-green transition-colors">
                          {product.name}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                          {product.description}
                        </p>

                        <div className="mt-auto">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-2xl font-bold text-gradient-amber">
                              {product.price.toLocaleString()} تومان
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 ${
                              product.stock === 0
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cafe-green to-cafe-green-light hover:from-cafe-green-light hover:to-cafe-green text-white shadow-cafe hover:shadow-cafe-lg transform hover:scale-105'
                            }`}
                          >
                            {product.stock === 0 ? (
                              'ناموجود'
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                <ShoppingCart className="w-5 h-5" />
                                افزودن به سبد
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Added to Cart Modal / Toast */}
      {showAddedModal && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <div className="bg-white shadow-cafe-xl border-2 border-cafe-green/20 rounded-2xl px-6 py-5 flex items-center gap-4 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cafe-green to-cafe-green-light text-white flex items-center justify-center flex-shrink-0 animate-bounce-slow">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900 text-lg">به سبد اضافه شد!</div>
              <div className="text-sm text-gray-600">{addedProductName}</div>
            </div>
            <Link
              href="/checkout"
              className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              پرداخت
            </Link>
            <button
              onClick={() => setShowAddedModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'fa', ['common'])),
    },
  };
};

export default ShopPage;
