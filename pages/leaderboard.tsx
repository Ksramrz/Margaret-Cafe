import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Crown,
  Award,
  Medal,
  Flame,
  Coins,
  TrendingUp,
  Calendar,
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  email: string | null;
  image: string | null;
  totalCoins: number;
  streak: number;
  longestStreak: number;
  level: number;
  points: number;
  recentCoins: number | null;
  badges: number;
  badgeIcons: string[];
}

interface LeaderboardData {
  period: string;
  leaderboard: LeaderboardEntry[];
  totalUsers: number;
}

const LeaderboardPage: React.FC = () => {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [period, setPeriod] = useState('all-time');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?period=${period}&limit=100`);
      if (response.ok) {
        const leaderboardData = await response.json();
        setData(leaderboardData);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-8 h-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-400" />;
    if (rank === 3) return <Award className="w-8 h-8 text-orange-500" />;
    return null;
  };

  const getPeriodText = (period: string) => {
    switch (period) {
      case 'all-time':
        return 'همیشه';
      case 'monthly':
        return 'ماهانه';
      case 'weekly':
        return 'هفتگی';
      default:
        return 'همیشه';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cafe-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-600 ml-4" />
            <h1 className="text-4xl font-bold text-gray-900">جدول رده‌بندی</h1>
          </div>
          <p className="text-gray-600">برترین کاربران کافه مارگارت</p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {['all-time', 'monthly', 'weekly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                period === p
                  ? 'bg-cafe-green text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {getPeriodText(p)}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        {data && data.leaderboard.length > 0 && (
          <div className="mb-8 grid grid-cols-3 gap-4">
            {data.leaderboard.slice(0, 3).map((user, index) => {
              const positions = ['left', 'center', 'right'];
              const heights = [50, 70, 50];
              const translateYs = [20, 0, 20];

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`bg-white rounded-xl p-6 shadow-lg flex flex-col items-center ${
                    index === 1 ? 'order-first lg:order-2' : ''
                  }`}
                  style={{ height: `${heights[index] * 10}px` }}
                >
                  {getRankIcon(user.rank)}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold my-3">
                    {user.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{user.name}</h3>
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    {user.totalCoins.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Flame className="w-4 h-4 ml-1 text-orange-500" />
                    {user.streak} روز
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Leaderboard List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">رتبه</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">کاربر</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">سکه‌ها</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">استریک</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">سطح</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">نشان‌ها</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.leaderboard.slice(3).map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getRankIcon(user.rank)}
                        {!getRankIcon(user.rank) && (
                          <span className="font-bold text-gray-600">#{user.rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-10 h-10 rounded-full ml-3"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold ml-3">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Coins className="w-5 h-5 ml-2 text-yellow-600" />
                        <span className="font-bold">{user.totalCoins.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Flame className="w-5 h-5 ml-2 text-orange-500" />
                        <span className="font-medium">{user.streak} روز</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 ml-2 text-blue-500" />
                        <span className="font-medium">سطح {user.level}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {user.badgeIcons.slice(0, 3).map((icon, i) => (
                          <span key={i} className="text-2xl mr-1">
                            {icon}
                          </span>
                        ))}
                        {user.badges > 3 && (
                          <span className="text-gray-500 text-sm">+{user.badges - 3}</span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!data || data.leaderboard.length === 0) && (
            <div className="text-center py-12 text-gray-600">
              کاربری وجود ندارد
            </div>
          )}
        </div>

        {/* Stats */}
        {data && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {data.totalUsers.toLocaleString()}
                </div>
                <div className="text-gray-600">کل کاربران</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {data.leaderboard[0]?.totalCoins.toLocaleString() || 0}
                </div>
                <div className="text-gray-600">بیشترین سکه</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {data.leaderboard[0]?.streak || 0}
                </div>
                <div className="text-gray-600">طولانی‌ترین استریک</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;

