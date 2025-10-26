const { PrismaClient } = require('@prisma/client');

const PRODUCTION_DB_URL = 'postgresql://margaret_cafe_db_user:Cgqjwa6a4zrtyvQm5bMbZVnorDvbynWt@dpg-d3mf75ur433s73ajo2g0-a.oregon-postgres.render.com/margaret_cafe_db';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || PRODUCTION_DB_URL
    }
  }
});

async function seedProduction() {
  console.log('Starting production database setup...');

  const badges = [
    {
      name: 'first-steps',
      nameFa: 'اولین قدم',
      description: 'Welcome to the community',
      descriptionFa: 'به جامعه خوش آمدید',
      icon: '👋',
      category: 'MILESTONE',
      pointsRequired: 0,
    },
    {
      name: 'first-purchase',
      nameFa: 'خریدار اول',
      description: 'Made your first purchase',
      descriptionFa: 'اولین خرید خود را انجام دادید',
      icon: '🛍️',
      category: 'MILESTONE',
      pointsRequired: 100,
    },
    {
      name: 'week-streak',
      nameFa: 'طوفان هفته',
      description: '7 day login streak',
      descriptionFa: '۷ روز متوالی ورود به سایت',
      icon: '🔥',
      category: 'ACHIEVEMENT',
      pointsRequired: 50,
    },
    {
      name: 'month-streak',
      nameFa: 'طوفان ماه',
      description: '30 day login streak',
      descriptionFa: '۳۰ روز متوالی ورود به سایت',
      icon: '💪',
      category: 'ACHIEVEMENT',
      pointsRequired: 500,
    },
    {
      name: 'century-streak',
      nameFa: 'طوفان سده',
      description: '100 day login streak',
      descriptionFa: '۱۰۰ روز متوالی ورود به سایت',
      icon: '👑',
      category: 'SPECIAL',
      pointsRequired: 5000,
    },
    {
      name: 'course-master',
      nameFa: 'استاد دوره',
      description: 'Completed a course',
      descriptionFa: 'یک دوره را تکمیل کردید',
      icon: '🎓',
      category: 'ACHIEVEMENT',
      pointsRequired: 200,
    },
    {
      name: 'collector',
      nameFa: 'کلکسیونر',
      description: 'Earned 100 coins',
      descriptionFa: '۱۰۰ سکه کسب کردید',
      icon: '💰',
      category: 'MILESTONE',
      pointsRequired: 100,
    },
    {
      name: 'tycoon',
      nameFa: 'سلطان تجارت',
      description: 'Earned 1000 coins',
      descriptionFa: '۱۰۰۰ سکه کسب کردید',
      icon: '💎',
      category: 'SPECIAL',
      pointsRequired: 2000,
    },
  ];

  const achievements = [
    {
      name: 'early-bird',
      nameFa: 'پرنده صبح',
      description: 'Login before 8 AM',
      descriptionFa: 'ورود قبل از ساعت ۸ صبح',
      coinsReward: 20,
      pointsReward: 10,
      icon: '🌅',
      category: 'ENGAGEMENT',
    },
    {
      name: 'night-owl',
      nameFa: 'جغد شب',
      description: 'Login after 11 PM',
      descriptionFa: 'ورود بعد از ساعت ۱۱ شب',
      coinsReward: 20,
      pointsReward: 10,
      icon: '🦉',
      category: 'ENGAGEMENT',
    },
    {
      name: 'social-butterfly',
      nameFa: 'خوش‌معاشرت',
      description: 'Share a product on social media',
      descriptionFa: 'یک محصول را در شبکه‌های اجتماعی به اشتراک بگذارید',
      coinsReward: 50,
      pointsReward: 25,
      icon: '🦋',
      category: 'ENGAGEMENT',
    },
    {
      name: 'review-master',
      nameFa: 'استاد نقد',
      description: 'Write 5 product reviews',
      descriptionFa: '۵ نقد محصول نوشتید',
      coinsReward: 100,
      pointsReward: 50,
      icon: '⭐',
      category: 'ENGAGEMENT',
    },
    {
      name: 'tutorial-starter',
      nameFa: 'شروع‌کننده',
      description: 'Complete your first tutorial',
      descriptionFa: 'اولین آموزش را تکمیل کردید',
      coinsReward: 30,
      pointsReward: 15,
      icon: '📚',
      category: 'COURSE',
    },
    {
      name: 'all-courses',
      nameFa: 'همه‌کاره',
      description: 'Complete all courses',
      descriptionFa: 'همه دوره‌ها را تکمیل کردید',
      coinsReward: 500,
      pointsReward: 250,
      icon: '🏆',
      category: 'COURSE',
    },
  ];

  // Create sample rewards
  const rewards = [
    {
      name: '10% Discount',
      nameFa: 'تخفیف ۱۰٪',
      description: '10% off your next purchase',
      descriptionFa: '۱۰٪ تخفیف برای خرید بعدی شما',
      coinsCost: 100,
      type: 'DISCOUNT',
      value: JSON.stringify({ discountPercent: 10 }),
    },
    {
      name: '20% Discount',
      nameFa: 'تخفیف ۲۰٪',
      description: '20% off your next purchase',
      descriptionFa: '۲۰٪ تخفیف برای خرید بعدی شما',
      coinsCost: 200,
      type: 'DISCOUNT',
      value: JSON.stringify({ discountPercent: 20 }),
    },
    {
      name: '50% Discount',
      nameFa: 'تخفیف ۵۰٪',
      description: '50% off your next purchase',
      descriptionFa: '۵۰٪ تخفیف برای خرید بعدی شما',
      coinsCost: 500,
      type: 'DISCOUNT',
      value: JSON.stringify({ discountPercent: 50 }),
    },
  ];

  try {
    console.log('Seeding badges...');
    for (const badge of badges) {
      await prisma.badge.upsert({
        where: { name: badge.name },
        update: {},
        create: badge,
      });
      console.log(`✓ Badge: ${badge.nameFa}`);
    }

    console.log('Seeding achievements...');
    for (const achievement of achievements) {
      await prisma.achievement.upsert({
        where: { name: achievement.name },
        update: {},
        create: achievement,
      });
      console.log(`✓ Achievement: ${achievement.nameFa}`);
    }

    console.log('Creating sample rewards...');
    for (const reward of rewards) {
      await prisma.reward.upsert({
        where: { id: reward.name }, // Use name as unique identifier
        update: {},
        create: {
          ...reward,
          id: reward.name.toLowerCase().replace(/\s+/g, '-'),
        },
      });
      console.log(`✓ Reward: ${reward.nameFa}`);
    }

    console.log('✓ Production database seeded successfully!');
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedProduction()
  .then(() => {
    console.log('\n✓ Production setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Production setup failed:', error);
    process.exit(1);
  });

