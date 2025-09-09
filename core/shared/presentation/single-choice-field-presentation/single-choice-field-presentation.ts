import {Component, input, InputSignal} from '@angular/core';
import {SingleChoiceField} from '../../../service/single-choice-field-service';
import {OptionPresentation} from '../option-presentation/option-presentation';

@Component({
  selector: 'app-single-choice-field-presentation',
  imports: [
    OptionPresentation
  ],
  templateUrl: './single-choice-field-presentation.html',
  styleUrl: './single-choice-field-presentation.scss'
})
export class SingleChoiceFieldPresentation {
  public readonly singleChoiceField: InputSignal<SingleChoiceField> = input.required();
}
