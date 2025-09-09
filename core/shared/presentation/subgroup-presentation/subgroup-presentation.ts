import {Component, input, InputSignal} from '@angular/core';
import {Subgroup} from '../../../service/group-service';

@Component({
  selector: 'app-subgroup-presentation',
  imports: [],
  templateUrl: './subgroup-presentation.html',
  styleUrl: './subgroup-presentation.scss'
})
export class SubgroupPresentation {
  public readonly subgroup: InputSignal<Subgroup> = input.required();
}
