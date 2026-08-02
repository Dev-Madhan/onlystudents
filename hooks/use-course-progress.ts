export function useCourseProgress(chapters: any[]) {
    let totalLessons = 0;
    let completedLessons = 0;

    chapters.forEach((chapter) => {
        chapter.lessons.forEach((lesson: any) => {
            totalLessons++;
            
            const isCompleted = lesson.lessonProgress?.find(
                (progress: any) => progress.lessonId === lesson.id
            )?.completed;

            if (isCompleted) {
                completedLessons++;
            }
        });
    });

    const progressPercentage = totalLessons === 0 
        ? 0 
        : Math.round((completedLessons / totalLessons) * 100);

    return {
        totalLessons,
        completedLessons,
        progressPercentage
    };
}
