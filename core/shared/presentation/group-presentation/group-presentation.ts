import {Component, input, InputSignal} from '@angular/core';
import {Group} from '../../../service/group-service';
import {FormPresentation} from '../form-presentation/form-presentation';
import {OptionalStringPipe} from '../../../pipe/optional-string-pipe';

@Component({
  selector: 'app-group-presentation',
  imports: [
    FormPresentation,
    OptionalStringPipe
  ],
  templateUrl: './group-presentation.html',
  styleUrl: './group-presentation.scss'
})
export class GroupPresentation {
  public readonly group: InputSignal<Group> = input.required();
}
