import { html, css } from 'lit';
import '@vaadin/text-field';
import './color-picker-color-input.js';
import { TinyColor } from '@ctrl/tinycolor';

/**
 * `<hex-input>` allows inputting a **hex** color code.
 *
 * @memberof Vaadin.ColorPicker
 */
class HexInputElement extends Vaadin.ColorPicker.ColorInputElement {

  static styles = css`
    :host { display: block; }
    :host([hidden]) { display: none !important; }
  `;

  render() {
    return html`
      <vaadin-text-field autocomplete="on"
                         clear-button-visible
                         ?disabled="${this.disabled}"
                         error-message="Not a valid hex color."
                         label="HEX"
                         pattern="${this._getPattern()}"
                         theme="color-value-text-field ${this.theme}"
                         .value="${this.hex}"
                         @focus="${() => { this._editing = true; }}"
                         @blur="${() => { this._editing = false; this._updateInput(); }}"
                         @value-changed="${(e) => { this.hex = e.detail.value; }}">
        <div slot="prefix">#</div>
      </vaadin-text-field>
    `;
  }

  static get is() {
    return 'hex-input';
  }

  static get version() {
    return '2.1.0-datadobi1';
  }

  static properties = {
    hex: { type: String }
  };

  constructor() {
    super();
    this.hex = '000000';
    this._editing = false;
    this._observedInputProperties = ['hex'];
    this._colorSupplier = () => new TinyColor('#' + this.hex);
    this._toInputConverter = color => {
      // Don't overwrite the field while the user is actively typing in it.
      // The display is synced to the current value on blur instead.
      if (this._editing) return;
      this.hex = color ? (color.getAlpha() === 1 ? color.toHex() : color.toHex8()) : '';
    };
  }

  _getPattern() {
    return this.disableAlpha
      ? '([a-fA-F0-9]{3}|([a-fA-F0-9]{2}){2,3})'
      : '([a-fA-F0-9]{3}|([a-fA-F0-9]{2}){2,4})';
  }
}

customElements.define(HexInputElement.is, HexInputElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.HexInputElement = HexInputElement;
