import {Component, input, InputSignal} from '@angular/core';
import {Option} from '../../../service/single-choice-field-service';
import {FieldPresentation} from '../field-presentation/field-presentation';

@Component({
  selector: 'app-option-presentation',
  imports: [
    FieldPresentation
  ],
  templateUrl: './option-presentation.html',
  styleUrl: './option-presentation.scss'
})
export class OptionPresentation {
  public readonly option: InputSignal<Option> = input.required();
}
