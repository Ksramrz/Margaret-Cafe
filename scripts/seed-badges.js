const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedBadges() {
  console.log('Seeding badges and achievements...');

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

  try {
    for (const badge of badges) {
      await prisma.badge.upsert({
        where: { name: badge.name },
        update: {},
        create: badge,
      });
      console.log(`✓ Badge: ${badge.nameFa}`);
    }

    for (const achievement of achievements) {
      await prisma.achievement.upsert({
        where: { name: achievement.name },
        update: {},
        create: achievement,
      });
      console.log(`✓ Achievement: ${achievement.nameFa}`);
    }

    console.log('Badges and achievements seeded successfully!');
  } catch (error) {
    console.error('Error seeding badges:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedBadges()
  .then(() => {
    console.log('Seed process completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  });

