import { html, LitElement, css } from 'lit';
import '../utils/vaadin-disabled-property-mixin.js';

/**
 * `<responsive-canvas>` is a wrapper for the `<canvas>` element that automatically
 * sets the `width` and `height` of the canvas when it is resized.
 *
 * @memberof Vaadin.ColorPicker
 */
class ResponsiveCanvasElement extends Vaadin.DisabledPropertyMixin(LitElement) {

  static styles = css`
      :host {
        position: relative;
        background: var(--responsive-canvas-background, #fff);
        display: block;
        overflow: hidden;
      }

      :host([hidden]) {
        display: none !important;
      }

      [part="canvas"], ::slotted(*) {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: inherit;
      }

      :host([disabled]),
      :host([readonly]) {
        pointer-events: none;
      }

      :host([disabled]) {
        opacity: 0.3;
      }
    `;

  render() {
    return html`
      <canvas part="canvas" width="${this._width}" height="${this._height}"></canvas>
      <slot></slot>
    `;
  }

  static get is() {
    return 'responsive-canvas';
  }

  static properties = {
    renderCallback: { type: Object },
    _width: { type: Number, state: true },
    _height: { type: Number, state: true }
  };

  firstUpdated() {
    this._canvas = this.shadowRoot.querySelector('[part~="canvas"]');

    this._resizeObserver = new ResizeObserver(() => {
      if (!this.hasAttribute('hidden')) {
        this._refreshCanvas();
      }
    });
    this._resizeObserver.observe(this);

    this._hiddenObserver = new MutationObserver(mutations => {
      if (mutations.some(m => m.type === 'attributes') && !this.hasAttribute('hidden')) {
        this._refreshCanvas();
      }
    });
    this._hiddenObserver.observe(this, { attributes: true, attributeFilter: ['hidden'] });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    this._hiddenObserver?.disconnect();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('renderCallback')) {
      this._refreshCanvas();
    }
  }

  _refreshCanvas() {
    this._refreshCanvasSize();
    this.updateComplete.then(() => this.renderCanvas());
  }

  _refreshCanvasSize() {
    if (this._canvas) {
      this._width = this._canvas.scrollWidth;
      this._height = this._canvas.scrollHeight;
    }
  }

  renderCanvas() {
    if (this.renderCallback && this._canvas) {
      this.renderCallback(this._canvas);
    }
  }
}

customElements.define(ResponsiveCanvasElement.is, ResponsiveCanvasElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.ResponsiveCanvasElement = ResponsiveCanvasElement;
