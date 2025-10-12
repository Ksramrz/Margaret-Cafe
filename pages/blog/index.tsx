import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowRight, Search, Filter } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: number;
  category: string;
  image: string;
  slug: string;
  language: 'en' | 'fa';
}

const BlogPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'هنر دم کردن چای ایرانی',
      excerpt: 'روش‌ها و اسرار سنتی پشت دم کردن کامل چای ایرانی را کشف کنید که از نسل‌ها به ارث رسیده است.',
      author: 'تیم کافه مارگارت',
      publishedAt: '۱۴۰۲-۱۰-۲۵',
      readTime: 5,
      category: 'tea',
      image: '/images/blog/persian-tea.jpg',
      slug: 'persian-tea-brewing',
      language: 'fa',
    },
    {
      id: '2',
      title: 'فرهنگ قهوه در سراسر جهان',
      excerpt: 'کشف کنید که چگونه فرهنگ‌های مختلف از قهوه خود لذت می‌برند و چه چیزی هر سنت را منحصر به فرد و خاص می‌کند.',
      author: 'سارا جانسون',
      publishedAt: '۱۴۰۲-۱۰-۲۰',
      readTime: 7,
      category: 'coffee',
      image: '/images/blog/coffee-culture.jpg',
      slug: 'coffee-culture-world',
      language: 'fa',
    },
    {
      id: '3',
      title: 'دستورهای قهوه خانگی',
      excerpt: 'یاد بگیرید که چگونه قهوه‌های حرفه‌ای را در خانه خود درست کنید و مهارت‌های بارستا خود را بهبود بخشید.',
      author: 'مارگارت جانسون',
      publishedAt: '۱۴۰۲-۱۰-۱۵',
      readTime: 6,
      category: 'recipes',
      image: '/images/blog/home-coffee.jpg',
      slug: 'home-coffee-recipes',
      language: 'fa',
    },
    {
      id: '4',
      title: 'تاریخچه چای ایرانی',
      excerpt: 'سفر تاریخی چای در ایران و تأثیر آن بر فرهنگ و زندگی روزمره ایرانیان.',
      author: 'احمد رضایی',
      publishedAt: '۱۴۰۲-۱۰-۱۰',
      readTime: 8,
      category: 'culture',
      image: '/images/blog/iranian-tea-history.jpg',
      slug: 'iranian-tea-history',
      language: 'fa',
    },
    {
      id: '5',
      title: 'سبک زندگی کافه',
      excerpt: 'چگونه کافه‌ها به مراکز اجتماعی تبدیل شده‌اند و نقش آن‌ها در زندگی مدرن.',
      author: 'سارا چن',
      publishedAt: '۱۴۰۲-۱۰-۰۵',
      readTime: 4,
      category: 'lifestyle',
      image: '/images/blog/cafe-lifestyle.jpg',
      slug: 'cafe-lifestyle',
      language: 'fa',
    },
    {
      id: '6',
      title: 'تکنیک‌های پیشرفته لته آرت',
      excerpt: 'مراحل پیشرفته هنر لته آرت و تکنیک‌های حرفه‌ای برای ایجاد آثار هنری با قهوه.',
      author: 'مارگارت جانسون',
      publishedAt: '۱۴۰۲-۰۹-۳۰',
      readTime: 10,
      category: 'coffee',
      image: '/images/blog/latte-art.jpg',
      slug: 'advanced-latte-art',
      language: 'fa',
    },
  ];

  const categories = [
    { id: 'all', name: 'همه' },
    { id: 'coffee', name: 'قهوه' },
    { id: 'tea', name: 'چای' },
    { id: 'recipes', name: 'دستورها' },
    { id: 'culture', name: 'فرهنگ' },
    { id: 'lifestyle', name: 'سبک زندگی' },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-cafe-cream">
      {/* Hero Section */}
      <section className="bg-cafe-green text-white section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              وبلاگ و آکادمی
            </h1>
            <p className="text-xl text-green-200 max-w-3xl mx-auto">
              هنر قهوه، چای و فرهنگ کافه را کشف کنید
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="جستجو در مقالات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cafe-green focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-cafe-green text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="section-padding bg-cafe-light">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.publishedAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime} دقیقه مطالعه</span>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-cafe-green hover:text-green-700 font-medium"
                      >
                        <span>ادامه مطلب</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">هیچ مقاله‌ای یافت نشد.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-cafe-green text-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">عضویت در خبرنامه</h2>
              <p className="text-green-200 mb-8">
                آخرین مقالات و اخبار کافه مارگارت را دریافت کنید
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="ایمیل خود را وارد کنید"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="bg-white text-cafe-green px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  عضویت
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
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

export default BlogPage;