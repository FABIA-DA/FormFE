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
import {Form, FormListPresentation, FormService} from '../../../../core/service/form-service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {RouterLink} from '@angular/router';
import {OptionalStringPipe} from '../../../../core/pipe/optional-string-pipe';

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
    MatHeaderCellDef,
    MatProgressBar,
    RouterLink,
    OptionalStringPipe
  ],
  templateUrl: './list-forms.html',
  styleUrl: './list-forms.scss'
})
export class ListForms implements OnInit {
  protected readonly displayedColumns: string[] = ['name', 'groupName', 'fieldGroupCount'];
  protected readonly dataSource: WritableSignal<FormListPresentation[]> = signal([]);
  protected readonly loading: WritableSignal<boolean> = signal(false);
  private readonly formService: FormService = inject(FormService);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try{
      this.dataSource.set(await this.formService.getAllFormsAsync());
    }
    finally{
      this.loading.set(false);
    }
  }
}
