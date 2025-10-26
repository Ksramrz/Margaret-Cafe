import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Coffee, Gift, Receipt, Sparkles } from 'lucide-react';

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ موفق! کد شما: ${data.couponCode}\n\nاین کد رو هنگام پرداخت وارد کنید تا تخفیف اعمال بشه!`);
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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cafe-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cafe-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cafe-cream py-8">
      <div className="container-custom max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            فروشگاه جوایز ☕
          </h1>
          <div className="flex items-center justify-center text-2xl">
            <Coffee className="w-8 h-8 ml-3 text-amber-600" />
            <span className="font-bold text-amber-600">{userCoins.toLocaleString()}</span>
            <span className="mr-3 text-gray-600">فنجان داری</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {rewards.map((reward) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-amber-200"
            >
              <div className="text-5xl mb-4 text-center">
                {reward.type === 'DISCOUNT' && '🎫'}
                {reward.type === 'PRODUCT' && '📦'}
                {reward.type === 'ACCESS' && '🎓'}
                {!['DISCOUNT', 'PRODUCT', 'ACCESS'].includes(reward.type) && '🎁'}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{reward.name}</h3>
              <p className="text-gray-600 text-sm mb-4 text-center">{reward.description}</p>

              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">قیمت:</span>
                  <span className="font-bold text-2xl text-amber-600">
                    <Coffee className="w-5 h-5 inline ml-1" />
                    {reward.coinsCost}
                  </span>
                </div>

                <button
                  onClick={() => handleRedeem(reward.id)}
                  disabled={!reward.canAfford || !reward.userCanRedeem || redeemingId === reward.id}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    reward.canAfford && reward.userCanRedeem
                      ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg hover:scale-105'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {redeemingId === reward.id
                    ? 'در حال خرید...'
                    : reward.canAfford
                    ? 'خرید'
                    : 'فنجان کافی نیست ☕'}
                </button>
              </div>
            </motion.div>
          ))}

          {rewards.length === 0 && (
            <div className="col-span-3 text-center py-16 bg-white rounded-2xl">
              <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">در حال حاضر جایزه‌ای موجود نیست</p>
              <p className="text-gray-500 mt-2">به زودی جوایز جدیدی اضافه می‌شوند!</p>
            </div>
          )}
        </div>

        {redemptions.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Receipt className="w-6 h-6 ml-2 text-cafe-green" />
              کدهای کوپن من
            </h2>
            <div className="space-y-3">
              {redemptions.map((redemption) => (
                <div
                  key={redemption.id}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-lg text-gray-900 mb-1">
                        {redemption.couponCode}
                      </div>
                      <div className="text-sm text-gray-600">
                        {redemption.reward.name}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className={`text-sm font-medium ${
                        redemption.status === 'ACTIVE' ? 'text-green-600' : 
                        redemption.status === 'USED' ? 'text-gray-400' : 'text-orange-600'
                      }`}>
                        {redemption.status === 'ACTIVE' ? 'فعال ✓' :
                         redemption.status === 'USED' ? 'استفاده شده' : 'منقضی شده'}
                      </div>
                      {redemption.expiresAt && (
                        <div className="text-xs text-gray-500 mt-1">
                          تا {new Date(redemption.expiresAt).toLocaleDateString('fa-IR')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsPage;
