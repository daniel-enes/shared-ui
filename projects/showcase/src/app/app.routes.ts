import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'multiple-forms',
        title: 'Multiple Forms',
        loadComponent: () => import('./features/register/multiple-forms-demo/multiple-forms-demo')
        .then(m => m.MultipleFormsDemo)
    },
    {
        path: 'register-form',
        title: 'Register Form',
        loadComponent: () => import('./features/register/register-form-demo/register-form-demo')
        .then(m => m.RegisterFormDemo)
    }
];
