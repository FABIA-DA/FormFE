import {Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {Form, FormService} from '../../../../core/service/form-service';
import {SnackbarService} from '../../../../core/service/snackbar-service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {IdType} from '../../../../core/service/base-service';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormPresentation} from '../../../../core/shared/presentation/form-presentation/form-presentation';

@Component({
  selector: 'app-form-details',
  standalone: true,
  imports: [
    MatProgressBar,
    MatFabButton,
    MatIcon,
    RouterLink,
    FormPresentation
  ],
  templateUrl: './form-details.html',
  styleUrl: './form-details.scss'
})
export class FormDetails implements OnInit, OnDestroy{
  protected readonly form: WritableSignal<Form | undefined> = signal(undefined);
  protected readonly loading: WritableSignal<boolean> = signal(false);
  private readonly formService: FormService = inject(FormService);
  private readonly router: Router = inject(Router);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly subscriptions: Subscription[] = [];

  public ngOnInit(): void {
    this.subscriptions.push(this.activatedRoute.params.subscribe(async params => {
      const id: IdType | undefined = params['id'];
      if(id === undefined){
        this.form.set(undefined);
        return;
      }

      this.loading.set(true);
      try{
        this.form.set(await this.formService.getFormByIdAsync(id));
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

  protected async delete(): Promise<void>{
    const form: Form | undefined = this.form();
    if(form === undefined){
      return;
    }

    this.loading.set(true);
    try{
      await this.formService.deleteFormByIdAsync(form.id);
      this.snackbar.show('Form was deleted successfully');
      await this.router.navigate(['/home']);
    }
    finally{
      this.loading.set(false);
    }
  }
}
