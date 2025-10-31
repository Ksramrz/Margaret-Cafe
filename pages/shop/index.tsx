import React, { useState, useEffect, useRef } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { ShoppingCart, Star, Package, X, Coffee } from 'lucide-react';
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

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    setAddedProductName(product.name);
    setShowAddedModal(true);
    setTimeout(() => setShowAddedModal(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-cafe-green text-white py-20">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-5 py-2 rounded-full mb-6">
              <Coffee className="w-5 h-5" />
              <span className="font-semibold">فروشگاه کافه مارگارت</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              فروشگاه ما
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              بهترین محصولات قهوه و چای ایرانی و جهانی را از ما بخرید
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-gray-50 border-b border-gray-200 sticky top-[73px] z-40">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-cafe-green text-white shadow-md'
                    : 'bg-white text-cafe-charcoal hover:bg-gray-100 border border-gray-300 hover:border-cafe-green'
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
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cafe-green border-t-transparent mb-6"></div>
                <p className="text-xl text-cafe-charcoal-light font-medium">در حال بارگذاری محصولات...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-cafe-charcoal mb-3">
                  محصولی یافت نشد
                </h3>
                <p className="text-cafe-charcoal-light text-lg">
                  در این دسته‌بندی محصولی موجود نیست
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="card-hover group"
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={product.image || '/images/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder-product.jpg';
                        }}
                      />
                      
                      {product.featured && (
                        <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
                          ⭐ ویژه
                        </div>
                      )}
                      
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="bg-white px-6 py-3 rounded-lg font-bold text-red-600">
                            ناموجود
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
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
                        <span className="text-sm text-cafe-charcoal-light">(4.5)</span>
                      </div>

                      <h3 className="text-lg font-bold text-cafe-charcoal mb-2 group-hover:text-cafe-green transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-cafe-charcoal-light text-sm mb-4 line-clamp-2 flex-1">
                        {product.description}
                      </p>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-2xl font-bold text-cafe-green">
                            {product.price.toLocaleString()} تومان
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                            product.stock === 0
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-cafe-green hover:bg-cafe-green-dark text-white shadow-md hover:shadow-lg'
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
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Added to Cart Modal */}
      {showAddedModal && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-white shadow-xl border border-gray-200 rounded-xl px-6 py-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-cafe-green text-white flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-cafe-charcoal text-lg">به سبد اضافه شد!</div>
              <div className="text-sm text-cafe-charcoal-light">{addedProductName}</div>
            </div>
            <Link
              href="/checkout"
              className="ml-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all"
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
