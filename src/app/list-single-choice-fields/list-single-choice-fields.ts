import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {SingleChoiceField, SingleChoiceFieldService} from '../../../core/service/single-choice-field-service';
import {MatProgressBar} from '@angular/material/progress-bar';

@Component({
  selector: 'app-list-single-choice-fields',
  standalone: true,
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatProgressBar
  ],
  templateUrl: './list-single-choice-fields.html',
  styleUrl: './list-single-choice-fields.scss'
})
export class ListSingleChoiceFields implements OnInit {
  protected readonly displayedColumns: string[] = ['name', 'optionCount'];
  protected readonly dataSource: WritableSignal<SingleChoiceField[]> = signal([]);
  protected readonly loading: WritableSignal<boolean> = signal(false);
  private readonly singleChoiceFieldService: SingleChoiceFieldService = inject(SingleChoiceFieldService);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try{
      this.dataSource.set(await this.singleChoiceFieldService.getAllSingleChoiceFieldsAsync());
    }
    finally{
      this.loading.set(false);
    }
  }
}
