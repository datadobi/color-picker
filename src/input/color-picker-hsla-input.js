import { html, css } from 'lit';
import '@vaadin/number-field';
import './color-picker-color-input.js';
import { TinyColor } from '@ctrl/tinycolor';
import { sharedStyles } from '../styles/shared-styles.js';
import ColorPickerUtils from '../utils/color-picker-utils';

/**
 * `<hsla-input>` allows inputting **hsla** color codes.
 *
 * @memberof Vaadin.ColorPicker
 */
class HslaInputElement extends Vaadin.ColorPicker.ColorInputElement {

  static styles = [sharedStyles, css`
    :host { display: block; width: 100%; }
    :host([hidden]) { display: none !important; }
  `];

  render() {
    return html`
      <div class="horizontal-spacing">
        <vaadin-number-field ?disabled="${this.disabled}" label="H" max="360" min="0" minlength="1"
                             prevent-invalid-input
                             step="${this.step}"
                             theme="color-value-text-field align-center ${this.theme}"
                             .value="${String(this.hue)}"
                             @value-changed="${(e) => { this.hue = e.detail.value; }}">
          <div slot="suffix">°</div>
        </vaadin-number-field>
        <vaadin-number-field ?disabled="${this.disabled}" label="S" max="100" min="0" minlength="1"
                             prevent-invalid-input
                             step="${this.step}"
                             theme="color-value-text-field align-center ${this.theme}"
                             .value="${String(this.saturation)}"
                             @value-changed="${(e) => { this.saturation = e.detail.value; }}">
          <div slot="suffix">%</div>
        </vaadin-number-field>
        <vaadin-number-field ?disabled="${this.disabled}" label="L" max="100" min="0" minlength="1"
                             prevent-invalid-input
                             step="${this.step}"
                             theme="color-value-text-field align-center ${this.theme}"
                             .value="${String(this.lightness)}"
                             @value-changed="${(e) => { this.lightness = e.detail.value; }}">
          <div slot="suffix">%</div>
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
    return 'hsla-input';
  }

  static properties = {
    hue: { type: Number },
    saturation: { type: Number },
    lightness: { type: Number },
    alpha: { type: Number },
    stepAlpha: { type: Number },
    step: { type: Number }
  };

  constructor() {
    super();
    this.hue = 0;
    this.saturation = 100;
    this.lightness = 50;
    this.alpha = 1;
    this.stepAlpha = 0.01;
    this.step = 1;

    this._observedInputProperties = ['hue', 'saturation', 'lightness', 'alpha'];

    this._colorSupplier = () => new TinyColor({
      h: parseFloat(this.hue),
      s: parseFloat(this.saturation) / 100,
      l: parseFloat(this.lightness) / 100
    }).setAlpha(parseFloat(this.alpha));

    this._toInputConverter = color => {
      if (color) {
        const hsl = color.toHsl();
        this.hue = ColorPickerUtils.roundToNearest(hsl.h || 0, this.step);
        this.saturation = ColorPickerUtils.roundToNearest(hsl.s * 100, this.step);
        this.lightness = ColorPickerUtils.roundToNearest(hsl.l * 100, this.step);
        this.alpha = ColorPickerUtils.roundToNearest(color.getAlpha(), this.stepAlpha);
      } else {
        this.hue = '';
        this.saturation = '';
        this.lightness = '';
        this.alpha = '';
      }
    };
  }
}

customElements.define(HslaInputElement.is, HslaInputElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.HslaInputElement = HslaInputElement;
