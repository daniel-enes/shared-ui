import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: '/en/docs/getting-started/introduction',
    pathMatch: 'full',
  },

  {
    path: ':lang',
    children: [

      {
        path: 'docs/getting-started/introduction',
        title: 'Introduction - shared-ui',
        loadComponent: () => import('./features/docs/getting-started/introduction/introduction-page')
          .then(m => m.IntroductionPage),
      },

      {
        path: 'docs/getting-started/installation',
        title: 'Installation - shared-ui',
        loadComponent: () => import('./features/docs/getting-started/installation/installation-page')
          .then(m => m.InstallationPage),
      },

      {
        path: 'docs/getting-started/configuration',
        title: 'Configuration - shared-ui',
        loadComponent: () => import('./features/docs/getting-started/configuration/configuration-page')
          .then(m => m.ConfigurationPage),
      },

      {
        path: 'docs/getting-started/accessibility',
        title: 'Accessibility - shared-ui',
        loadComponent: () => import('./features/docs/getting-started/accessibility/accessibility-page')
          .then(m => m.AccessibilityPage),
      },

      {
        path: 'docs/components/alerts/uialert',
        title: 'UiAlert - shared-ui',
        loadComponent: () => import('./features/docs/components/alerts/uialert/uialert-page')
          .then(m => m.UiAlertPage),
      },

      {
        path: 'docs/components/buttons/uibutton',
        title: 'UiButton - shared-ui',
        loadComponent: () => import('./features/docs/components/buttons/uibutton/uibutton-page')
          .then(m => m.UiButtonPage),
      },

      {
        path: 'docs/components/buttons/uibutton-link',
        title: 'UiButtonLink - shared-ui',
        loadComponent: () => import('./features/docs/components/buttons/uibutton-link/uibutton-link-page')
          .then(m => m.UiButtonLinkPage),
      },

      {
        path: 'docs/components/forms/form-input',
        title: 'FormInput - shared-ui',
        loadComponent: () => import('./features/docs/components/forms/form-input/form-input-page')
          .then(m => m.FormInputPage),
      },

      {
        path: 'docs/components/forms/form-textarea',
        title: 'FormTextarea - shared-ui',
        loadComponent: () => import('./features/docs/components/forms/form-textarea/form-textarea-page')
          .then(m => m.FormTextareaPage),
      },

    ],
  },

  {
    path: '**',
    redirectTo: '/en/docs/getting-started/introduction',
  },

];
