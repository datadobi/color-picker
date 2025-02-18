import {ThemableMixin} from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import {ElementMixin} from '@vaadin/component-base/src/element-mixin.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import '../components/color-picker-responsive-canvas.js';
import '../utils/vaadin-disabled-property-mixin.js';
import '../utils/color-picker-utils.js';
import {IronResizableBehavior} from '@polymer/iron-resizable-behavior';
import {html, PolymerElement} from '@polymer/polymer';
import ColorPickerUtils from '../utils/color-picker-utils';

/**
 * `ColorSliderElement` is an extendable base class for all sliders regarding color.
 *
 * It allows to specify a render function to render the sliders background.
 *
 * @abstract
 * @memberof Vaadin.ColorPicker
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes Vaadin.DisabledPropertyMixin
 * @mixes Polymer.IronResizableBehavior
 */
class ColorSliderElement extends ElementMixin(ThemableMixin(mixinBehaviors([IronResizableBehavior], PolymerElement))) {
  static get template() {
    return html`
    <style include="color-picker-color-slider-styles">
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
    </style>

    <responsive-canvas disabled$="[[disabled]]"
                       part="canvas"
                       render-callback="[[renderCallback]]"></responsive-canvas>
    <span part="handle">
      <span part="background-reset"></span>
      <input disabled$="[[disabled]]" role="presentation" tabindex="-1" type="button">
      <span part="background"></span>
    </span>
  `;
  }

  static get is() {
    return 'color-slider';
  }

  static get version() {
    return '2.1.0-datadobi1';
  }

  static get properties() {
    return {
      /**
       * Enable the possibility to move the handle in the X-direction.
       */
      enableX: {
        type: Boolean,
        value: true
      },
      /**
       * Enable the possibility to move the handle in the Y-direction.
       */
      enableY: {
        type: Boolean,
        value: false
      },
      /**
       * The current X-value.
       */
      valueX: {
        type: Number,
        value: 0,
        notify: true
      },
      /**
       * The current Y-value.
       */
      valueY: {
        type: Number,
        value: 0,
        notify: true
      },
      /**
       * The lower bound of the X-value.
       */
      minX: {
        type: Number,
        value: 0
      },
      /**
       * The lower bound of the Y-value.
       */
      minY: {
        type: Number,
        value: 0
      },
      /**
       * The upper bound of the X-value.
       */
      maxX: {
        type: Number,
        value: 100
      },
      /**
       * The upper bound of the Y-value.
       */
      maxY: {
        type: Number,
        value: 100
      },
      /**
       * The steps that are added and removed to the current X-value if the slider handle is
       * moved.
       */
      stepX: {
        type: Number,
        value: 1
      },
      /**
       * The steps that are added and removed to the current Y-value if the slider handle is
       * moved.
       */
      stepY: {
        type: Number,
        value: 1
      },
      /**
       * The callback that is used to render the sliders background.
       */
      renderCallback: Function,
      _canvas: {
        type: Object,
        readOnly: true
      },
      _handle: {
        type: Object,
        readOnly: true
      }
    };
  }

  /**
   * @protected
   */
  ready() {
    super.ready();

    this._set_canvas(this.shadowRoot.querySelector('[part~="canvas"]'));
    this._set_handle(this.shadowRoot.querySelector('[part~="handle"]'));

    this._setupHandle();

    this._createPropertyObserver('renderCallback', 'onResize', true);
    this._createPropertyObserver('valueX', '_valueXChanged', true);
    this._createPropertyObserver('valueY', '_valueYChanged', true);
  }

  /**
   * @protected
   * */
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('iron-resize', this.onResize.bind(this));
  }

  /**
   * Render the sliders background on the canvas.
   */
  renderCanvas() {
    this._canvas.renderCanvas();
  }

  /**
   * Repositions the handler if resized.
   */
  onResize() {
    this._valueXChanged(this.valueX);
    this._valueYChanged(this.valueY);
  }

  /**
   * Setup the handle.
   * @private
   */
  _setupHandle() {
    const onMouseMove = (e) => {
      if (this.enableX) {
        const positionX = e.clientX - this._canvas.getBoundingClientRect().left;
        const x = ColorPickerUtils.limit(positionX, 0, this._canvas.scrollWidth);
        this.valueX = ColorPickerUtils.roundToNearest(
          ((this.maxX - this.minX) * (x / this._canvas.scrollWidth) + this.minX),
          this.stepX);
      }

      if (this.enableY) {
        const positionY = e.clientY - this._canvas.getBoundingClientRect().top;
        const y = ColorPickerUtils.limit(positionY, 0, this._canvas.scrollHeight);
        this.valueY = ColorPickerUtils.roundToNearest(
          ((this.maxY - this.minY) * (y / this._canvas.scrollHeight) + this.minY),
          this.stepY);
      }
    };

    const onTouchMove = (e) => {
      e.stopPropagation();

      // Translate to mouse event
      var mouseEvent = document.createEvent('MouseEvent');
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
        if (key === 37) {
          this._decreaseX();
        } else if (key === 38) {
          this._increaseY();
        } else if (key === 39) {
          this._increaseX();
        } else if (key === 40) {
          this._decreaseY();
        }
      } else if (this.enableX) {
        if (key === 37 || key === 40) {
          this._decreaseX();
        } else if (key === 39 || key === 38) {
          this._increaseX();
        }
      } else if (this.enableY) {
        if (key === 37 || key === 40) {
          this._decreaseY();
        } else if (key === 39 || key === 38) {
          this._increaseY();
        }
      }
    };

    this._handle.addEventListener('touchstart', onTouchStart);
    this._handle.addEventListener('mousedown', onMouseDown);
    this._handle.addEventListener('keydown', onKeyDown);
    this._canvas.addEventListener('touchstart', onTouchStart);
    this._canvas.addEventListener('mousedown', onMouseDown);
  }

  /**
   * Check if the upper bound is smaller than the lower bound on the X-axis.
   * @returns {boolean}
   * @private
   */
  _invertedX() {
    return this.maxX < this.minX;
  }

  /**
   * Check if the upper bound is smaller than the lower bound on the Y-axis.
   * @returns {boolean}
   * @private
   */
  _invertedY() {
    return this.maxY < this.minY;
  }

  /**
   * Increase the x-value depending on the fact whether the X-axis is inverted.
   * @private
   */
  _increaseX() {
    if (!this._invertedX()) {
      this.valueX = Math.min(this.maxX, this.valueX + this.stepX);
    } else {
      this.valueX = Math.min(this.minX, this.valueX + this.stepX);
    }
  }

  /**
   * Decrease the x-value depending on the fact whether the X-axis is inverted.
   * @private
   */
  _decreaseX() {
    if (!this._invertedX()) {
      this.valueX = Math.max(this.minX, this.valueX - this.stepX);
    } else {
      this.valueX = Math.max(this.maxX, this.valueX - this.stepX);
    }
  }

  /**
   * Increase the x-value depending on the fact whether the Y-axis is inverted.
   * @private
   */
  _increaseY() {
    if (!this._invertedY()) {
      this.valueY = Math.min(this.maxY, this.valueY + this.stepY);
    } else {
      this.valueY = Math.min(this.minY, this.valueY + this.stepY);
    }
  }

  /**
   * Decrease the x-value depending on the fact whether the Y-axis is inverted.
   * @private
   */
  _decreaseY() {
    if (!this._invertedY()) {
      this.valueY = Math.max(this.minY, this.valueY - this.stepY);
    } else {
      this.valueY = Math.max(this.maxY, this.valueY - this.stepY);
    }
  }

  /**
   * Reposition the handle if the X-value changed.
   * @param value the new value.
   * @private
   */
  _valueXChanged(value) {
    if (this.enableX) {
      this._handle.style.left = (this._canvas.scrollWidth)
        * ((value - this.minX) / (this.maxX - this.minX)) + 'px';
    }
  }

  /**
   * Reposition the handle if the Y-value changed.
   * @param value the new value.
   * @private
   */
  _valueYChanged(value) {
    if (this.enableY) {
      this._handle.style.top = (this._canvas.scrollHeight)
        * ((value - this.minY) / (this.maxY - this.minY)) + 'px';
    }
  }

  /**
   * The element to focus.
   * @returns {*|Vaadin.ColorPicker.ColorSliderElement}
   */
  get focusElement() {
    return this.shadowRoot.querySelector('input') || this;
  }
}

customElements.define(ColorSliderElement.is, ColorSliderElement);

/**
 * @namespace Vaadin.ColorPicker
 */
window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.ColorSliderElement = ColorSliderElement;

