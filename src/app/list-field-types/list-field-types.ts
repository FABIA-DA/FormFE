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
import {FieldType, FieldTypeService} from '../../../core/service/field-type-service';

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
    MatRow
  ],
  templateUrl: './list-field-types.html',
  styleUrl: './list-field-types.scss'
})
export class ListFieldTypes implements OnInit {
  protected readonly displayedColumns: string[] = ['name', 'description', 'regex'];
  protected readonly dataSource: WritableSignal<FieldType[]> = signal([]);
  private readonly fieldTypeService: FieldTypeService = inject(FieldTypeService);

  async ngOnInit(): Promise<void> {
    this.dataSource.set(await this.fieldTypeService.getAllFieldTypesAsync())
  }
}
