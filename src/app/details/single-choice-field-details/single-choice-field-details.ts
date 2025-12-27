import {Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {SingleChoiceField, SingleChoiceFieldService} from '../../../../core/service/single-choice-field-service';
import {SnackbarService} from '../../../../core/service/snackbar-service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {IdType} from '../../../../core/service/base-service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {
  SingleChoiceFieldPresentation
} from '../../../../core/shared/presentation/single-choice-field-presentation/single-choice-field-presentation';

@Component({
  selector: 'app-single-choice-field-details',
  standalone: true,
  imports: [
    MatProgressBar,
    MatFabButton,
    MatIcon,
    RouterLink,
    SingleChoiceFieldPresentation
  ],
  templateUrl: './single-choice-field-details.html',
  styleUrl: './single-choice-field-details.scss'
})
export class SingleChoiceFieldDetails implements OnInit, OnDestroy {
  protected readonly loading: WritableSignal<boolean> = signal(false);
  protected readonly singleChoiceField: WritableSignal<SingleChoiceField | undefined> = signal(undefined);
  private readonly singleChoiceFieldService: SingleChoiceFieldService = inject(SingleChoiceFieldService);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly subscriptions: Subscription[] = [];

  public ngOnInit(): void {
    this.subscriptions.push(this.activatedRoute.params.subscribe(async params => {
      const id: IdType | undefined = params['id'];
      if(id === undefined){
        this.singleChoiceField.set(undefined);
        return;
      }

      this.loading.set(true);
      try{
        this.singleChoiceField.set(await this.singleChoiceFieldService.getSingleChoiceFieldByIdAsync(id));
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
    const singleChoiceField: SingleChoiceField | undefined = this.singleChoiceField();
    if(singleChoiceField === undefined){
      return;
    }

    this.loading.set(true);
    try{
      await this.singleChoiceFieldService.deleteSingleChoiceFieldByIdAsync(singleChoiceField.id);
      this.snackbar.show('Single choice field was deleted successfully');
      await this.router.navigate(['list-single-choice-fields']);
    }
    finally{
      this.loading.set(false);
    }
  }
}
