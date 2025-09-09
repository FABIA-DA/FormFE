import {Component, input, InputSignal} from '@angular/core';
import {Form} from '../../../service/form-service';
import {FieldGroupPresentation} from '../field-group-presentation/field-group-presentation';
import {OptionalStringPipe} from '../../../pipe/optional-string-pipe';

@Component({
  selector: 'app-form-presentation',
  imports: [
    FieldGroupPresentation,
    OptionalStringPipe
  ],
  templateUrl: './form-presentation.html',
  styleUrl: './form-presentation.scss'
})
export class FormPresentation {
  public readonly form: InputSignal<Form> = input.required();
}
