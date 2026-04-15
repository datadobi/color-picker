import { html, LitElement, css } from 'lit';
import './slider/color-picker-color-picker-slider.js';
import './input/color-picker-color-picker-input.js';
import './palette/color-picker-color-picker-palette.js';
import './utils/vaadin-disabled-property-mixin.js';
import ColorPickerUtils from './utils/color-picker-utils';
import { sharedStyles } from './styles/shared-styles.js';

/**
 * `<color-picker>` allows selecting a color using sliders, inputs or palettes.
 *
 * ```
 * <color-picker></color-picker>
 * ```
 *
 * @memberof Vaadin.ColorPicker
 * @demo demo/index.html
 */
class ColorPicker extends Vaadin.DisabledPropertyMixin(LitElement) {

  static styles = [sharedStyles, css`
      :host {
        display: block;
        max-width: 100%;

        --color-picker-size-m: 2.25rem;
        --color-picker-size-s: 1.75rem;
        --color-picker-spacing: var(--vaadin-gap-m, 1rem);
        --color-picker-alpha-checkerboard-foreground-color: var(--vaadin-border-color-secondary, rgba(0,0,0,.2));
        --color-picker-alpha-checkerboard-background-color: var(--vaadin-background-color, #fff);
        --color-picker-alpha-checkerboard-tile-size: calc(var(--color-picker-size-m) / 2);

        width: calc(var(--color-picker-size-m) * 9 + var(--color-picker-spacing) * 8);
      }

      :host([theme~="small"]) {
        --color-picker-spacing: var(--vaadin-gap-s, 0.5rem);
        width: calc(var(--color-picker-size-s) * 9 + var(--color-picker-spacing) * 8);
      }

      color-picker-input,
      color-picker-palette {
        flex-grow: 0 !important;
      }

      color-picker-input {
        margin-top: 0 !important;
      }
    `];

  render() {
    return html`
      <div class="vertical-spacing" style="align-items: stretch; min-height: 100%;">
        <color-picker-slider .disableAlpha="${this.disableAlpha}"
                             .disableSl="${this.disableSl}"
                             ?disabled="${this.disabled}"
                             .previousValue="${this._previousValueInternal}"
                             .stepAlpha="${this.stepAlpha}"
                             .stepHsl="${this.stepHsl}"
                             theme="${this.theme}"
                             .value="${this._valueInternal}"
                             @value-changed="${(e) => { this._valueInternal = e.detail.value; this._onValueInternalChanged(); }}">
        </color-picker-slider>
        <color-picker-input .disableAlpha="${this.disableAlpha}"
                            .disableHex="${this.disableHex}"
                            .disableHsl="${this.disableHsl}"
                            .disableRgb="${this.disableRgb}"
                            ?disabled="${this.disabled}"
                            ?hidden="${!this._showInputs()}"
                            .lastUsedFormat="${this.lastUsedFormat}"
                            @last-used-format-changed="${(e) => { this.lastUsedFormat = e.detail.value; }}"
                            ?pinned="${this.pinnedInputs}"
                            .stepAlpha="${this.stepAlpha}"
                            .stepHsl="${this.stepHsl}"
                            theme="${this.theme}"
                            .value="${this._valueInternal}"
                            @value-changed="${(e) => { this._valueInternal = e.detail.value; this._onValueInternalChanged(); }}">
        </color-picker-input>
        <color-picker-palette ?disabled="${this.disabled}"
                              ?hidden="${!this._showPalettes()}"
                              .palettes="${this._palettesInternal}"
                              ?pinned="${this.pinnedPalettes}"
                              theme="${this.theme}"
                              .value="${this._valueInternal}"
                              @value-changed="${(e) => { this._valueInternal = e.detail.value; this._onValueInternalChanged(); }}">
        </color-picker-palette>
      </div>
    `;
  }

  static get is() {
    return 'color-picker';
  }

  static properties = {
    /** Set to true to disable **hex** input. */
    disableHex: { type: Boolean, attribute: 'disable-hex' },
    /** Set to true to disable **rgb** input. */
    disableRgb: { type: Boolean, attribute: 'disable-rgb' },
    /** Set to true to disable **hsl** input. */
    disableHsl: { type: Boolean, attribute: 'disable-hsl' },
    /** Set to true to disable **alpha** input and slider. */
    disableAlpha: { type: Boolean, attribute: 'disable-alpha' },
    /** Set to true to disable **sl** slider. */
    disableSl: { type: Boolean, attribute: 'disable-sl' },
    /** Set to true to have all inputs always visible. */
    pinnedInputs: { type: Boolean, attribute: 'pinned-inputs' },
    /** Set to true to have all palettes always visible. */
    pinnedPalettes: { type: Boolean, attribute: 'pinned-palettes' },
    /** The color value as a CSS color string. */
    value: { type: String },
    /** The previous color value as a CSS color string. */
    previousValue: { type: String, attribute: 'previous-value' },
    /** The last used color format: 'hex', 'rgb', or 'hsl'. */
    lastUsedFormat: { type: String, attribute: 'last-used-format' },
    /** Array of color palettes (array of arrays of CSS color strings). */
    palettes: { type: Array },
    /** Precision step for alpha values. */
    stepAlpha: { type: Number, attribute: 'step-alpha' },
    /** Precision step for hsl values. */
    stepHsl: { type: Number, attribute: 'step-hsl' },
    /** Theme attribute, reflected to host for CSS selectors. */
    theme: { type: String, reflect: true },
    _valueInternal: { type: Object, state: true },
    _previousValueInternal: { type: Object, state: true },
    _palettesInternal: { type: Array, state: true }
  };

  constructor() {
    super();
    this.disableHex = false;
    this.disableRgb = false;
    this.disableHsl = false;
    this.disableAlpha = false;
    this.disableSl = false;
    this.pinnedInputs = false;
    this.pinnedPalettes = false;
    this.stepAlpha = 0.01;
    this.stepHsl = 1;
    this._palettesInternal = [];
  }

  firstUpdated() {
    const initialColor = this.value ? this.value : this.previousValue;
    if (initialColor) {
      this._valueInternal = ColorPickerUtils.getResolvedValue(this, initialColor);
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('value')) {
      this._onValueChanged();
    }
    if (changedProperties.has('previousValue')) {
      this._onPreviousValueChanged();
    }
    if (changedProperties.has('palettes')) {
      this._onPalettesChanged();
    }
  }

  _showPalettes() {
    return this._palettesInternal ? this._palettesInternal.length > 0 : false;
  }

  _showInputs() {
    return !(this.disableHex && this.disableRgb && this.disableHsl);
  }

  _onValueChanged() {
    if (!this.valueInternalChanged) {
      this.valueChanged = true;
      this._valueInternal = this.value
        ? ColorPickerUtils.getResolvedValue(this, this.value)
        : undefined;
      this.valueChanged = false;
    }
  }

  _onValueInternalChanged() {
    if (!this.valueChanged) {
      this.valueInternalChanged = true;
      this.value = this._valueInternal
        ? ColorPickerUtils.getFormattedColor(
            this._valueInternal,
            this.lastUsedFormat,
            this.stepAlpha,
            this['step' + (this.lastUsedFormat
              ? this.lastUsedFormat.charAt(0).toUpperCase() + this.lastUsedFormat.slice(1)
              : '')] || 1
          )
        : undefined;
      this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: this.value } }));
      this.valueInternalChanged = false;
    }
  }

  _onPreviousValueChanged() {
    this._previousValueInternal = this.previousValue
      ? ColorPickerUtils.getResolvedValue(this, this.previousValue)
      : undefined;
  }

  _onPalettesChanged() {
    this._palettesInternal = this.palettes
      ? this.palettes.map(palette =>
          palette.map(color => ColorPickerUtils.getResolvedValue(this, color))
        )
      : [];
  }
}

customElements.define(ColorPicker.is, ColorPicker);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.ColorPicker = ColorPicker;
