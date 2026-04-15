import { html, css } from 'lit';
import '@vaadin/number-field';
import './color-picker-color-input.js';
import { TinyColor } from '@ctrl/tinycolor';
import { sharedStyles } from '../styles/shared-styles.js';
import ColorPickerUtils from '../utils/color-picker-utils';

/**
 * `<rgba-input>` allows inputting **rgba** color codes.
 *
 * @memberof Vaadin.ColorPicker
 */
class RgbaInputElement extends Vaadin.ColorPicker.ColorInputElement {

  static styles = [sharedStyles, css`
    :host { display: block; width: 100%; }
    :host([hidden]) { display: none !important; }
  `];

  render() {
    return html`
      <div class="horizontal-spacing">
        <vaadin-number-field ?disabled="${this.disabled}" label="R" max="255" min="0" minlength="1"
                             prevent-invalid-input step="1"
                             theme="color-value-text-field align-center ${this.theme}"
                             .value="${String(this.red)}"
                             @value-changed="${(e) => { this.red = e.detail.value; }}">
        </vaadin-number-field>
        <vaadin-number-field ?disabled="${this.disabled}" label="G" max="255" min="0" minlength="1"
                             prevent-invalid-input step="1"
                             theme="color-value-text-field align-center ${this.theme}"
                             .value="${String(this.green)}"
                             @value-changed="${(e) => { this.green = e.detail.value; }}">
        </vaadin-number-field>
        <vaadin-number-field ?disabled="${this.disabled}" label="B" max="255" min="0" minlength="1"
                             prevent-invalid-input step="1"
                             theme="color-value-text-field align-center ${this.theme}"
                             .value="${String(this.blue)}"
                             @value-changed="${(e) => { this.blue = e.detail.value; }}">
        </vaadin-number-field>
        <vaadin-number-field ?disabled="${this.disabled}"
                             ?hidden="${this.disableAlpha}"
                             label="A" max="1" min="0" minlength="1"
                             prevent-invalid-input
                             step="${this.stepAlpha}"
                             theme="color-value-text-field align-center ${this.theme}"
                             .value="${String(this.alpha)}"
                             @value-changed="${(e) => { this.alpha = e.detail.value; }}">
        </vaadin-number-field>
      </div>
    `;
  }

  static get is() {
    return 'rgba-input';
  }

  static properties = {
    red: { type: Number },
    green: { type: Number },
    blue: { type: Number },
    alpha: { type: Number },
    stepAlpha: { type: Number }
  };

  constructor() {
    super();
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.alpha = 1;
    this.stepAlpha = 0.01;

    this._observedInputProperties = ['red', 'green', 'blue', 'alpha'];

    this._colorSupplier = () => new TinyColor({
      r: parseFloat(this.red),
      g: parseFloat(this.green),
      b: parseFloat(this.blue)
    }).setAlpha(parseFloat(this.alpha));

    this._toInputConverter = color => {
      if (color) {
        const rgb = color.toRgb();
        this.red = rgb.r;
        this.green = rgb.g;
        this.blue = rgb.b;
        this.alpha = ColorPickerUtils.roundToNearest(color.getAlpha(), this.stepAlpha);
      } else {
        this.red = '';
        this.green = '';
        this.blue = '';
        this.alpha = '';
      }
    };
  }
}

customElements.define(RgbaInputElement.is, RgbaInputElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.RgbaInputElement = RgbaInputElement;
