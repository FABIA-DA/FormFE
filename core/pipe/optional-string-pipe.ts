import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'optionalString'
})
export class OptionalStringPipe implements PipeTransform {

  public transform(value: string | null | undefined): string {
    return value == null ? '-' : value;
  }

}
