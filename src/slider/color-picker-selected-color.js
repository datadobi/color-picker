import { html, LitElement, css } from 'lit';
import '@vaadin/icon';
import '../utils/vaadin-disabled-property-mixin.js';
import '../utils/color-picker-has-color-value-mixin.js';
import '../components/color-picker-responsive-canvas.js';
import { TinyColor } from '@ctrl/tinycolor';
import ColorPickerUtils from '../utils/color-picker-utils';

/**
 * `<selected-color>` shows the selected color and optionally a previous color.
 * Clicking the previous color resets to it.
 *
 * @memberof Vaadin.ColorPicker
 */
class SelectedColorElement extends Vaadin.DisabledPropertyMixin(Vaadin.ColorPicker.HasColorValueMixin(LitElement)) {

  static styles = css`
      :host {
        position: relative;
        display: block;
      }

      [part="previous-color-canvas"],
      [part="selected-color-canvas"] {
        position: absolute;
        height: 100%;
      }

      [part="selected-color-canvas"] {
        width: 100%;
        left: 0;
      }

      [part="previous-color-canvas"] {
        width: 50%;
        right: 0;
      }

      [part="previous-icon"] {
        opacity: 0;
      }

      [part="halo"] {
        position: absolute;
        width: 100%;
        height: 100%;
        color: transparent;
        opacity: 0;
      }

      :host([has-previous-value]:hover) [part="previous-color-canvas"] {
        width: 100%;
      }

      :host([has-previous-value]:hover) [part="previous-icon"] {
        opacity: 1;
      }

      /* Base theme styles */
      :host {
        --color-picker-selected-color-box-shadow: var(--color-picker-shadow, 0 1px 2px 0 rgba(0,0,0,.2));

        width: var(--color-picker-size-m, 2.25rem);
        height: var(--color-picker-size-m, 2.25rem);
        box-shadow: var(--color-picker-selected-color-box-shadow);
        margin: var(--vaadin-gap-xs, 0.25rem) 0;
        border-radius: 50%;
      }

      :host([disabled]) {
        pointer-events: none;
        box-shadow: none;
      }

      :host([disabled])::after {
        position: absolute;
        content: '';
        background: var(--vaadin-background-container-strong, rgba(0,0,0,.1));
        box-sizing: border-box;
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }

      [part="previous-color-canvas"],
      [part="selected-color-canvas"] {
        transition: width .2s cubic-bezier(.12, .32, .54, 1), border-radius .2s cubic-bezier(.12, .32, .54, 1);
        will-change: width, border-radius;
      }

      [part="selected-color-canvas"] {
        border-radius: 50%;
      }

      [part="previous-color-canvas"] {
        border-top-right-radius: 100% 50%;
        border-bottom-right-radius: 100% 50%;
      }

      [part="previous-icon"] {
        padding: 8px;
        box-sizing: border-box;
        transform: scale(0);
        transition: opacity .4s, transform .2s cubic-bezier(.12, .32, .54, 2);
        will-change: opacity, transform;
      }

      [part="halo"] {
        border-radius: 50%;
        transform: scale(1.4);
        transition: transform 0.1s, opacity 0.8s;
        will-change: transform, opacity;
      }

      :host([has-previous-value]:hover) [part="previous-color-canvas"] {
        border-radius: 50%;
      }

      :host([has-previous-value]:hover) [part="previous-icon"] {
        transform: scale(1);
      }

      :host([has-previous-value]:hover:active) [part="previous-icon"] {
        transform: scale(1.15);
      }

      :host([has-previous-value]:active) [part="halo"] {
        transition-duration: 0.01s, 0.01s;
        transform: scale(0);
        opacity: 0.4;
      }
    `;

  render() {
    return html`
      <span part="halo"></span>
      <responsive-canvas ?disabled="${this.disabled}"
                         part="selected-color-canvas"
                         .renderCallback="${this._renderSelectedColor()}">
      </responsive-canvas>
      <responsive-canvas ?disabled="${this.disabled}"
                         ?hidden="${!this._showSelectPreviousValue()}"
                         @click="${this._resetToPreviousValue}"
                         part="previous-color-canvas"
                         .renderCallback="${this._renderPreviousColor()}">
        <vaadin-icon icon="vaadin:check" part="previous-icon"></vaadin-icon>
      </responsive-canvas>
    `;
  }

  static get is() {
    return 'selected-color';
  }

  static properties = {
    previousValue: { type: Object },
    hasPreviousValue: { type: Boolean, reflect: true, attribute: 'has-previous-value' }
  };

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('previousValue') || changedProperties.has('value')) {
      this.hasPreviousValue = this._showSelectPreviousValue();
    }

    if (changedProperties.has('previousValue')) {
      const previousIcon = this.shadowRoot.querySelector('[part="previous-icon"]');
      const halo = this.shadowRoot.querySelector('[part="halo"]');
      if (previousIcon && halo) {
        previousIcon.style.color = this.previousValue
          ? ColorPickerUtils.getContrastColor(this.previousValue)
          : 'transparent';
        halo.style.backgroundColor = this.previousValue
          ? this.previousValue.toRgbString()
          : 'transparent';
      }
    }
  }

  _showSelectPreviousValue() {
    return this.previousValue !== undefined && this.previousValue !== null
      && this.previousValue.toRgbString() !== (this.value !== undefined && this.value !== null
        ? this.value.toRgbString()
        : undefined);
  }

  _renderSelectedColor() {
    return (canvas) => SelectedColorElement._renderColor(canvas, this.value);
  }

  _renderPreviousColor() {
    return (canvas) => SelectedColorElement._renderColor(canvas, this.previousValue);
  }

  _resetToPreviousValue() {
    this.value = this.previousValue;
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: this.value } }));
  }

  static _renderColor(canvas, color) {
    const ctx = canvas.getContext('2d');
    const width = canvas.scrollWidth;
    const height = canvas.scrollHeight;

    ctx.clearRect(0, 0, width, height);

    if (color) {
      ctx.fillStyle = new TinyColor(color).toRgbString();
      ctx.fillRect(0, 0, width, height);
    }
  }
}

customElements.define(SelectedColorElement.is, SelectedColorElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.SelectedColorElement = SelectedColorElement;
