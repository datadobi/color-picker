import { html, css } from 'lit';
import { Checkbox } from '@vaadin/checkbox/src/vaadin-checkbox.js';
import ColorPickerUtils from '../utils/color-picker-utils';

/**
 * `<color-checkbox>` extends `<vaadin-checkbox>` for color selection.
 * The checkmark color is adjusted automatically for readability.
 *
 * @memberof Vaadin.ColorPicker
 */
class ColorCheckboxElement extends Checkbox {

  static styles = [
    super.styles,
    css`
        :host([checked]) {
          pointer-events: none;
        }

        [part="checkbox"] {
          border: 2px solid transparent;
          box-sizing: border-box;
        }

        [part="checkbox"],
        [part="color-backdrop"] {
          width: var(--color-picker-size-m, 2.25rem);
          height: var(--color-picker-size-m, 2.25rem);
          margin: var(--vaadin-gap-xs, 0.25rem) 0;
        }

        [part="checkbox"].show-border {
          border-color: var(--vaadin-border-color-secondary, rgba(0,0,0,.2));
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
          border-radius: var(--vaadin-radius-m, 0.25em);
          line-height: 1.2;
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

        :host([disabled]) [part="checkbox"],
        :host([disabled]) [part="color-backdrop"] {
          opacity: 0.2;
        }

        :host([theme~="small"]) [part="checkbox"],
        :host([theme~="small"]) [part="color-backdrop"] {
          width: var(--color-picker-size-s, 1.75rem);
          height: var(--color-picker-size-s, 1.75rem);
        }

        :host([theme~="small"]) [part="checkbox"]::after {
          top: 1.2em;
          left: 0.7em;
        }

        :host([theme~="small"][checked]) [part="checkbox"]::after {
          width: 0.9375em;
          height: 1.59375em;
        }
      `
    ];

  static get is() {
    return 'color-checkbox';
  }

  static properties = {
    color: { type: Object }
  };

  // Override render to inject the color-backdrop div
  render() {
    return html`
      <div class="vaadin-checkbox-container">
        <div part="checkbox" aria-hidden="true"></div>
        <slot name="input"></slot>
        <div part="label">
          <div part="color-backdrop"></div>
          <slot name="label"></slot>
          <div part="required-indicator" @click="${this._onRequiredIndicatorClick}"></div>
        </div>
        <div part="helper-text">
          <slot name="helper"></slot>
        </div>
        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
      <slot name="tooltip"></slot>
    `;
  }

  _toggleChecked(checked) {
    if (!this.checked) {
      super._toggleChecked(checked);
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('color')) {
      this._onColorChanged();
    }
  }

  _onColorChanged() {
    const element = this.shadowRoot.querySelector('[part="checkbox"]');
    if (!element) return;

    if (this.color) {
      element.style.background = this.color.toRgbString();
      element.style.color = ColorPickerUtils.getContrastColor(this.color);

      if (this.color.getLuminance() > 0.96) {
        element.classList.add('show-border');
      } else {
        element.classList.remove('show-border');
      }
    } else {
      element.style.background = null;
    }
  }
}

customElements.define(ColorCheckboxElement.is, ColorCheckboxElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.ColorCheckboxElement = ColorCheckboxElement;
