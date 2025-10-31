import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Coffee, History, ShoppingBag, BookOpen } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cafe-green border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-cafe-charcoal-light font-medium">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-xl text-cafe-charcoal-light">خطا در بارگذاری داده‌ها</p>
        </div>
      </div>
    );
  }

  const { coins, streak, longestStreak, level, canClaimToday, transactions, badges } = stats;
  const levelProgress = ((stats.points % 1000) / 1000) * 100;
  const nextLevelPoints = 1000 - (stats.points % 1000);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container-custom max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-cafe-charcoal mb-2">
                  خوش برگشتید، {session?.user?.name || 'کاربر'}! ☕
                </h1>
                <p className="text-xl text-cafe-charcoal-light">
                  امروز هم یک روز عالی برای یه فنجان قهوه عالی‌ست!
                </p>
              </div>
              <div className="w-20 h-20 bg-cafe-green/10 rounded-full flex items-center justify-center text-5xl">
                ☕
              </div>
            </div>
          </div>
        </div>

        {/* Daily Reward Card */}
        {canClaimToday && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl p-8 text-white shadow-lg">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-4">فنجان روزانه رایگان</h2>
                  <p className="text-lg text-amber-50 mb-6">
                    هر روز بیاید و فنجان رایگان بگیرید! 
                    {streak > 0 && (
                      <span className="block mt-3 font-bold">
                        🔥 استریک {streak} روزه شما ادامه دارد!
                      </span>
                    )}
                  </p>
                  <button
                    onClick={handleClaimReward}
                    disabled={claiming}
                    className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-50 transition-all shadow-lg disabled:opacity-50"
                  >
                    {claiming ? 'در حال دریافت...' : '☕ فنجان امروز رو بگیر'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-4xl mb-3">☕</div>
            <div className="text-3xl font-bold text-cafe-charcoal mb-1">{coins.toLocaleString()}</div>
            <div className="text-sm text-cafe-charcoal-light font-medium">فنجان</div>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-3">🔥</div>
            <div className="text-3xl font-bold text-cafe-charcoal mb-1">{streak}</div>
            <div className="text-sm text-cafe-charcoal-light font-medium">روز متوالی</div>
            {longestStreak > streak && (
              <div className="text-xs text-amber-600 mt-1 font-medium">رکورد: {longestStreak}</div>
            )}
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-3">⭐</div>
            <div className="text-3xl font-bold text-cafe-charcoal mb-1">سطح {level}</div>
            <div className="text-sm text-cafe-charcoal-light font-medium">سطح شما</div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-cafe-green h-2 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-cafe-charcoal-light mt-1">{nextLevelPoints} امتیاز تا سطح بعد</div>
            </div>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-3">🏆</div>
            <div className="text-3xl font-bold text-cafe-charcoal mb-1">{badges.length}</div>
            <div className="text-sm text-cafe-charcoal-light font-medium">نشان</div>
          </div>
        </div>

        {/* Recent Activity & Badges */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <History className="w-6 h-6 text-white" />
              </div>
              فعالیت‌های اخیر
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {transactions.slice(0, 8).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      tx.type === 'EARNED' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className="text-2xl">{tx.type === 'EARNED' ? '☕' : '💸'}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-cafe-charcoal">{tx.description}</div>
                      <div className="text-xs text-cafe-charcoal-light">
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
                </div>
              ))}
            </div>
            {transactions.length === 0 && (
              <div className="text-center py-12 text-cafe-charcoal-light">
                <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="font-medium">هنوز فعالیتی ندارید</p>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              نشان‌های من
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {badges.slice(0, 6).map((badge) => (
                <div
                  key={badge.id}
                  className="bg-gray-50 p-5 rounded-lg text-center border-2 border-gray-200 hover:border-amber-300 transition-all"
                >
                  <div className="text-4xl mb-2">{badge.icon || '🏅'}</div>
                  <div className="text-xs font-bold text-cafe-charcoal line-clamp-2 leading-tight">
                    {badge.nameFa || badge.name}
                  </div>
                </div>
              ))}
            </div>
            {badges.length === 0 && (
              <div className="text-center py-12 text-cafe-charcoal-light">
                <Coffee className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="font-medium">هنوز نشانی نداشته‌اید</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/shop"
            className="group relative bg-cafe-green text-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold mb-2">فروشگاه</div>
                  <div className="text-green-100">خرید محصولات</div>
                </div>
                <ShoppingBag className="w-12 h-12 opacity-20 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            href="/courses"
            className="group relative bg-blue-600 text-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold mb-2">آموزش‌ها</div>
                  <div className="text-blue-100">یادگیری و پیشرفت</div>
                </div>
                <BookOpen className="w-12 h-12 opacity-20 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            href="/user/dashboard"
            className="group relative bg-gray-800 text-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold mb-2">داشبورد</div>
                  <div className="text-gray-300">مشاهده اطلاعات</div>
                </div>
                <Coffee className="w-12 h-12 opacity-20 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
