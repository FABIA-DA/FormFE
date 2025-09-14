import {Component, input, InputSignal} from '@angular/core';
import {FieldGroup} from '../../../service/field-group-service';
import {SingleChoiceFieldPresentation} from '../single-choice-field-presentation/single-choice-field-presentation';
import {FieldPresentation} from '../field-presentation/field-presentation';

@Component({
  selector: 'app-field-group-presentation',
  imports: [
    SingleChoiceFieldPresentation,
    FieldPresentation
  ],
  templateUrl: './field-group-presentation.html',
  styleUrl: './field-group-presentation.scss'
})
export class FieldGroupPresentation {
  public readonly fieldGroup: InputSignal<FieldGroup> = input.required();
}
