import { html, LitElement, css } from 'lit';
import '../components/color-picker-element-carousel.js';
import './color-picker-color-palette.js';
import '../utils/vaadin-disabled-property-mixin.js';
import '../utils/color-picker-has-color-value-mixin.js';

/**
 * `<color-picker-palette>` shows multiple color palettes in a carousel.
 *
 * @memberof Vaadin.ColorPicker
 */
class ColorPickerPaletteElement extends Vaadin.DisabledPropertyMixin(Vaadin.ColorPicker.HasColorValueMixin(LitElement)) {

  static styles = css`
      :host {
        display: block;
        --switch-button-alignment: flex-start;
      }
    `;

  render() {
    return html`
      <element-carousel ?disabled="${this.disabled}"
                        ?pinned="${this.pinned}"
                        theme="${this.theme}">
        ${(this.palettes || []).map(palette => html`
          <color-palette ?disabled="${this.disabled}"
                         .palette="${palette}"
                         theme="${this.theme}"
                         .value="${this.value}"
                         @value-changed="${(e) => { this.value = e.detail.value; this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: this.value } })); }}">
          </color-palette>
        `)}
      </element-carousel>
    `;
  }

  static get is() {
    return 'color-picker-palette';
  }

  static properties = {
    theme: { type: String, reflect: true },
    palettes: { type: Array },
    pinned: { type: Boolean }
  };

  constructor() {
    super();
    this.pinned = false;
    this.palettes = [];
  }
}

customElements.define(ColorPickerPaletteElement.is, ColorPickerPaletteElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.ColorPickerPaletteElement = ColorPickerPaletteElement;
