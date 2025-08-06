import { Component, inject, OnInit, DestroyRef, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Question } from '../model/question';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { QuestionService } from '../question.service';
import { take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { FormatTimerPipe } from '../format-timer.pipe';

@Component({
  selector: 'app-question',
  imports: [
    CommonModule,
    FormsModule,
    FormsModule,
    MatRadioModule,
    RouterModule,
    FormatTimerPipe,
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
  standalone: true,
})
export class QuestionComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly matDialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly questionService = inject(QuestionService);

  public readonly maxTime = 30; // in seconds.
  public timerStopped: boolean = false;
  public readonly questionList: Question[] = this.questionService.questionList;

  public questionData = signal<Question | null>(null);

  public selectedOption!: string;

  private timerInterval!: any;
  public currentTimer!: number;

  public get isFirstQuestion(): boolean {
    return this.questionData()?.id === this.questionList[0].id;
  }

  public get isLastQuestion(): boolean {
    return this.questionData()?.id === this.questionList.at(-1)?.id;
  }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        const questionData = data['question'] as Question | undefined;

        if (!questionData) {
          this.router.navigate(['questions', 'not-found']);

          return;
        }

        this.stopTimer();
        this.timerStopped = false;
        this.selectedOption = questionData.selectedOption || '';
        this.questionData.set(questionData);
        this.handleTimer();
      });
  }

  public onSelectionChange(): void {
    const questionId = this.questionData()?.id;

    if (!questionId) {
      return;
    }

    this.questionService.saveCurrentAnswer(questionId, this.selectedOption);
  }

  public onSubmit(): void {
    const matDialogRef = this.matDialog.open(ConfirmationComponent, {
      width: '400px',
      data: {
        headerText: 'Confirm Submission',
        message: 'Are you sure you want to submit your answer?',
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
      },
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (confirmed) {
          const questionId = this.questionData()?.id;

          if (!questionId) {
            return;
          }

          this.selectedOption = '';
          this.questionService.updateUserAnswerList();
          this.questionService.clearAllQuestionTimers();

          this.router.navigate(['questions', 'results']);
        }
      });
  }

  public onClearAllAnswers(): void {
    const matDialogRef = this.matDialog.open(ConfirmationComponent, {
      width: '400px',
      data: {
        headerText: 'Clear All Answers',
        message: 'Are you sure you want to clear all answers?',
        confirmButtonText: 'Clear',
        cancelButtonText: 'Cancel',
      },
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.selectedOption = '';
          this.questionService.clearAllAnswers();
          this.router.navigate(['questions']);
        }
      });
  }

  public onBackBtnClick(): void {
    this.navigateToQuestion(-1);
  }

  public onNextBtnClick(): void {
    this.questionService.updateUserAnswerList();
    this.navigateToQuestion(1);
  }

  private navigateToQuestion(offset: number): void {
    const questionId = this.questionData()?.id;

    if (!questionId) return;

    this.router.navigateByUrl('/questions/' + (questionId + offset));
  }

  private handleTimer(): void {
    this.currentTimer = JSON.parse(
      localStorage.getItem(`${this.questionData()?.id}`) ?? '1'
    ) as number;

    if (this.currentTimer >= this.maxTime) {
      this.timerStopped = true;

      return;
    }

    this.startTimer();
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.currentTimer < this.maxTime) {
        this.currentTimer++;
        localStorage.setItem(
          `${this.questionData()?.id}`,
          this.currentTimer.toString()
        );
      } else {
        this.stopTimer();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      this.timerStopped = true;
      clearInterval(this.timerInterval);
    }
  }
}
