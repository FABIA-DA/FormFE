import { Routes } from '@angular/router';
import {Home} from './home/home';
import { Forms } from './forms/forms';
import {AddFormField} from './add-form-field/add-form-field';
import {AddOneOfFormField} from './add-one-of-form-field/add-one-of-form-field';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'forms', component: Forms },
  { path: 'add-form-field', component: AddFormField },
  { path: 'add-one-of-form-field', component: AddOneOfFormField },
  { path: '**', redirectTo: 'home' }
];
