import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  getCourses,
  getLessonModes,
  getLessons,
  getUnits,
} from '@/redux/slices/learningSlice';

export function useLearningProgressRefresh() {
  const dispatch = useAppDispatch();
  const { lessons, units } = useAppSelector((state) => state.learning);

  return useCallback(
    async (lessonId: string): Promise<void> => {
      const lesson = lessons.find((item) => item.id === lessonId);
      const unit = lesson
        ? units.find((item) => item.id === lesson.unitId)
        : undefined;
      const refreshes: Array<Promise<unknown>> = [dispatch(getCourses()).unwrap()];

      if (lessonId) {
        refreshes.push(dispatch(getLessonModes(lessonId)).unwrap());
      }

      if (lesson) {
        refreshes.push(dispatch(getLessons(lesson.unitId)).unwrap());
      }

      if (unit) {
        refreshes.push(dispatch(getUnits(unit.courseId)).unwrap());
      }

      await Promise.allSettled(refreshes);
    },
    [dispatch, lessons, units],
  );
}

