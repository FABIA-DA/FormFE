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
import {Form, FormService} from '../../../core/service/form-service';

@Component({
  selector: 'app-list-forms',
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
  templateUrl: './list-forms.html',
  styleUrl: './list-forms.scss'
})
export class ListForms implements OnInit {
  protected readonly displayedColumns: string[] = ['name', 'groupName', 'fieldGroupCount'];
  protected readonly dataSource: WritableSignal<Form[]> = signal([]);
  private readonly formService: FormService = inject(FormService);

  async ngOnInit(): Promise<void> {
    this.dataSource.set(await this.formService.getAllFormsAsync());
  }
}
