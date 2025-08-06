import { CommonModule } from '@angular/common';
import {
  Component,
  HostBinding,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { QuestionService } from '../question.service';
import { Question } from '../model/question';
import { UserAnswer } from '../model/user-answer';
import { MatTableModule } from '@angular/material/table';
import { QuestionComponent } from '../question/question.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

export interface Result {
  id: number;
  question: string;
  options: string[];
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
}

@Component({
  selector: 'app-results',
  imports: [CommonModule, MatTableModule, MatRadioModule, FormsModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent implements OnInit {
  private readonly questionService = inject(QuestionService);

  public readonly questionList: Question[] = this.questionService.questionList;

  public userScore = 0;

  public results: Result[] = [];

  public ngOnInit(): void {
    const userAnswers: UserAnswer[] = this.questionService.getUserAnswers();
    this.userScore = userAnswers.filter((a) => a.isCorrect).length;

    this.results = this.getResults();
  }

  public getResults(): Result[] {
    return this.questionList.map((question) => {
      const userAnswer = this.questionService.getUserAnswer(question.id);

      return {
        id: question.id,
        options: question.options,
        question: question.question,
        userAnswer: userAnswer?.userAnswer ?? '',
        isCorrect: userAnswer?.isCorrect ?? false,
        correctAnswer: question.answer,
      };
    });
  }
}
