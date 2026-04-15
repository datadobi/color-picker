import { LitElement } from 'lit';
import '../utils/vaadin-disabled-property-mixin.js';
import '../utils/color-picker-has-color-value-mixin.js';

/**
 * `ColorInputElement` is an abstract base class for all color inputs.
 *
 * Subclasses must set in their constructor:
 *   - `this._observedInputProperties` (array of property names)
 *   - `this._colorSupplier` (function returning a TinyColor)
 *   - `this._toInputConverter` (function converting TinyColor to input fields)
 *
 * @abstract
 * @memberof Vaadin.ColorPicker
 */
class ColorInputElement extends Vaadin.DisabledPropertyMixin(Vaadin.ColorPicker.HasColorValueMixin(LitElement)) {

  static get is() {
    return 'color-input';
  }

  static properties = {
    theme: { type: String, reflect: true },
    disableAlpha: { type: Boolean }
  };

  constructor() {
    super();
    this._observedInputProperties = [];
    this.disableAlpha = false;
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('value')) {
      this._updateInput();
    }

    if (this._observedInputProperties.some(p => changedProperties.has(p))) {
      this._updateColor();
    }
  }

  _updateInput() {
    if (!this._updatingColor) {
      this._updatingColor = true;
      if (this._toInputConverter) {
        this._toInputConverter(this.value);
      }
      this._updatingColor = false;
    }
  }

  _updateColor() {
    if (!this._updatingColor) {
      this._updatingColor = true;

      let color = this.value;
      try {
        color = this._colorSupplier();
      } catch (unused) {
        // invalid value — keep existing
      }

      if (color && color.isValid) {
        this.value = color;
        this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: this.value } }));
      }

      this._updatingColor = false;
    }
  }
}

customElements.define(ColorInputElement.is, ColorInputElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.ColorInputElement = ColorInputElement;
