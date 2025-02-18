import {html, PolymerElement} from '@polymer/polymer';
import {ThemableMixin} from '@vaadin/vaadin-themable-mixin';
import {ElementMixin} from '@vaadin/component-base';
import '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import '@vaadin/button/src/vaadin-button.js';
import '../utils/vaadin-disabled-property-mixin.js';
import {FlattenedNodesObserver} from '@polymer/polymer/lib/utils/flattened-nodes-observer';
import ColorPickerUtils from '../utils/color-picker-utils';

/**
 * `<element-carousel>` allows to switch between elements and display one of them at a time.
 * Additionally all elements can be displayed at once.
 *
 * ```
 * <element-carousel>
 *   <div>Content 1</div>
 *   <div>Content 2</div>
 *   <div>Content 3</div>
 * <element-carousel>
 * ```
 *
 * If an element has the attribute `disable-for-switch` it will be hidden and ignored in the
 * carousel. This is useful if using the e.g. with `<dom-repeat>` as it is rendered inside
 * the carousel.
 *
 * ```
 * <element-carousel>
 *   <dom-repeat items="{{items}}" disable-for-switch>
 *     <template>
 *       <div>[[index]]</div>
 *     </template>
 *   </dom-repeat>
 * <element-carousel>
 * ```
 *
 * @memberof Vaadin.ColorPicker
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes Vaadin.DisabledPropertyMixin
 */

class ElementCarouselElement extends ElementMixin(ThemableMixin(Vaadin.DisabledPropertyMixin(PolymerElement))) {

  static get template() {
    return html`
    <style include="color-picker-shared-styles">
      [part="switch-button"] {
        flex-grow: 0 !important;
        align-self: var(--switch-button-alignment, flex-end);
        padding: 0;
      }
      #slot,
      #slot::slotted(*:not([hidden])) {
      display: block;
      }
      </style>
      <div class="horizontal-spacing" style="min-width: 100%;align-items: flex-start">
        <slot id="slot" spacing$="[[spacing]]"></slot>
      <vaadin-button disabled$="[[disabled]]"
                     hidden$="[[!_showSwitchButton]]"
                     on-click="_displayNextElement"
                     part="switch-button"
                     theme$="icon [[theme]]">
        <vaadin-icon icon="vaadin:sort" slot="prefix"></vaadin-icon>
      </vaadin-button>
    </div>
 `;
  }

  static get is() {
    return 'element-carousel';
  }

  static get version() {
    return '2.1.0-datadobi1';
  }

  static get properties() {
    return {
      /**
       * Switch between showing all elements at once or just a single element.
       */
      pinned: {
        type: Boolean,
        value: false,
        observer: '_refreshElementVisibility'
      },
      /**
       * The index of the currently displayed element.
       */
      displayedElementIndex: {
        type: Number,
        value: 0,
        notify: true,
        readOnly: true
      },
      /**
       * @private
       */
      _slotElements: {
        type: Array,
        observer: '_refreshElementVisibility'
      },
      /**
       * @private
       */
      _showSwitchButton: {
        type: Boolean,
        value: false
      }
    };
  }

  /**
   * @protected
   */
  connectedCallback() {
    super.connectedCallback();

    this._enabledMutationObserver = new MutationObserver(mutations => {
      if (mutations.filter(mutation => mutation.type === 'attributes').length > 0) {
        this._refreshElementVisibility();
      }
    });

    this._slotObserver = new FlattenedNodesObserver(this.$.slot, () => {
      this._enabledMutationObserver.disconnect();

      this._slotElements = this.$.slot.assignedNodes().filter(n => n.nodeType === Node.ELEMENT_NODE);

      this._slotElements.forEach(element => {
        this._enabledMutationObserver.observe(element, {
          attributes: true,
          attributeFilter: ['disable-for-switch']
        });
      });
    });
  }

  /**
   * @protected
   */
  disconnectedCallback() {
    super.disconnectedCallback();

    this._slotObserver.disconnect();
    this._enabledMutationObserver.disconnect();
  }

  /**
   * Refreshes the visibility of the elements.
   *
   * @private
   */
  _refreshElementVisibility() {
    this._displayIndex(this.displayedElementIndex);
  }

  /**
   * Try to display the element at the given index.
   * If the element at the index is not relevant, increase the index until an element to be
   * displayed is found.
   *
   * @param index The index of the element to display
   * @private
   */
  _displayIndex(index) {
    if (!(this._slotElements && this._slotElements.length)) {
      return;
    }

    this._slotElements.forEach(element => {
      ColorPickerUtils.conditionallySetAttribute(element, !(this.pinned && this._isElementRelevant(element)), 'hidden');
    });

    const enabledElementsCount = this._slotElements.filter(element => this._isElementRelevant(element)).length;
    if (!enabledElementsCount > 0) {
      return;
    }

    let elementIndex = index % this._slotElements.length;
    while (!this._isElementRelevant(this._slotElements[elementIndex])) {
      elementIndex = (elementIndex + 1) % this._slotElements.length;
    }

    this._slotElements[elementIndex].removeAttribute('hidden');
    this._setDisplayedElementIndex(elementIndex);
    this._showSwitchButton = !this.pinned && enabledElementsCount > 1;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Check if an element is enabled for the carousel.
   * @param element The element to check
   * @returns {boolean} `true` if the element is relevant, `false` else
   * @private
   */
  _isElementRelevant(element) {
    return !element.hasAttribute('disable-for-switch');
  }

  /**
   * Shows the next element in the carousel.
   * @private
   */
  _displayNextElement() {
    this._displayIndex(this.displayedElementIndex + 1);
  }
}

customElements.define(ElementCarouselElement.is, ElementCarouselElement);

/**
 * @namespace Vaadin.ColorPicker
 */
window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.ElementCarouselElement = ElementCarouselElement;
