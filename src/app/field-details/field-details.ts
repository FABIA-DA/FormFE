import {Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {Field, FieldService} from '../../../core/service/field-service';
import {SnackbarService} from '../../../core/service/snackbar-service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {IdType} from '../../../core/service/base-service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon-module.d';

@Component({
  selector: 'app-field-details',
  imports: [
    MatProgressBar,
    MatFabButton,
    RouterLink,
    MatIcon
  ],
  templateUrl: './field-details.html',
  styleUrl: './field-details.scss'
})
export class FieldDetails implements OnInit, OnDestroy {
  protected readonly field: WritableSignal<Field | undefined> = signal(undefined);
  protected readonly loading: WritableSignal<boolean> = signal(false);
  private readonly fieldService: FieldService = inject(FieldService);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly subscriptions: Subscription[] = [];

  public ngOnInit(): void {
    this.subscriptions.push(this.activatedRoute.params.subscribe(async params => {
      const id: IdType | undefined = params['id'];
      if(id === undefined){
        this.field.set(undefined);
        return;
      }

      this.loading.set(true);
      try{
        this.field.set(await this.fieldService.getFieldByIdAsync(id));
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
    const field: Field | undefined = this.field();
    if(field === undefined){
      return;
    }

    this.loading.set(true);
    try{
      await this.fieldService.deleteFieldAsync(field.id);
      this.snackbar.show('Field was deleted successfully');
      await this.router.navigate(['/home']);
    }
    finally{
      this.loading.set(false);
    }
  }
}
