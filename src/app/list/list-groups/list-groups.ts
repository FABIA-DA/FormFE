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
import {Group, GroupService} from '../../../../core/service/group-service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-list-groups',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderRow,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCell,
    RouterLink
  ],
  templateUrl: './list-groups.html',
  styleUrl: './list-groups.scss'
})
export class ListGroups implements OnInit {
  protected readonly displayedColumns: string[] = ['name', 'parentName', 'subgroupCount', 'formCount'];
  protected readonly dataSource: WritableSignal<Group[]> = signal([]);
  protected readonly loading: WritableSignal<boolean> = signal(false);
  private readonly groupService: GroupService = inject(GroupService);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try{
      this.dataSource.set(await this.groupService.getAllGroupsAsync());
    }
    finally{
      this.loading.set(false);
    }
  }
}
