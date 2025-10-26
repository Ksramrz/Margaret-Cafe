import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Coffee, Flame, Award, History, Sparkles, TrendingUp } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-cafe-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cafe-green mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="min-h-screen flex items-center justify-center">خطا در بارگذاری داده‌ها</div>;
  }

  const { coins, streak, longestStreak, level, points, canClaimToday, transactions, badges, achievements } = stats;

  return (
    <div className="min-h-screen bg-cafe-cream py-8">
      <div className="container-custom max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            خوش برگشتید! {session?.user?.name || 'کاربر'} ☕
          </h1>
          <p className="text-lg text-gray-600">
            امروز هم یک روز عالی برای یه فنجان قهوه عالی‌ست!
          </p>
        </div>

        {/* Daily Reward Card */}
        {canClaimToday && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-8 mb-8 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <Sparkles className="w-8 h-8 ml-3" />
                  <h2 className="text-3xl font-bold">فنجان روزانه رایگان</h2>
                </div>
                <p className="text-amber-50 mb-6 text-lg">
                  هر روز بباید کنید و فنجان رایگان بگیرید! 
                  {streak > 0 && (
                    <span className="block mt-2 font-bold">
                      🔥 استریک {streak} روزه شما ادامه دارد!
                    </span>
                  )}
                </p>
                <button
                  onClick={handleClaimReward}
                  disabled={claiming}
                  className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-50 transition-all shadow-lg hover:scale-105 disabled:opacity-50"
                >
                  {claiming ? 'در حال دریافت...' : '☕ فنجان امروز رو بگیر'}
                </button>
              </div>
              <div className="hidden md:block text-right">
                <div className="text-7xl font-black opacity-20">{streak || '?'}</div>
                <div className="text-xl mt-2">روز متوالی</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl mb-2">☕</div>
            <div className="text-2xl font-bold text-gray-900">{coins}</div>
            <div className="text-sm text-gray-500">فنجان</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-gray-900">{streak}</div>
            <div className="text-sm text-gray-500">روز متوالی</div>
            {longestStreak > streak && (
              <div className="text-xs text-gray-400 mt-1">رکورد: {longestStreak}</div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-gray-900">{level}</div>
            <div className="text-sm text-gray-500">سطح شما</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-gray-900">{badges.length}</div>
            <div className="text-sm text-gray-500">نشان</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <History className="w-5 h-5 ml-2" />
              فعالیت‌های اخیر
            </h3>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl ml-3">{tx.type === 'EARNED' ? '☕' : '💸'}</span>
                    <div>
                      <div className="font-medium">{tx.description}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString('fa-IR')}
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold ${tx.type === 'EARNED' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'EARNED' ? '+' : '-'}{tx.amount}
                  </div>
                </div>
              ))}
            </div>
            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                هنوز فعالیتی ندارید
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Award className="w-5 h-5 ml-2" />
              نشان‌های من
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {badges.slice(0, 6).map((badge) => (
                <div
                  key={badge.id}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl text-center border border-amber-100"
                >
                  <div className="text-3xl mb-2">{badge.icon || '🏅'}</div>
                  <div className="text-xs font-medium text-gray-700 line-clamp-1">
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>
            {badges.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                هنوز نشانی نداشته‌اید
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="/shop"
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold mb-2">فروشگاه</div>
                <div className="text-green-100">خرید با فنجان‌ها</div>
              </div>
              <Coffee className="w-12 h-12 opacity-20 group-hover:scale-110 transition-transform" />
            </div>
          </a>

          <a
            href="/courses"
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold mb-2">آموزش‌ها</div>
                <div className="text-blue-100">یاد بگیرید و فنجان بگیرید</div>
              </div>
              <TrendingUp className="w-12 h-12 opacity-20 group-hover:scale-110 transition-transform" />
            </div>
          </a>

          <a
            href="/user/rewards"
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold mb-2">جوایز</div>
                <div className="text-purple-100">فنجان‌های خود را خرج کنید</div>
              </div>
              <Sparkles className="w-12 h-12 opacity-20 group-hover:scale-110 transition-transform" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
