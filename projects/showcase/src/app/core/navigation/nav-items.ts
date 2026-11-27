export interface NavItem {

  label: string;

  path?: string;

  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [

  {
    label: 'nav.gettingStarted',
    children: [
      { label: 'nav.introduction', path: 'getting-started/introduction' },
      { label: 'nav.installation', path: 'getting-started/installation' },
      { label: 'nav.configuration', path: 'getting-started/configuration' },
      { label: 'nav.accessibility', path: 'getting-started/accessibility' },
    ],
  },

  {
    label: 'nav.components',
    children: [
      { label: 'nav.alerts', children: [{ label: 'nav.uiAlert', path: 'components/alerts/uialert' }] },
      { label: 'nav.buttons', children: [
        { label: 'nav.uiButton', path: 'components/buttons/uibutton' },
        { label: 'nav.uiButtonLink', path: 'components/buttons/uibutton-link' },
      ] },
      { label: 'nav.forms', children: [
        { label: 'nav.formInput', path: 'components/forms/form-input' },
        { label: 'nav.formTextarea', path: 'components/forms/form-textarea' },
        { label: 'nav.formSelect', path: 'components/forms/form-select' },
        { label: 'nav.formNumber', path: 'components/forms/form-number' },
        { label: 'nav.formDate', path: 'components/forms/form-date' },
        { label: 'nav.formTime', path: 'components/forms/form-time' },
        { label: 'nav.formDateTime', path: 'components/forms/form-date-time' },
        { label: 'nav.formCheckbox', path: 'components/forms/form-checkbox' },
        { label: 'nav.formRadioGroup', path: 'components/forms/form-radio-group' },
        { label: 'nav.formSwitch', path: 'components/forms/form-switch' },
        { label: 'nav.formFieldGroup', path: 'components/forms/form-field-group' },
        { label: 'nav.formFile', path: 'components/forms/form-file' },
        { label: 'nav.formAlert', path: 'components/forms/form-alert' },
        { label: 'nav.formContext', path: 'components/forms/form-context' },
      ] },
    ],
  },

  {
    label: 'nav.development',
    children: [
      { label: 'nav.testing', path: 'development/testing' },
      { label: 'nav.themes', path: 'development/themes' },
      { label: 'nav.customization', path: 'development/customization' },
    ],
  },

];
