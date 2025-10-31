import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = session.user.id;
    const { courseId, lessonId } = req.body;

    if (!courseId || !lessonId) {
      return res.status(400).json({ error: 'Course ID and Lesson ID are required' });
    }

    // Check if user is enrolled
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: true,
      },
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Not enrolled in this course' });
    }

    // Check if already completed
    if (enrollment.completedAt) {
      return res.status(400).json({ error: 'Course already completed' });
    }

    // Get all lessons for this course
    const allLessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });

    // Check if this is the last lesson
    const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
    const lastLesson = allLessons[allLessons.length - 1];

    // If this is the last lesson, mark course as completed
    if (lastLesson.id === lessonId) {
      // Calculate coins based on course difficulty
      let coinsReward = 50; // Default
      let pointsReward = 25;

      if (enrollment.course.level === 'ADVANCED') {
        coinsReward = 150;
        pointsReward = 75;
      } else if (enrollment.course.level === 'INTERMEDIATE') {
        coinsReward = 100;
        pointsReward = 50;
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update enrollment
      await prisma.courseEnrollment.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: {
          completedAt: new Date(),
        },
      });

      // Award coins and points
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalCoins: user.totalCoins + coinsReward,
          totalPoints: user.totalPoints + pointsReward,
        },
      });

      // Create transaction
      await prisma.coinTransaction.create({
        data: {
          userId,
          type: 'EARNED',
          amount: coinsReward,
          source: 'COURSE_COMPLETE',
          description: `تکمیل دوره: ${enrollment.course.titleFa}`,
          metadata: JSON.stringify({ courseId, pointsReward }),
        },
      });

      // Check for achievements
      const userCourseCompletions = await prisma.courseEnrollment.count({
        where: {
          userId,
          completedAt: { not: null },
        },
      });

      // Award "Course Master" badge if applicable
      if (userCourseCompletions >= 1) {
        const badge = await prisma.badge.findUnique({
          where: { name: 'course-master' },
        });

        if (badge) {
          try {
            await prisma.userBadge.create({
              data: {
                userId,
                badgeId: badge.id,
              },
            });
          } catch (error) {
            // Badge already earned
          }
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Course completed!',
        coinsReward,
        pointsReward,
        totalCoins: user.totalCoins + coinsReward,
        badges: userCourseCompletions === 1 ? ['course-master'] : [],
      });
    } else {
      // Just mark lesson as completed (not implementing lesson tracking for now)
      return res.status(200).json({
        success: true,
        message: 'Lesson completed',
      });
    }

  } catch (error) {
    console.error('Error completing course:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

