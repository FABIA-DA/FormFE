import {Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {Group, GroupService} from '../../../core/service/group-service';
import {SnackbarService} from '../../../core/service/snackbar-service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {IdType} from '../../../core/service/base-service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [
    MatProgressBar,
    MatIcon,
    MatFabButton,
    RouterLink
  ],
  templateUrl: './group-details.html',
  styleUrl: './group-details.scss'
})
export class GroupDetails implements OnInit, OnDestroy {
  protected readonly group: WritableSignal<Group | undefined> = signal(undefined);
  protected readonly loading: WritableSignal<boolean> = signal(false);
  private readonly groupService: GroupService = inject(GroupService);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly subscriptions: Subscription[] = [];

  public ngOnInit(): void {
    this.subscriptions.push(this.activatedRoute.params.subscribe(async params => {
      const id: IdType | undefined = params['id'];
      if(id === undefined){
        this.group.set(undefined);
        return;
      }

      this.loading.set(true);
      try{
        this.group.set(await this.groupService.getGroupByIdAsync(id));
      }
      finally {
        this.loading.set(false);
      }
    }));
  }

  public ngOnDestroy(): void {
    for(const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  protected async delete(): Promise<void> {
    const group: Group | undefined = this.group();
    if(group === undefined){
      return;
    }

    this.loading.set(true);
    try{
      await this.groupService.deleteGroupAsync(group.id);
      this.snackbar.show('Group was deleted successfully');
      await this.router.navigate(['/home']);
    }
    finally {
      this.loading.set(false);
    }
  }
}
