import { html, LitElement, css } from 'lit';
import '../components/color-picker-element-carousel.js';
import './color-picker-hex-input.js';
import './color-picker-rgba-input.js';
import './color-picker-hsla-input.js';
import '../utils/vaadin-disabled-property-mixin.js';
import '../utils/color-picker-has-color-value-mixin.js';

/**
 * `<color-picker-input>` shows HEX, RGBA and HSLA inputs in a carousel.
 *
 * @memberof Vaadin.ColorPicker
 */
class ColorPickerInputElement extends Vaadin.DisabledPropertyMixin(Vaadin.ColorPicker.HasColorValueMixin(LitElement)) {

  static styles = css`:host { display: block; }`;

  render() {
    return html`
      <element-carousel ?disabled="${this.disabled}"
                        .displayedElementIndex="${this._visibleInputIndex}"
                        @displayed-element-index-changed="${(e) => { this._onVisibleInputChanged(e.detail.value); }}"
                        ?pinned="${this.pinned}"
                        theme="${this.theme}">
        <hex-input color-input="hex"
                   .disableAlpha="${this.disableAlpha}"
                   ?disable-for-switch="${this.disableHex}"
                   ?disabled="${this.disabled}"
                   theme="${this.theme}"
                   .value="${this.value}"
                   @value-changed="${(e) => this._onInputValueChanged(e, 'hex')}">
        </hex-input>
        <rgba-input color-input="rgb"
                    .disableAlpha="${this.disableAlpha}"
                    ?disable-for-switch="${this.disableRgb}"
                    ?disabled="${this.disabled}"
                    .stepAlpha="${this.stepAlpha}"
                    theme="${this.theme}"
                    .value="${this.value}"
                    @value-changed="${(e) => this._onInputValueChanged(e, 'rgb')}">
        </rgba-input>
        <hsla-input color-input="hsl"
                    .disableAlpha="${this.disableAlpha}"
                    ?disable-for-switch="${this.disableHsl}"
                    ?disabled="${this.disabled}"
                    .step="${this.stepHsl}"
                    .stepAlpha="${this.stepAlpha}"
                    theme="${this.theme}"
                    .value="${this.value}"
                    @value-changed="${(e) => this._onInputValueChanged(e, 'hsl')}">
        </hsla-input>
      </element-carousel>
    `;
  }

  static get is() {
    return 'color-picker-input';
  }

  static properties = {
    theme: { type: String, reflect: true },
    pinned: { type: Boolean },
    disableHex: { type: Boolean },
    disableRgb: { type: Boolean },
    disableHsl: { type: Boolean },
    disableAlpha: { type: Boolean },
    stepAlpha: { type: Number },
    stepHsl: { type: Number },
    lastUsedFormat: { type: String },
    _visibleInputIndex: { type: Number, state: true }
  };

  constructor() {
    super();
    this.pinned = false;
    this.disableHex = false;
    this.disableRgb = false;
    this.disableHsl = false;
    this.disableAlpha = false;
    this.stepAlpha = 0.01;
    this.stepHsl = 1;
    this._visibleInputIndex = 0;
  }

  _onInputValueChanged(e, format) {
    if (e.detail.value !== this.value) {
      this.value = e.detail.value;
      this.lastUsedFormat = format;
      this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: this.value } }));
      this.dispatchEvent(new CustomEvent('last-used-format-changed', { detail: { value: format } }));
    }
  }

  _onVisibleInputChanged(index) {
    this._visibleInputIndex = index;
    const format = ['hex', 'rgb', 'hsl'][index];
    if (format) {
      this.lastUsedFormat = format;
      this.dispatchEvent(new CustomEvent('last-used-format-changed', { detail: { value: format } }));
    }
  }
}

customElements.define(ColorPickerInputElement.is, ColorPickerInputElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.ColorPickerInputElement = ColorPickerInputElement;
