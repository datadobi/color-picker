import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

// Inject compact sizing styles into Vaadin's built-in text/number fields
// when used with the "color-value-text-field" theme token.
registerStyles('vaadin-text-field', css`
  :host([theme~="color-value-text-field"]) {
    min-width: 0;
    width: 100%;
  }

  :host([theme~="color-value-text-field"]) [part="label"] {
    align-self: center;
  }

  :host([theme~="color-value-text-field"][theme~="small"][has-label]) {
    padding-top: var(--lumo-space-s, var(--vaadin-gap-s, 0.5rem));
  }
`);

registerStyles('vaadin-number-field', css`
  :host([theme~="color-value-text-field"]) {
    min-width: 0;
    width: 100%;
  }

  :host([theme~="color-value-text-field"]) [part="label"] {
    align-self: center;
  }

  :host([theme~="color-value-text-field"][theme~="small"][has-label]) {
    padding-top: var(--lumo-space-s, var(--vaadin-gap-s, 0.5rem));
  }
`);
