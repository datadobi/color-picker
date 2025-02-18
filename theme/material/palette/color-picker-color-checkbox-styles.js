import "@vaadin/checkbox/theme/material/vaadin-checkbox.js";

import {html} from '@polymer/polymer';

const $_documentContainer = html`
<dom-module id="material-color-checkbox" theme-for="color-checkbox">
  <template>
    <style>
      :host([checked]) {
        pointer-events: none;
      }

      [part="checkbox"] {
        border: 2px solid transparent;
        box-sizing: border-box;
      }

      [part="checkbox"],
      [part="color-backdrop"] {
        width: 36px;
        height: 36px;
        margin: 4px 0;
        border-radius: 4px;
        box-shadow: none;
      }

      [part="checkbox"].show-border {
        border-color: var(--material-secondary-text-color);
      }

      [part="checkbox"]::after {
        border-width: 0.375em 0 0 0.375em;
        top: calc(1.65em - 2px);
        left: calc(0.95em - 2px);
        color: inherit;
        border-color: currentColor;
      }

      :host([checked]) [part="checkbox"]::after {
        width: 1.25em;
        height: 2.125em;
      }

      label {
        position: relative;
      }

      [part="color-backdrop"] {
        position: absolute;
        top: 0;
        left: 0;
        line-height: 1.2;

        @apply --color-picker-alpha-checkerboard-background-style;
      }

      :host([active]) [part="color-backdrop"] {
        transform: scale(0.9);
        transition-duration: 0.05s;
      }

      :host([active][checked]) [part="color-backdrop"] {
        transform: scale(1.1);
      }

      :host([active]:not([checked])) [part="checkbox"]::before {
        opacity: 0.6;
      }

      :host([checked]) [part="checkbox"]::before {
        background-color: inherit;
      }

      :host([disabled]) [part="checkbox"],
      :host([disabled]) [part="color-backdrop"] {
        opacity: 0.2;
      }
    </style>
  </template>
</dom-module>
`;
document.head.appendChild($_documentContainer.content);
