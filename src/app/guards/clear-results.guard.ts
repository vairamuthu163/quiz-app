import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { QuestionService } from '../components/question.service';
import { ResultsComponent } from '../components/results/results.component';

export const clearResultsGuard: CanDeactivateFn<
  ResultsComponent
> = (): boolean => {
  inject(QuestionService).clearAllAnswers();

  return true;
};
