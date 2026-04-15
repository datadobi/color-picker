import { html, LitElement, css } from 'lit';
import '../components/color-picker-responsive-canvas.js';
import '../utils/vaadin-disabled-property-mixin.js';
import '../utils/color-picker-utils.js';
import ColorPickerUtils from '../utils/color-picker-utils';

/**
 * `ColorSliderElement` is an extendable base class for all color sliders.
 *
 * @abstract
 * @memberof Vaadin.ColorPicker
 */
class ColorSliderElement extends Vaadin.DisabledPropertyMixin(LitElement) {

  static styles = css`
      :host {
        position: relative;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      :host([hidden]) {
        display: none;
      }

      :host([disabled]) {
        -webkit-tap-highlight-color: transparent;
        pointer-events: none;
      }

      [part="canvas"] {
        height: 100%;
        width: 100%;
        overflow: hidden;
      }

      [part="handle"] {
        box-sizing: border-box;
        position: absolute;
      }

      input[type="button"] {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: inherit;
        margin: 0;
      }

      /* Base theme styles */
      :host {
        --color-slider-size: calc(var(--color-picker-size-m, 2.25rem) / 2);
        --color-slider-handle-size: var(--color-slider-size);

        height: var(--color-slider-size);
        margin: calc(var(--vaadin-gap-xs, 0.25rem) / 2) 0;
      }

      :host([theme~="small"]) {
        --color-slider-size: calc(var(--color-picker-size-s, 1.75rem) / 2 + 1px);
      }

      [part="canvas"] {
        border-radius: var(--vaadin-radius-m, 0.25em);
      }

      [part="handle"] {
        width: var(--color-slider-size);
        height: var(--color-slider-size);
        margin-left: calc(var(--color-slider-handle-size) * -0.5);
        margin-top: calc(var(--color-slider-handle-size) * -0.5);
        top: calc(var(--color-slider-handle-size) / 2);
        left: calc(var(--color-slider-handle-size) / 2);
        box-shadow: var(--color-picker-shadow, 0 1px 2px 0 rgba(0,0,0,.2));
        border-radius: 50%;
        transition: transform .2s cubic-bezier(.12, .32, .54, 4);
        will-change: transform;
      }

      [part="background-reset"] {
        border-color: var(--vaadin-background-color, #fff);
      }

      [part="background"],
      [part="background-reset"] {
        width: 100%;
        height: 100%;
        border-radius: inherit;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: border-width 0.2s cubic-bezier(.12, .32, .54, 1), border-color 0.15s;
        will-change: border-width, border-color;
        border: calc(var(--color-slider-handle-size) / 2) solid var(--vaadin-background-color, #fff);
        box-sizing: border-box;
      }

      [part="handle"][active] [part="background"],
      [part="handle"][active] [part="background-reset"] {
        border-width: calc(var(--color-slider-handle-size) / 2 - 4px);
      }

      [part="handle"]::before {
        content: "test";
        color: transparent;
        display: inline-block;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        background-color: var(--vaadin-background-color, #fff);
        transform: scale(1.4);
        opacity: 0;
        transition: transform 0.1s, opacity 0.8s;
        will-change: transform, opacity;
      }

      [part="handle"][active]::before {
        transition-duration: 0.01s, 0.01s;
        transform: scale(0);
        opacity: 0.4;
      }

      [part="handle"][active] {
        transform: scale(1.2);
      }

      [part="handle"]::after {
        content: "";
        width: 0;
        height: 0;
        border: 3px solid var(--vaadin-focus-ring-color, #1676f3);
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        transition: 0.25s transform;
        will-change: transform;
        background-clip: content-box;
      }

      [part="handle"]:not([active]):hover::after {
        transform: translate(-50%, -50%) scale(1);
      }

      :host([focus-ring]) [part="handle"] {
        box-shadow: 0 0 0 3px color-mix(in oklab, var(--vaadin-focus-ring-color, #1676f3) 50%, transparent);
      }

      :host([disabled]) [part="handle"] {
        box-shadow: none;
      }

      :host([disabled]) [part="background"] {
        border-color: var(--vaadin-background-container, rgba(0,0,0,.05));
      }
    `;

  render() {
    return html`
      <responsive-canvas ?disabled="${this.disabled}"
                         part="canvas"
                         .renderCallback="${this.renderCallback}"></responsive-canvas>
      <span part="handle">
        <span part="background-reset"></span>
        <input ?disabled="${this.disabled}" role="presentation" tabindex="-1" type="button">
        <span part="background"></span>
      </span>
    `;
  }

  static get is() {
    return 'color-slider';
  }

  static properties = {
    theme: { type: String, reflect: true },
    enableX: { type: Boolean },
    enableY: { type: Boolean },
    valueX: { type: Number },
    valueY: { type: Number },
    minX: { type: Number },
    minY: { type: Number },
    maxX: { type: Number },
    maxY: { type: Number },
    stepX: { type: Number },
    stepY: { type: Number },
    renderCallback: { type: Object }
  };

  constructor() {
    super();
    this.enableX = true;
    this.enableY = false;
    this.valueX = 0;
    this.valueY = 0;
    this.minX = 0;
    this.minY = 0;
    this.maxX = 100;
    this.maxY = 100;
    this.stepX = 1;
    this.stepY = 1;
  }

  firstUpdated() {
    this._canvas = this.shadowRoot.querySelector('[part~="canvas"]');
    this._handle = this.shadowRoot.querySelector('[part~="handle"]');
    this._setupHandle();

    this._resizeObserver = new ResizeObserver(() => this.onResize());
    this._resizeObserver.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('renderCallback')) {
      this.onResize();
    }
    if (changedProperties.has('valueX')) {
      this._valueXChanged(this.valueX);
    }
    if (changedProperties.has('valueY')) {
      this._valueYChanged(this.valueY);
    }
  }

  renderCanvas() {
    this._canvas?.renderCanvas();
  }

  onResize() {
    this._valueXChanged(this.valueX);
    this._valueYChanged(this.valueY);
  }

  _setupHandle() {
    const onMouseMove = (e) => {
      if (this.enableX) {
        const positionX = e.clientX - this._canvas.getBoundingClientRect().left;
        const x = ColorPickerUtils.limit(positionX, 0, this._canvas.scrollWidth);
        const newValueX = ColorPickerUtils.roundToNearest(
          ((this.maxX - this.minX) * (x / this._canvas.scrollWidth) + this.minX),
          this.stepX);
        if (newValueX !== this.valueX) {
          this.valueX = newValueX;
          this.dispatchEvent(new CustomEvent('value-x-changed', { detail: { value: this.valueX } }));
        }
      }

      if (this.enableY) {
        const positionY = e.clientY - this._canvas.getBoundingClientRect().top;
        const y = ColorPickerUtils.limit(positionY, 0, this._canvas.scrollHeight);
        const newValueY = ColorPickerUtils.roundToNearest(
          ((this.maxY - this.minY) * (y / this._canvas.scrollHeight) + this.minY),
          this.stepY);
        if (newValueY !== this.valueY) {
          this.valueY = newValueY;
          this.dispatchEvent(new CustomEvent('value-y-changed', { detail: { value: this.valueY } }));
        }
      }
    };

    const onTouchMove = (e) => {
      e.stopPropagation();
      const mouseEvent = document.createEvent('MouseEvent');
      mouseEvent.initMouseEvent('mousemove', true, true, window, e.detail,
        e.touches[0].screenX, e.touches[0].screenY,
        e.touches[0].clientX, e.touches[0].clientY,
        false, false, false, false, 0, null);
      onMouseMove(mouseEvent);
    };

    const onMouseUp = () => {
      this._handle.removeAttribute('active');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    const onTouchEnd = () => {
      this._handle.removeAttribute('active');
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    const onMouseDown = (e) => {
      e.preventDefault();
      onMouseMove(e);
      this._handle.setAttribute('active', '');
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onTouchStart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onTouchMove(e);
      this._handle.setAttribute('active', '');
      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchend', onTouchEnd);
    };

    const onKeyDown = (e) => {
      const key = e.key || e.keyCode;
      if (key === 37 || key === 38 || key === 39 || key === 40) {
        e.preventDefault();
      }
      if (this.enableX && this.enableY) {
        if (key === 37) { this._decreaseX(); }
        else if (key === 38) { this._increaseY(); }
        else if (key === 39) { this._increaseX(); }
        else if (key === 40) { this._decreaseY(); }
      } else if (this.enableX) {
        if (key === 37 || key === 40) { this._decreaseX(); }
        else if (key === 39 || key === 38) { this._increaseX(); }
      } else if (this.enableY) {
        if (key === 37 || key === 40) { this._decreaseY(); }
        else if (key === 39 || key === 38) { this._increaseY(); }
      }
    };

    this._handle.addEventListener('touchstart', onTouchStart);
    this._handle.addEventListener('mousedown', onMouseDown);
    this._handle.addEventListener('keydown', onKeyDown);
    this._canvas.addEventListener('touchstart', onTouchStart);
    this._canvas.addEventListener('mousedown', onMouseDown);
  }

  _invertedX() { return this.maxX < this.minX; }
  _invertedY() { return this.maxY < this.minY; }

  _increaseX() {
    this.valueX = !this._invertedX()
      ? Math.min(this.maxX, this.valueX + this.stepX)
      : Math.min(this.minX, this.valueX + this.stepX);
    this.dispatchEvent(new CustomEvent('value-x-changed', { detail: { value: this.valueX } }));
  }

  _decreaseX() {
    this.valueX = !this._invertedX()
      ? Math.max(this.minX, this.valueX - this.stepX)
      : Math.max(this.maxX, this.valueX - this.stepX);
    this.dispatchEvent(new CustomEvent('value-x-changed', { detail: { value: this.valueX } }));
  }

  _increaseY() {
    this.valueY = !this._invertedY()
      ? Math.min(this.maxY, this.valueY + this.stepY)
      : Math.min(this.minY, this.valueY + this.stepY);
    this.dispatchEvent(new CustomEvent('value-y-changed', { detail: { value: this.valueY } }));
  }

  _decreaseY() {
    this.valueY = !this._invertedY()
      ? Math.max(this.minY, this.valueY - this.stepY)
      : Math.max(this.maxY, this.valueY - this.stepY);
    this.dispatchEvent(new CustomEvent('value-y-changed', { detail: { value: this.valueY } }));
  }

  _valueXChanged(value) {
    if (this.enableX && this._canvas) {
      this._handle.style.left = (this._canvas.scrollWidth)
        * ((value - this.minX) / (this.maxX - this.minX)) + 'px';
    }
  }

  _valueYChanged(value) {
    if (this.enableY && this._canvas) {
      this._handle.style.top = (this._canvas.scrollHeight)
        * ((value - this.minY) / (this.maxY - this.minY)) + 'px';
    }
  }

  get focusElement() {
    return this.shadowRoot.querySelector('input') || this;
  }
}

customElements.define(ColorSliderElement.is, ColorSliderElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.ColorSliderElement = ColorSliderElement;
