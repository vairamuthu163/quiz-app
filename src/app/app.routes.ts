import { Routes } from '@angular/router';
import { clearResultsGuard } from './guards/clear-results.guard';
import { questionResolver } from './guards/question-resolver.guard';
import { activateResultsGuard } from './guards/activate-results.guard';

export const routes: Routes = [
  {
    path: 'questions',
    loadComponent: () =>
      import('./components/questions-home/questions-home.component').then(
        (n) => n.QuestionsHomeComponent
      ),
    children: [
      {
        path: 'not-found',
        loadComponent: () =>
          import(
            './components/question-not-found/question-not-found.component'
          ).then((n) => n.QuestionNotFoundComponent),
      },
      {
        path: 'results',
        loadComponent: () =>
          import('./components/results/results.component').then(
            (n) => n.ResultsComponent
          ),
        canDeactivate: [clearResultsGuard],
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./components/question/question.component').then(
            (n) => n.QuestionComponent
          ),
        resolve: {
          question: questionResolver,
        },
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'questions',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/page-not-found/page-not-found.component').then(
        (n) => n.PageNotFoundComponent
      ),
  },
];
