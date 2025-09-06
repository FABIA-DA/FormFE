import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatTabLabel} from '@angular/material/tabs';
import {Group, GroupService} from '../../../core/service/group-service';

@Component({
  selector: 'app-list-groups',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderRow,
    MatTabLabel,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCell
  ],
  templateUrl: './list-groups.html',
  styleUrl: './list-groups.scss'
})
export class ListGroups implements OnInit {
  protected readonly displayedColumns: string[] = ['name', 'parentName', 'subgroupCount', 'formCount'];
  protected readonly dataSource: WritableSignal<Group[]> = signal([]);
  private readonly groupService: GroupService = inject(GroupService);

  async ngOnInit(): Promise<void> {
    this.dataSource.set(await this.groupService.getAllGroupsAsync());
  }
}
