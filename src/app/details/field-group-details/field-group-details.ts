import {Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldGroup, FieldGroupService} from '../../../../core/service/field-group-service';
import {SnackbarService} from '../../../../core/service/snackbar-service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {IdType} from '../../../../core/service/base-service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {
  FieldGroupPresentation
} from '../../../../core/shared/presentation/field-group-presentation/field-group-presentation';

@Component({
  selector: 'app-field-group-details',
  standalone: true,
  imports: [
    MatProgressBar,
    MatFabButton,
    RouterLink,
    MatIcon,
    FieldGroupPresentation
  ],
  templateUrl: './field-group-details.html',
  styleUrl: './field-group-details.scss'
})
export class FieldGroupDetails implements OnInit,OnDestroy{
  protected readonly fieldGroup: WritableSignal<FieldGroup|undefined> = signal(undefined);
  protected readonly loading: WritableSignal<boolean> = signal(false);
  private readonly fieldGroupService: FieldGroupService = inject(FieldGroupService);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly subscriptions: Subscription[] = [];

  public ngOnInit(): void {
    this.subscriptions.push(this.activatedRoute.params.subscribe(async params => {
      const id: IdType | undefined = params['id'];
      if(id === undefined){
        this.fieldGroup.set(undefined);
        return;
      }

      this.loading.set(true);
      try{
        this.fieldGroup.set(await this.fieldGroupService.getFieldGroupByIdAsync(id));
      }
      finally{
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
    const fieldGroup: FieldGroup | undefined = this.fieldGroup();
    if(fieldGroup === undefined){
      return;
    }

    this.loading.set(true);
    try{
      await this.fieldGroupService.deleteFieldGroupByIdAsync(fieldGroup.id);
      this.snackbar.show('Field group was deleted successfully');
      await this.router.navigate(['/home']);
    }
    finally{
      this.loading.set(false);
    }
  }
}
