import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Coffee, Flame, Award, History, Sparkles, TrendingUp, Gift, BookOpen, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface UserStats {
  coins: number;
  streak: number;
  longestStreak: number;
  level: number;
  points: number;
  canClaimToday: boolean;
  lastLoginReward: string | null;
  transactions: any[];
  badges: any[];
  achievements: any[];
}

const UserDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/coins');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async () => {
    setClaiming(true);
    try {
      const response = await fetch('/api/user/claim-daily-reward', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        await fetchStats();
        alert(`✅ بازدید روزانه! ${data.coinsEarned} فنجان دریافت کردید!`);
      } else {
        const error = await response.json();
        alert(error.error || 'خطا در دریافت پاداش');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('خطا در دریافت پاداش');
    } finally {
      setClaiming(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center cafe-bg-gradient">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cafe-green border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center cafe-bg-gradient">
        <div className="text-center">
          <p className="text-xl text-gray-600">خطا در بارگذاری داده‌ها</p>
        </div>
      </div>
    );
  }

  const { coins, streak, longestStreak, level, points, canClaimToday, transactions, badges, achievements } = stats;

  // Calculate level progress (0-100)
  const levelProgress = ((points % 1000) / 1000) * 100;
  const nextLevelPoints = 1000 - (points % 1000);

  return (
    <div className="min-h-screen cafe-bg-gradient cafe-pattern py-12">
      <div className="container-custom max-w-7xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="bg-gradient-to-br from-white to-cafe-cream rounded-3xl p-8 shadow-cafe-lg border-2 border-cafe-green/10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  خوش برگشتید، {session?.user?.name || 'کاربر'}! ☕
                </h1>
                <p className="text-xl text-gray-600">
                  امروز هم یک روز عالی برای یه فنجان قهوه عالی‌ست!
                </p>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-5xl animate-float">
                ☕
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Reward Card */}
        {canClaimToday && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-3xl p-8 text-white shadow-cafe-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Sparkles className="w-7 h-7" />
                      </div>
                      <h2 className="text-3xl lg:text-4xl font-bold">فنجان روزانه رایگان</h2>
                    </div>
                    <p className="text-lg text-amber-50 mb-6 leading-relaxed">
                      هر روز بیاید و فنجان رایگان بگیرید! 
                      {streak > 0 && (
                        <span className="block mt-3 font-bold text-2xl animate-pulse">
                          🔥 استریک {streak} روزه شما ادامه دارد!
                        </span>
                      )}
                    </p>
                    <button
                      onClick={handleClaimReward}
                      disabled={claiming}
                      className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-50 transition-all shadow-2xl hover:scale-105 disabled:opacity-50 transform"
                    >
                      {claiming ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-600 border-t-transparent"></div>
                          در حال دریافت...
                        </span>
                      ) : (
                        '☕ فنجان امروز رو بگیر'
                      )}
                    </button>
                  </div>
                  <div className="hidden md:block text-center">
                    <div className="text-8xl font-black opacity-30">{streak || '?'}</div>
                    <div className="text-xl mt-2 font-semibold">روز متوالی</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="card-hover group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl animate-float" style={{ animationDelay: '0s' }}>☕</div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Coffee className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{coins.toLocaleString()}</div>
            <div className="text-sm text-gray-500 font-medium">فنجان</div>
            <div className="mt-2 text-xs text-cafe-green font-semibold">موجودی شما</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card-hover group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl animate-float" style={{ animationDelay: '0.2s' }}>🔥</div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{streak}</div>
            <div className="text-sm text-gray-500 font-medium">روز متوالی</div>
            {longestStreak > streak && (
              <div className="mt-2 text-xs text-amber-600 font-semibold">رکورد: {longestStreak} روز</div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="card-hover group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl animate-float" style={{ animationDelay: '0.4s' }}>⭐</div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">سطح {level}</div>
            <div className="text-sm text-gray-500 font-medium">سطح شما</div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{nextLevelPoints} امتیاز تا سطح بعد</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="card-hover group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl animate-float" style={{ animationDelay: '0.6s' }}>🏆</div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{badges.length}</div>
            <div className="text-sm text-gray-500 font-medium">نشان</div>
            <div className="mt-2 text-xs text-purple-600 font-semibold">افتخارات شما</div>
          </motion.div>
        </div>

        {/* Recent Activity & Badges */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center ml-3">
                <History className="w-6 h-6 text-white" />
              </div>
              فعالیت‌های اخیر
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {transactions.slice(0, 8).map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-cafe-cream to-white rounded-xl border border-gray-200 hover:border-cafe-green/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      tx.type === 'EARNED' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className="text-2xl">{tx.type === 'EARNED' ? '☕' : '💸'}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{tx.description}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString('fa-IR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold text-lg ${
                    tx.type === 'EARNED' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.type === 'EARNED' ? '+' : '-'}{tx.amount.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
            {transactions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="font-medium">هنوز فعالیتی ندارید</p>
                <p className="text-sm mt-2">با خرید یا یادگیری شروع کنید!</p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center ml-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              نشان‌های من
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {badges.slice(0, 6).map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-5 rounded-2xl text-center border-2 border-amber-200 hover:border-amber-400 transition-all transform hover:scale-105 cursor-pointer"
                >
                  <div className="text-4xl mb-2 animate-float">{badge.icon || '🏅'}</div>
                  <div className="text-xs font-bold text-gray-700 line-clamp-2 leading-tight">
                    {badge.nameFa || badge.name}
                  </div>
                </motion.div>
              ))}
            </div>
            {badges.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="font-medium">هنوز نشانی نداشته‌اید</p>
                <p className="text-sm mt-2">با انجام فعالیت‌ها نشان کسب کنید!</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Link
            href="/shop"
            className="group relative bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 text-white rounded-3xl p-8 shadow-cafe-xl hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold mb-2">فروشگاه</div>
                  <div className="text-emerald-100">خرید با فنجان‌ها</div>
                </div>
                <ShoppingBag className="w-16 h-16 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all" />
              </div>
            </div>
          </Link>

          <Link
            href="/courses"
            className="group relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white rounded-3xl p-8 shadow-cafe-xl hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold mb-2">آموزش‌ها</div>
                  <div className="text-blue-100">یاد بگیرید و فنجان بگیرید</div>
                </div>
                <BookOpen className="w-16 h-16 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all" />
              </div>
            </div>
          </Link>

          <Link
            href="/user/rewards"
            className="group relative bg-gradient-to-br from-purple-500 via-purple-600 to-pink-700 text-white rounded-3xl p-8 shadow-cafe-xl hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold mb-2">جوایز</div>
                  <div className="text-purple-100">فنجان‌های خود را خرج کنید</div>
                </div>
                <Gift className="w-16 h-16 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2d501e;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1f3615;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;

