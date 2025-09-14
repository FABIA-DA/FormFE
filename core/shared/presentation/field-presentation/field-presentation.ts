import {Component, input, InputSignal} from '@angular/core';
import {Field} from '../../../service/field-service';
import {OptionalStringPipe} from '../../../pipe/optional-string-pipe';
import {BooleanStringifyPipe} from '../../../pipe/boolean-stringify-pipe';
import {FieldTypePresentation} from '../field-type-presentation/field-type-presentation';

@Component({
  selector: 'app-field-presentation',
  imports: [
    OptionalStringPipe,
    BooleanStringifyPipe,
    FieldTypePresentation
  ],
  templateUrl: './field-presentation.html',
  styleUrl: './field-presentation.scss'
})
export class FieldPresentation {
  public readonly field: InputSignal<Field> = input.required();
}
