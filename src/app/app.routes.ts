import { Routes } from '@angular/router';
import {Edit} from './edit/edit';
import {Home} from './home/home';
import { Forms } from './forms/forms';
import {Add} from './add/add';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'forms', component: Forms },
  { path: 'add', component: Add },
  { path: 'edit/:id', component: Edit },
  { path: '**', redirectTo: 'home' }
];
