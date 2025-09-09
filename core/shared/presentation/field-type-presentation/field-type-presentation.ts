import {Component, input, InputSignal} from '@angular/core';
import {FieldType} from '../../../service/field-type-service';

@Component({
  selector: 'app-field-type-presentation',
  imports: [],
  templateUrl: './field-type-presentation.html',
  styleUrl: './field-type-presentation.scss'
})
export class FieldTypePresentation {
  public readonly fieldType: InputSignal<FieldType> = input.required();
}
