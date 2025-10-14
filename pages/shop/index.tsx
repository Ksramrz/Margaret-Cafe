import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Package, Filter, X, Minus, Plus } from 'lucide-react';
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
    { id: 'all', name: 'همه محصولات' },
    { id: 'coffee', name: 'قهوه' },
    { id: 'tea', name: 'چای' },
    { id: 'dessert', name: 'دسر' },
    { id: 'snack', name: 'تنقلات' },
    { id: 'beverage', name: 'نوشیدنی' },
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
    // Auto-hide after 2.5s
    setTimeout(() => setShowAddedModal(false), 2500);
  };

  return (
    <div className="min-h-screen bg-cafe-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-cafe-green to-green-600 text-white py-16">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              فروشگاه کافه مارگارت
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              بهترین محصولات قهوه و چای ایرانی و جهانی را از ما بخرید
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-cafe-green text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-padding bg-cafe-light">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cafe-green mx-auto mb-4"></div>
                <p className="text-gray-600">در حال بارگذاری محصولات...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  محصولی یافت نشد
                </h3>
                <p className="text-gray-600">
                  در این دسته‌بندی محصولی موجود نیست
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="relative">
                      <div className="aspect-w-16 aspect-h-12 h-48">
                        <img
                          src={product.image || '/images/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder-product.jpg';
                          }}
                        />
                      </div>
                      
                      {product.featured && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          ویژه
                        </div>
                      )}
                      
                      {product.stock === 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          ناموجود
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">(4.5)</span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {product.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xl font-bold text-cafe-green">
                          {product.price.toLocaleString()} تومان
                        </div>
                        <div className="text-sm text-gray-500">
                          موجودی: {product.stock}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`w-full py-3 rounded-lg font-medium transition-colors ${
                          product.stock === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-cafe-green hover:bg-green-700 text-white'
                        }`}
                      >
                        {product.stock === 0 ? 'ناموجود' : 'افزودن به سبد خرید'}
                      </button>
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white shadow-2xl border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-cafe-green text-white flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">به سبد اضافه شد</div>
              <div className="text-sm text-gray-600">{addedProductName}</div>
            </div>
            <Link
              href="/checkout"
              className="ml-2 bg-cafe-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              ادامه پرداخت
            </Link>
            <button
              onClick={() => setShowAddedModal(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
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