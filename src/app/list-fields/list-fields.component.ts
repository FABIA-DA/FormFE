import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {Field, FieldService} from '../../../core/service/field-service';

@Component({
  selector: 'app-list-fields',
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
    MatHeaderCellDef
  ],
  templateUrl: './list-fields.component.html',
  styleUrl: './list-fields.component.scss'
})
export class ListFields implements OnInit {
  protected readonly displayedColumns: string[] = ['name', 'description', 'isOptional', 'typeName'];
  protected readonly dataSource: WritableSignal<Field[]> = signal([]);
  private readonly fieldService: FieldService = inject(FieldService);

  async ngOnInit(): Promise<void> {
    this.dataSource.set(await this.fieldService.getAllFieldsAsync());
  }
}
