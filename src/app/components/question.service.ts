import { Injectable } from '@angular/core';
import { QUESTION_LIST } from './question-data';
import { Question } from './model/question';
import { UserAnswer } from './model/user-answer';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  public readonly questionList = QUESTION_LIST;

  public readonly CURRENT_QUESTION_KEY = 'currentQuestion';

  public readonly USER_ANSWERS_KEY = 'userAnswers';

  public getQuestionById(id: number): Question | undefined {
    return this.questionList.find((question) => question.id === id);
  }

  public saveCurrentAnswer(questionId: number, selectedOption: string): void {
    const questionData = this.getQuestionById(questionId);

    if (questionData) {
      const userAnswer: UserAnswer = {
        questionId: questionData.id,
        userAnswer: selectedOption,
        isCorrect: selectedOption === questionData.answer,
      };

      this.setCurrentQuestion(userAnswer);
    }
  }

  public updateUserAnswerList(): void {
    const currentQuestionAnswer = this.getCurrentQuestion();

    if (!currentQuestionAnswer) {
      return;
    }

    // Avoid duplicate entries.
    const userAnswers: UserAnswer[] = this.getUserAnswers().filter(
      (answer) => answer.questionId !== currentQuestionAnswer.questionId
    );
    userAnswers.push(currentQuestionAnswer);

    this.setUserAnswers(userAnswers);
  }

  public getUserAnswer(questionId: number): UserAnswer | undefined {
    const currentQuestion = this.getCurrentQuestion();

    if (currentQuestion && currentQuestion.questionId === questionId) {
      return currentQuestion;
    }

    return this.getUserAnswers().find(
      (answer: UserAnswer) => answer.questionId === questionId
    ) as UserAnswer;
  }

  public setUserAnswers(answers: UserAnswer[]): void {
    localStorage.setItem(this.USER_ANSWERS_KEY, JSON.stringify(answers));
  }

  public getUserAnswers(): UserAnswer[] {
    const userAnswers = localStorage.getItem(this.USER_ANSWERS_KEY);

    return userAnswers ? JSON.parse(userAnswers) : [];
  }

  public setCurrentQuestion(answer: UserAnswer): void {
    localStorage.setItem(this.CURRENT_QUESTION_KEY, JSON.stringify(answer));
  }

  public getCurrentQuestion(): UserAnswer | null {
    const currentQuestion = localStorage.getItem(this.CURRENT_QUESTION_KEY);

    return currentQuestion ? JSON.parse(currentQuestion) : null;
  }

  public clearAllAnswers(): void {
    localStorage.removeItem(this.CURRENT_QUESTION_KEY);
    localStorage.removeItem(this.USER_ANSWERS_KEY);
    this.clearAllQuestionTimers();
  }

  public clearAllQuestionTimers(): void {
    this.questionList.forEach((question) => {
      localStorage.removeItem(`${question.id}`);
    });
  }
}
