import { html, LitElement, css } from 'lit';
import { TinyColor } from '@ctrl/tinycolor';
import './color-picker-sl-slider.js';
import './color-picker-hue-slider.js';
import './color-picker-alpha-slider.js';
import './color-picker-selected-color.js';
import '../utils/vaadin-disabled-property-mixin.js';
import '../utils/color-picker-has-color-value-mixin.js';
import { sharedStyles } from '../styles/shared-styles.js';

/**
 * `<color-picker-slider>` allows selecting a color using sliders.
 *
 * @memberof Vaadin.ColorPicker
 */
class ColorPickerSliderElement extends Vaadin.DisabledPropertyMixin(Vaadin.ColorPicker.HasColorValueMixin(LitElement)) {

  static styles = [sharedStyles, css`
      :host {
        display: flex;
      }

      :host > *, sl-slider {
        flex-grow: 1;
      }

      selected-color {
        flex-grow: 0 !important;
      }
    `];

  render() {
    return html`
      <div class="vertical-spacing">
        <sl-slider ?disabled="${this.disabled}"
                   ?hidden="${this.disableSl}"
                   .hue="${this._hue}"
                   .stepX="${this._stepSl()}"
                   .stepY="${this._stepSl()}"
                   theme="${this.theme}"
                   .valueX="${this._saturation}"
                   @value-x-changed="${(e) => { this._saturation = e.detail.value; this._sliderColorChanged(); }}"
                   .valueY="${this._value}"
                   @value-y-changed="${(e) => { this._value = e.detail.value; this._sliderColorChanged(); }}">
        </sl-slider>
        <div class="horizontal-spacing" style="align-self: stretch; align-items: center; flex-grow: 0;">
          <selected-color ?disabled="${this.disabled}"
                          .previousValue="${this.previousValue}"
                          .value="${this.value}"
                          @value-changed="${(e) => { this.value = e.detail.value; this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: this.value } })); }}">
          </selected-color>
          <div class="vertical-spacing">
            <hue-slider ?disabled="${this.disabled}"
                        .stepX="${this.stepHsl}"
                        theme="${this.theme}"
                        .valueX="${this._hue}"
                        @value-x-changed="${(e) => { this._hue = e.detail.value; this._sliderColorChanged(); }}">
            </hue-slider>
            <alpha-slider ?disabled="${this.disabled}"
                          ?hidden="${this.disableAlpha}"
                          .hue="${this._hue}"
                          .stepX="${this.stepAlpha}"
                          theme="${this.theme}"
                          .value="${this._value}"
                          .valueX="${this._alpha}"
                          @value-x-changed="${(e) => { this._alpha = e.detail.value; this._sliderColorChanged(); }}">
            </alpha-slider>
          </div>
        </div>
      </div>
    `;
  }

  static get is() {
    return 'color-picker-slider';
  }

  static properties = {
    theme: { type: String, reflect: true },
    previousValue: { type: Object },
    disableAlpha: { type: Boolean },
    disableSl: { type: Boolean },
    stepAlpha: { type: Number },
    stepHsl: { type: Number },
    _hue: { type: Number, state: true },
    _saturation: { type: Number, state: true },
    _value: { type: Number, state: true },
    _alpha: { type: Number, state: true }
  };

  constructor() {
    super();
    this.disableAlpha = false;
    this.disableSl = false;
    this.stepAlpha = 0.01;
    this.stepHsl = 1;
    this._hue = 0;
    this._saturation = 1;
    this._value = 1;
    this._alpha = 1;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('value')) {
      this._valueChanged();
    }
  }

  _sliderColorChanged() {
    this._colorChanged(() => {
      this.value = new TinyColor({ h: this._hue, s: this._saturation, v: this._value }).setAlpha(this._alpha);
      this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: this.value } }));
    });
  }

  _valueChanged() {
    this._colorChanged(() => {
      if (this.value) {
        const hsv = this.value.toHsv();
        // Only update hue when the color has saturation — for achromatic colors
        // (grey, black, white) TinyColor always returns h=0, which would snap the
        // hue slider back on every round-trip through the value binding.
        if (hsv.s > 0) {
          this._hue = hsv.h;
        }
        this._saturation = hsv.s;
        this._value = hsv.v;
        this._alpha = hsv.a;
      } else {
        this._hue = 0;
        this._saturation = 1;
        this._value = 1;
        this._alpha = 0;
      }
    });
  }

  _colorChanged(updateAction) {
    if (!this._updatingColor) {
      this._updatingColor = true;
      updateAction();
      this._updatingColor = false;
    }
  }

  _stepSl() {
    return this.stepHsl > 0.01 ? 0.01 : this.stepHsl;
  }
}

customElements.define(ColorPickerSliderElement.is, ColorPickerSliderElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.ColorPickerSliderElement = ColorPickerSliderElement;
