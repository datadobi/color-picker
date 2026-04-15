import './color-picker-color-slider.js';

/**
 * `<hue-slider>` selects a **hue** value using a slider.
 *
 * @memberof Vaadin.ColorPicker
 */
class HueSliderElement extends Vaadin.ColorPicker.ColorSliderElement {

  static get is() {
    return 'hue-slider';
  }

  constructor() {
    super();
    this.enableX = true;
    this.minX = 0;
    this.maxX = 360;
    this.stepX = 1;
    this.renderCallback = this._renderHue();
  }

  _renderHue() {
    return (canvas) => {
      const ctx = canvas.getContext('2d');
      const width = canvas.scrollWidth;
      const height = canvas.scrollHeight;

      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      const step = 1 / 360;
      for (let i = 0; i <= 1; i += step) {
        gradient.addColorStop(i, `hsl(${360 * i}, 100%, 50%)`);
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };
  }
}

customElements.define(HueSliderElement.is, HueSliderElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.HueSliderElement = HueSliderElement;
