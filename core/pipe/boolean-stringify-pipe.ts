import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanStringify'
})
export class BooleanStringifyPipe implements PipeTransform {

  public transform(value: boolean): string {
    return value ? 'Yes' : 'No';
  }

}
