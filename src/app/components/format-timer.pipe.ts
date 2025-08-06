import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimer',
  pure: true,
})
export class FormatTimerPipe implements PipeTransform {
  transform(seconds: number): string {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }
}
