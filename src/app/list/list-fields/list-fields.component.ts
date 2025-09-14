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
import {Field, FieldService} from '../../../../core/service/field-service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {RouterLink} from '@angular/router';
import {BooleanStringifyPipe} from '../../../../core/pipe/boolean-stringify-pipe';
import {TruncatePipe} from '../../../../core/pipe/truncate-pipe';
import {OptionalStringPipe} from '../../../../core/pipe/optional-string-pipe';

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
    MatHeaderCellDef,
    MatProgressBar,
    RouterLink,
    BooleanStringifyPipe,
    TruncatePipe,
    OptionalStringPipe
  ],
  templateUrl: './list-fields.component.html',
  styleUrl: './list-fields.component.scss'
})
export class ListFields implements OnInit {
  protected readonly displayedColumns: string[] = ['name', 'description', 'isOptional', 'typeName'];
  protected readonly dataSource: WritableSignal<Field[]> = signal([]);
  protected readonly loading: WritableSignal<boolean> = signal(false);
  private readonly fieldService: FieldService = inject(FieldService);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try{
      this.dataSource.set(await this.fieldService.getAllFieldsAsync());
    }
    finally{
      this.loading.set(false);
    }
  }
}
