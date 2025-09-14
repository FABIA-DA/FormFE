import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  public transform(value: string): string {
    const maxLength: number = 30;
    const placeholder: string = '.'.repeat(3);
    const maxTextLength: number = maxLength - placeholder.length;

    if(value.length <= maxTextLength) {
      return value;
    } else {
      return value.substring(0, maxTextLength).concat(placeholder);
    }
  }

}
