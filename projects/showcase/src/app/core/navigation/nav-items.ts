export interface NavItem {

  label: string;

  path?: string;

  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [

  {
    label: 'Getting Started',
    children: [
      { label: 'Introduction', path: 'getting-started/introduction' },
      { label: 'Installation', path: 'getting-started/installation' },
      { label: 'Configuration', path: 'getting-started/configuration' },
      { label: 'Accessibility', path: 'getting-started/accessibility' },
    ],
  },

  {
    label: 'Components',
    children: [
      { label: 'Alerts', children: [{ label: 'UiAlert', path: 'components/alerts/uialert' }] },
      { label: 'Buttons', children: [
        { label: 'UiButton', path: 'components/buttons/uibutton' },
        { label: 'UiButtonLink', path: 'components/buttons/uibutton-link' },
      ] },
      { label: 'Forms', children: [
        { label: 'FormInput', path: 'components/forms/form-input' },
        { label: 'FormTextarea', path: 'components/forms/form-textarea' },
        { label: 'FormSelect', path: 'components/forms/form-select' },
        { label: 'FormNumber', path: 'components/forms/form-number' },
        { label: 'FormDate', path: 'components/forms/form-date' },
        { label: 'FormTime', path: 'components/forms/form-time' },
        { label: 'FormDateTime', path: 'components/forms/form-date-time' },
        { label: 'FormCheckbox', path: 'components/forms/form-checkbox' },
        { label: 'FormRadioGroup', path: 'components/forms/form-radio-group' },
        { label: 'FormSwitch', path: 'components/forms/form-switch' },
        { label: 'FormFieldGroup', path: 'components/forms/form-field-group' },
        { label: 'FormFile', path: 'components/forms/form-file' },
        { label: 'FormAlert', path: 'components/forms/form-alert' },
        { label: 'FormContextDirective', path: 'components/forms/form-context' },
      ] },
    ],
  },

  {
    label: 'Development',
    children: [
      { label: 'Testing', path: 'development/testing' },
      { label: 'Themes', path: 'development/themes' },
      { label: 'Customization', path: 'development/customization' },
    ],
  },

];
