import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-questions-home',
  imports: [CommonModule, RouterOutlet],
  standalone: true,
  templateUrl: './questions-home.component.html',
  styleUrl: './questions-home.component.scss',
})
export class QuestionsHomeComponent {
  private readonly router = inject(Router);
  private readonly questionService = inject(QuestionService);

  get showHome(): boolean {
    return this.router.url === '/questions';
  }

  onQuizStart(): void {
    this.questionService.clearAllAnswers();
    this.router.navigate(['/questions', 1]);
  }
}
