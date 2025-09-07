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
import {FieldGroup, FieldGroupService} from '../../../core/service/field-group-service';
import {MatProgressBar} from '@angular/material/progress-bar';

@Component({
  selector: 'app-list-field-groups',
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
  templateUrl: './list-field-groups.html',
  styleUrl: './list-field-groups.scss'
})
export class ListFieldGroups implements OnInit{
    protected readonly displayedColumns: string[] = ['name', 'singleChoiceFieldCount', 'fieldCount'];
    protected readonly dataSource: WritableSignal<FieldGroup[]> = signal([]);
    protected readonly loading: WritableSignal<boolean> = signal(false);
    private readonly fieldGroupService: FieldGroupService = inject(FieldGroupService);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try{
      this.dataSource.set(await this.fieldGroupService.getAllFieldGroupsAsync());
    }
    finally{
      this.loading.set(false);
    }
  }
}
