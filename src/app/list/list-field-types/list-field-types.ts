import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {FieldType, FieldTypeService} from '../../../../core/service/field-type-service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {RouterLink} from '@angular/router';
import {OptionalStringPipe} from '../../../../core/pipe/optional-string-pipe';
import {TruncatePipe} from '../../../../core/pipe/truncate-pipe';

@Component({
  selector: 'app-list-field-types',
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef,
    MatRow,
    MatProgressBar,
    RouterLink,
    OptionalStringPipe,
    TruncatePipe
  ],
  templateUrl: './list-field-types.html',
  styleUrl: './list-field-types.scss'
})
export class ListFieldTypes implements OnInit {
  protected readonly displayedColumns: string[] = ['name', 'description', 'regex'];
  protected readonly dataSource: WritableSignal<FieldType[]> = signal([]);
  protected readonly loading: WritableSignal<boolean> = signal(false);
  private readonly fieldTypeService: FieldTypeService = inject(FieldTypeService);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try{
      this.dataSource.set(await this.fieldTypeService.getAllFieldTypesAsync())
    }
    finally{
      this.loading.set(false);
    }
  }
}
