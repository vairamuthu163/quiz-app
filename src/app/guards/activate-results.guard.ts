import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { QuestionService } from '../components/question.service';

export const activateResultsGuard: CanMatchFn = (): boolean => {
  const questionService = inject(QuestionService);
  const userAnswers = questionService.getUserAnswers();
  const questionsLength = questionService.questionList.length;

  if (userAnswers.length === 0 || userAnswers.length < questionsLength) {
    questionService.clearAllAnswers();

    inject(Router).navigate(['/questions']);

    return false;
  }

  return true;
};
