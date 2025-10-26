import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  Coins, 
  Flame, 
  Trophy, 
  Star, 
  Award, 
  TrendingUp,
  Gift,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';

interface CoinData {
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
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchCoinData();
    }
  }, [status]);

  const fetchCoinData = async () => {
    try {
      const response = await fetch('/api/user/coins');
      if (response.ok) {
        const data = await response.json();
        setCoinData(data);
      }
    } catch (error) {
      console.error('Error fetching coin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDailyReward = async () => {
    setClaiming(true);
    try {
      const response = await fetch('/api/user/claim-daily-reward', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        await fetchCoinData(); // Refresh data
        
        // Show success message
        alert(`بازدید روزانه! شما ${data.coinsEarned} سکه دریافت کردید! 🔥`);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cafe-green"></div>
      </div>
    );
  }

  if (!coinData) {
    return <div className="min-h-screen flex items-center justify-center">خطا در بارگذاری داده‌ها</div>;
  }

  const { 
    coins, 
    streak, 
    longestStreak, 
    level, 
    points, 
    canClaimToday,
    transactions,
    badges,
    achievements 
  } = coinData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">داشبورد کاربری</h1>
          <p className="text-gray-600">سلام {session?.user?.name || 'کاربر'}! خوش آمدید 👋</p>
        </div>

        {/* Daily Reward Card */}
        {canClaimToday && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 mb-8 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🎁 پاداش روزانه</h2>
                <p className="text-green-100 mb-4">
                  رایگان سکه دریافت کنید! 🔥
                  {streak > 0 && <span className="block mt-2">استریک فعلی: {streak} روز</span>}
                </p>
                <button
                  onClick={handleClaimDailyReward}
                  disabled={claiming}
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors disabled:opacity-50"
                >
                  {claiming ? 'در حال دریافت...' : 'دریافت پاداش روزانه'}
                </button>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold">{streak}</div>
                <div className="text-green-100">روز متوالی</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Coins */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500">سکه</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{coins.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-2">موجودی شما</div>
          </motion.div>

          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">استریک</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{streak}</div>
            <div className="text-sm text-gray-500 mt-2">رکورد: {longestStreak} روز</div>
          </motion.div>

          {/* Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">سطح</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{level}</div>
            <div className="text-sm text-gray-500 mt-2">{points} امتیاز</div>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">نشان‌ها</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{badges.length}</div>
            <div className="text-sm text-gray-500 mt-2">نشان‌های کسب شده</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Clock className="w-5 h-5 ml-2 text-gray-600" />
              تراکنش‌های اخیر
            </h2>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ml-3 ${
                      transaction.type === 'EARNED' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'EARNED' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <Gift className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{transaction.description}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString('fa-IR')}
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold ${
                    transaction.type === 'EARNED' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'EARNED' ? '+' : '-'}{transaction.amount}
                  </div>
                </div>
              ))}
            </div>
            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                تراکنشی وجود ندارد
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Award className="w-5 h-5 ml-2 text-gray-600" />
              نشان‌های کسب شده
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg"
                >
                  <div className="text-4xl mb-2">{badge.icon || '🏆'}</div>
                  <div className="font-medium text-sm text-gray-900">{badge.name}</div>
                </div>
              ))}
            </div>
            {badges.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                هنوز نشان‌ای کسب نکرده‌اید
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.a
            href="/shop"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all flex items-center justify-between"
          >
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-2">فروشگاه</div>
              <div className="text-gray-600 text-sm">با سکه خود خرید کنید</div>
            </div>
            <ArrowRight className="w-6 h-6 text-cafe-green" />
          </motion.a>

          <motion.a
            href="/courses"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all flex items-center justify-between"
          >
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-2">آکادمی</div>
              <div className="text-gray-600 text-sm">با تکمیل دوره سکه دریافت کنید</div>
            </div>
            <ArrowRight className="w-6 h-6 text-cafe-green" />
          </motion.a>

          <motion.a
            href="/user/rewards"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all flex items-center justify-between"
          >
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-2">جوایز</div>
              <div className="text-gray-600 text-sm">سکه‌های خود را خرج کنید</div>
            </div>
            <ArrowRight className="w-6 h-6 text-cafe-green" />
          </motion.a>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

