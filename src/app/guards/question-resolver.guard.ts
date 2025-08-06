import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Question } from '../components/model/question';
import { QuestionService } from '../components/question.service';

export const questionResolver: ResolveFn<Question | undefined> = (
  route: ActivatedRouteSnapshot
): Question | undefined => {
  const questionId = Number(route.paramMap.get('id'));
  const questionService = inject(QuestionService);

  const questionData = questionService.getQuestionById(questionId);

  const inProgressQuestion = questionService.getUserAnswer(questionId);

  if (!inProgressQuestion) {
    return questionData;
  }

  return {
    ...questionData,
    selectedOption: inProgressQuestion.userAnswer,
  } as Question;
};
