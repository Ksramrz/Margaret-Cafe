import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { Users, Music, Coffee, Crown, Play, Heart, Share2, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface Playlist {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  duration: string;
  tracks: number;
  isPremium: boolean;
}

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isPremium: boolean;
}

const CommunityPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState('feed');

  // Mock playlists data
  const playlists: Playlist[] = [
    {
      id: '1',
      title: 'حال و هوای قهوه صبحگاهی',
      description: 'موسیقی مناسب برای مراسم قهوه صبحگاهی شما',
      coverImage: '/images/playlists/morning-coffee.jpg',
      duration: '۲ ساعت ۱۵ دقیقه',
      tracks: 28,
      isPremium: false,
    },
    {
      id: '2',
      title: 'فضای کافه ایرانی',
      description: 'موسیقی سنتی ایرانی برای فضای اصیل کافه',
      coverImage: '/images/playlists/persian-cafe.jpg',
      duration: '۱ ساعت ۴۵ دقیقه',
      tracks: 22,
      isPremium: true,
    },
    {
      id: '3',
      title: 'آرامش چای عصر',
      description: 'ملودی‌های آرام برای لحظات آرامش با چای',
      coverImage: '/images/playlists/tea-time.jpg',
      duration: '۱ ساعت ۳۰ دقیقه',
      tracks: 18,
      isPremium: false,
    },
  ];

  // Mock community posts data
  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      author: 'سارا احمدی',
      avatar: '/images/avatars/sara.jpg',
      content: 'امروز اولین لته آرت خودم را درست کردم! خیلی هیجان‌زده‌ام 🎨☕',
      image: '/images/posts/latte-art.jpg',
      likes: 24,
      comments: 8,
      timestamp: '۲ ساعت پیش',
      isPremium: false,
    },
    {
      id: '2',
      author: 'احمد رضایی',
      avatar: '/images/avatars/ahmad.jpg',
      content: 'نکته امروز: برای دم کردن چای ایرانی، آب باید کاملاً جوش بیاید و سپس کمی خنک شود. این کار طعم بهتری به چای می‌دهد.',
      likes: 18,
      comments: 12,
      timestamp: '۴ ساعت پیش',
      isPremium: true,
    },
    {
      id: '3',
      author: 'مریم کریمی',
      avatar: '/images/avatars/maryam.jpg',
      content: 'کافه مارگارت بهترین قهوه شهر را دارد! محیط فوق‌العاده آرام و کارکنان بسیار دوستانه. حتماً امتحان کنید!',
      likes: 31,
      comments: 15,
      timestamp: '۶ ساعت پیش',
      isPremium: false,
    },
    {
      id: '4',
      author: 'علی محمدی',
      avatar: '/images/avatars/ali.jpg',
      content: 'دوره بارستا مارگارت جانسون واقعاً عالی بود! حالا می‌تونم قهوه‌های حرفه‌ای درست کنم. ممنون از تیم کافه مارگارت!',
      likes: 42,
      comments: 23,
      timestamp: '۱ روز پیش',
      isPremium: true,
    },
  ];

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
              مرکز انجمن
            </h1>
            <p className="text-xl text-green-200 max-w-3xl mx-auto">
              با علاقه‌مندان کافه ارتباط برقرار کنید، بیاموزید و رشد کنید
            </p>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab('feed')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'feed'
                    ? 'bg-cafe-green text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                فید انجمن
              </button>
              <button
                onClick={() => setActiveTab('playlists')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'playlists'
                    ? 'bg-cafe-green text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                پلی‌لیست‌های موسیقی
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding bg-cafe-light">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'feed' && (
              <div className="space-y-6">
                {communityPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="card"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{post.author}</h3>
                          {post.isPremium && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                          <span className="text-sm text-gray-500">{post.timestamp}</span>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{post.content}</p>
                        
                        {post.image && (
                          <div className="mb-4">
                            <img
                              src={post.image}
                              alt="Post content"
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-6">
                          <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                            <Heart className="w-5 h-5" />
                            <span>{post.likes}</span>
                          </button>
                          
                          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                            <MessageCircle className="w-5 h-5" />
                            <span>{post.comments}</span>
                          </button>
                          
                          <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
                            <Share2 className="w-5 h-5" />
                            <span>اشتراک</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'playlists' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists.map((playlist, index) => (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="card overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={playlist.coverImage}
                        alt={playlist.title}
                        className="w-full h-48 object-cover"
                      />
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                      </div>
                      
                      {playlist.isPremium && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          پریمیوم
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {playlist.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        {playlist.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Music className="w-4 h-4" />
                          <span>{playlist.tracks} آهنگ</span>
                        </div>
                        <span>{playlist.duration}</span>
                      </div>
                      
                      <button className="w-full bg-cafe-green text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        <span>پخش</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="section-padding bg-cafe-green text-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">به انجمن ما بپیوندید</h2>
              <p className="text-green-200 mb-8">
                با هزاران علاقه‌مند قهوه و چای در سراسر جهان ارتباط برقرار کنید
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-cafe-green px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  عضویت رایگان
                </button>
                <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-cafe-green transition-colors">
                  عضویت پریمیوم
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

export default CommunityPage;