import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  Gift,
  Coins,
  Sparkles,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  coinsCost: number;
  type: string;
  image: string | null;
  canAfford: boolean;
  userCanRedeem: boolean;
  maxRedemptions?: number | null;
  expiresAt: string | null;
}

interface UserRedemption {
  id: string;
  couponCode: string;
  status: string;
  usedAt: string | null;
  expiresAt: string | null;
  reward: {
    name: string;
    type: string;
  };
  createdAt: string;
}

const RewardsPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<UserRedemption[]>([]);
  const [userCoins, setUserCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const [rewardsRes, redemptionsRes] = await Promise.all([
        fetch('/api/rewards'),
        fetch('/api/user/redemptions'),
      ]);

      if (rewardsRes.ok) {
        const data = await rewardsRes.json();
        setRewards(data.rewards || []);
        setUserCoins(data.userCoins || 0);
      }

      if (redemptionsRes.ok) {
        const data = await redemptionsRes.json();
        setRedemptions(data.redemptions || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (rewardId: string) => {
    setRedeemingId(rewardId);
    try {
      const response = await fetch('/api/user/redeem-reward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rewardId }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`موفقیت! کد کوپن شما: ${data.couponCode}`);
        await fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'خطا در خرید جوایز');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('خطا در خرید جوایز');
    } finally {
      setRedeemingId(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DISCOUNT':
        return '🎫';
      case 'PRODUCT':
        return '📦';
      case 'ACCESS':
        return '🎓';
      case 'SUBSCRIPTION':
        return '⭐';
      default:
        return '🎁';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'DISCOUNT':
        return 'تخفیف';
      case 'PRODUCT':
        return 'محصول رایگان';
      case 'ACCESS':
        return 'دسترسی ویژه';
      case 'SUBSCRIPTION':
        return 'اشتراک';
      default:
        return 'جایزه';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'ACTIVE') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (status === 'USED') {
      return <XCircle className="w-5 h-5 text-gray-400" />;
    } else {
      return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusText = (status: string) => {
    if (status === 'ACTIVE') return 'فعال';
    if (status === 'USED') return 'استفاده شده';
    return 'منقضی شده';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cafe-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">فروشگاه جوایز</h1>
          <p className="text-gray-600 flex items-center">
            <Coins className="w-5 h-5 ml-2 text-yellow-600" />
            <span className="font-bold text-2xl text-yellow-600">{userCoins.toLocaleString()}</span>
            <span className="mr-2">سکه موجود شما</span>
          </p>
        </div>

        {/* Available Rewards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Gift className="w-6 h-6 ml-2 text-cafe-green" />
            جوایز موجود
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{getTypeIcon(reward.type)}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{reward.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{reward.description}</p>
                  <div className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                    {getTypeName(reward.type)}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">قیمت:</span>
                    <span className="font-bold text-2xl text-yellow-600">
                      {reward.coinsCost} سکه
                    </span>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward.id)}
                    disabled={!reward.canAfford || !reward.userCanRedeem || redeemingId === reward.id}
                    className={`w-full py-3 rounded-lg font-bold transition-colors ${
                      reward.canAfford && reward.userCanRedeem
                        ? 'bg-cafe-green text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {redeemingId === reward.id
                      ? 'در حال خرید...'
                      : reward.canAfford
                      ? 'خرید'
                      : 'سکه کافی نیست'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {rewards.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">در حال حاضر جایزه‌ای موجود نیست</p>
            </div>
          )}
        </div>

        {/* User Redemptions */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Sparkles className="w-6 h-6 ml-2 text-cafe-green" />
            کدهای کوپن من
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {redemptions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">کد کوپن</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">جایزه</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">وضعیت</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">تاریخ</th>
                      <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">انقضا</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {redemptions.map((redemption) => (
                      <tr key={redemption.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono font-bold text-gray-900">
                          {redemption.couponCode}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{redemption.reward.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {getStatusIcon(redemption.status)}
                            <span className="mr-2">{getStatusText(redemption.status)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(redemption.createdAt).toLocaleDateString('fa-IR')}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {redemption.expiresAt
                            ? new Date(redemption.expiresAt).toLocaleDateString('fa-IR')
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-600">
                هنوز جایزه‌ای خریداری نکرده‌اید
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;

