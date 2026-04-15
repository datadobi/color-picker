import { css } from 'lit';
import './color-picker-color-slider.js';
import { TinyColor } from '@ctrl/tinycolor';

/**
 * `<alpha-slider>` selects an **alpha** value using a slider.
 *
 * @memberof Vaadin.ColorPicker
 */
class AlphaSliderElement extends Vaadin.ColorPicker.ColorSliderElement {

  static styles = [
    super.styles,
    css`
      :host {
        --responsive-canvas-background:
          conic-gradient(
            var(--color-picker-alpha-checkerboard-foreground-color, rgba(0,0,0,.2)) 90deg,
            var(--color-picker-alpha-checkerboard-background-color, #fff) 90deg 180deg,
            var(--color-picker-alpha-checkerboard-foreground-color, rgba(0,0,0,.2)) 180deg 270deg,
            var(--color-picker-alpha-checkerboard-background-color, #fff) 270deg
          )
          0 0 / var(--color-picker-alpha-checkerboard-tile-size, 1.125rem)
               var(--color-picker-alpha-checkerboard-tile-size, 1.125rem);
      }
    `
  ];

  static get is() {
    return 'alpha-slider';
  }

  static properties = {
    hue: { type: Number },
    value: { type: Number }
  };

  constructor() {
    super();
    this.hue = 0;
    this.value = 1;

    this.enableX = true;
    this.minX = 0;
    this.maxX = 1;
    this.stepX = 0.01;

    this.renderCallback = this._renderAlpha();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('hue') || changedProperties.has('value')) {
      this.renderCanvas();
    }
  }

  _renderAlpha() {
    return (canvas) => {
      const ctx = canvas.getContext('2d');
      const width = canvas.scrollWidth;
      const height = canvas.scrollHeight;
      const hsv = new TinyColor({ h: this.hue || 0, s: 1, v: this.value });

      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, hsv.clone().setAlpha(0).toRgbString());
      gradient.addColorStop(1, hsv.clone().setAlpha(1).toRgbString());

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };
  }
}

customElements.define(AlphaSliderElement.is, AlphaSliderElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.AlphaSliderElement = AlphaSliderElement;
