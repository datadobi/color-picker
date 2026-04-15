import { css } from 'lit';
import './color-picker-color-slider.js';

/**
 * `<sl-slider>` selects a **saturation** and **lightness** value using a 2D slider.
 *
 * @memberof Vaadin.ColorPicker
 */
class SlSliderElement extends Vaadin.ColorPicker.ColorSliderElement {

  static styles = [
    super.styles,
    css`
      :host {
        height: calc(var(--color-slider-size) * 8);
        width: 100%;
      }
    `
  ];

  static get is() {
    return 'sl-slider';
  }

  static properties = {
    hue: { type: Number }
  };

  constructor() {
    super();
    this.hue = 0;

    this.enableX = true;
    this.minX = 0;
    this.maxX = 1;
    this.stepX = 0.01;

    this.enableY = true;
    this.minY = 1;
    this.maxY = 0;
    this.stepY = 0.01;

    this.style.height = 'calc(var(--color-slider-size) * 8)';
    this.style.width = '100%';

    this.renderCallback = this._renderSl();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('hue')) {
      this.renderCanvas();
    }
  }

  _renderSl() {
    return (canvas) => {
      const ctx = canvas.getContext('2d');
      const width = canvas.scrollWidth;
      const height = canvas.scrollHeight;

      const whiteBlackGradient = ctx.createLinearGradient(1, 1, 1, height - 1);
      whiteBlackGradient.addColorStop(0, 'white');
      whiteBlackGradient.addColorStop(1, 'black');

      const colorGradient = ctx.createLinearGradient(0, 0, width - 1, 0);
      colorGradient.addColorStop(0, `hsla(${this.hue || 0}, 100%, 50%, 0)`);
      colorGradient.addColorStop(1, `hsla(${this.hue || 0}, 100%, 50%, 1)`);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = whiteBlackGradient;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = colorGradient;
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
    };
  }
}

customElements.define(SlSliderElement.is, SlSliderElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.SlSliderElement = SlSliderElement;
