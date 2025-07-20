import {inject, Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Duration} from '@js-joda/core';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private readonly snackbar: MatSnackBar = inject(MatSnackBar);

  public show(message: string): void{
    this.snackbar.open(message, 'Close', {
      duration: Duration.ofSeconds(3).toMillis(),
      horizontalPosition: "center",
      verticalPosition: "top"
    });
  }
}
