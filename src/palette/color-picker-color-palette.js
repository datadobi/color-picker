import { html, LitElement, css } from 'lit';
import '../utils/vaadin-disabled-property-mixin.js';
import '../utils/color-picker-has-color-value-mixin.js';
import './color-picker-color-checkbox.js';
import { TinyColor } from '@ctrl/tinycolor';
import { sharedStyles } from '../styles/shared-styles.js';

/**
 * `<color-palette>` shows a set of colors that can be selected.
 *
 * @memberof Vaadin.ColorPicker
 */
class ColorPaletteElement extends Vaadin.DisabledPropertyMixin(Vaadin.ColorPicker.HasColorValueMixin(LitElement)) {

  static styles = [sharedStyles, css`
      :host {
        width: 100%;
      }

      [part="container"] {
        flex-wrap: wrap;
        justify-content: flex-start;
      }

      [part="container"] > * {
        flex-grow: 0 !important;
      }
    `];

  render() {
    return html`
      <div class="horizontal-spacing" part="container">
        ${(this.palette || []).map((color, index) => html`
          <color-checkbox ?checked="${this._isSelected(color)}"
                          .color="${color}"
                          ?disabled="${this.disabled}"
                          @click="${() => { this._setColorFromPalette(color); }}"
                          theme="${this.theme}"
                          value="${index}">
          </color-checkbox>
        `)}
      </div>
    `;
  }

  static get is() {
    return 'color-palette';
  }

  static properties = {
    theme: { type: String, reflect: true },
    palette: { type: Array }
  };

  _setColorFromPalette(color) {
    this.value = color;
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: this.value } }));
  }

  _isSelected(color) {
    return color && this.value
      && new TinyColor(color).toRgbString() === new TinyColor(this.value).toRgbString();
  }
}

customElements.define(ColorPaletteElement.is, ColorPaletteElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.ColorPaletteElement = ColorPaletteElement;
