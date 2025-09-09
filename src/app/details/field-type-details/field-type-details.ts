import {Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldType, FieldTypeService} from '../../../../core/service/field-type-service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {IdType} from '../../../../core/service/base-service';
import {SnackbarService} from '../../../../core/service/snackbar-service';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressBar} from '@angular/material/progress-bar';
import {FieldTypePresentation} from '../../../../core/shared/presentation/field-type-presentation/field-type-presentation';

@Component({
  selector: 'app-field-type-details',
  standalone: true,
  imports: [
    MatFabButton,
    MatIcon,
    RouterLink,
    MatProgressBar,
    FieldTypePresentation
  ],
  templateUrl: './field-type-details.html',
  styleUrl: './field-type-details.scss'
})
export class FieldTypeDetails implements OnInit, OnDestroy{
  protected readonly loading: WritableSignal<boolean> = signal(false);
  protected readonly fieldType: WritableSignal<FieldType | undefined> = signal(undefined);
  private readonly fieldTypeService: FieldTypeService = inject(FieldTypeService);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly subscriptions: Subscription[] = [];

  public ngOnInit(): void {
    this.subscriptions.push(this.activatedRoute.params.subscribe(async params => {
      const id: IdType | undefined = params['id'];
      if(id === undefined){
        this.fieldType.set(undefined);
        return;
      }

      this.loading.set(true);
      try{
        this.fieldType.set(await this.fieldTypeService.getFieldTypeByIdAsync(id));
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
    const fieldType: FieldType | undefined = this.fieldType();
    if(fieldType === undefined){
      return;
    }

    this.loading.set(true);
    try{
      await this.fieldTypeService.deleteFieldTypeAsync(fieldType.id);
      this.snackbar.show('Field Type was successfully deleted');
      await this.router.navigate(['/home']);
    }
    finally{
      this.loading.set(false);
    }
  }
}
