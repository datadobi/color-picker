import { html, LitElement, css } from 'lit';
import '@vaadin/button';
import '@vaadin/icon';
import '@vaadin/icons';
import '../utils/vaadin-disabled-property-mixin.js';
import ColorPickerUtils from '../utils/color-picker-utils';
import { sharedStyles } from '../styles/shared-styles.js';

/**
 * `<element-carousel>` switches between slotted elements, showing one at a time.
 * When `pinned` is true, all elements are shown simultaneously.
 *
 * @memberof Vaadin.ColorPicker
 */
class ElementCarouselElement extends Vaadin.DisabledPropertyMixin(LitElement) {

  static styles = [sharedStyles, css`
    :host {
      display: block;
    }

    [part="switch-button"] {
      flex-grow: 0 !important;
      align-self: var(--switch-button-alignment, flex-end);
      padding: 0;
    }

    #slot {
      display: block;
      flex: 1;
      min-width: 0;
    }

    #slot::slotted(*:not([hidden])) {
      display: block;
    }
  `];

  render() {
    return html`
      <div class="horizontal-spacing" style="min-width: 100%; align-items: flex-start">
        <slot id="slot"></slot>
        <vaadin-button ?disabled="${this.disabled}"
                       ?hidden="${!this._showSwitchButton}"
                       @click="${this._displayNextElement}"
                       part="switch-button"
                       theme="icon ${this.theme || ''}">
          <vaadin-icon icon="vaadin:sort"></vaadin-icon>
        </vaadin-button>
      </div>
    `;
  }

  static get is() {
    return 'element-carousel';
  }

  static properties = {
    theme: { type: String, reflect: true },
    pinned: { type: Boolean },
    displayedElementIndex: { type: Number },
    _slotElements: { type: Array, state: true },
    _showSwitchButton: { type: Boolean, state: true }
  };

  constructor() {
    super();
    this.pinned = false;
    this.displayedElementIndex = 0;
    this._slotElements = [];
    this._showSwitchButton = false;
  }

  firstUpdated() {
    const slot = this.shadowRoot.querySelector('#slot');

    this._enabledMutationObserver = new MutationObserver(mutations => {
      if (mutations.some(m => m.type === 'attributes')) {
        this._refreshElementVisibility();
      }
    });

    slot.addEventListener('slotchange', () => {
      this._enabledMutationObserver.disconnect();

      this._slotElements = slot.assignedNodes().filter(n => n.nodeType === Node.ELEMENT_NODE);

      this._slotElements.forEach(element => {
        this._enabledMutationObserver.observe(element, {
          attributes: true,
          attributeFilter: ['disable-for-switch']
        });
      });

      this._refreshElementVisibility();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._enabledMutationObserver?.disconnect();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('pinned') || changedProperties.has('_slotElements')) {
      this._refreshElementVisibility();
    }
  }

  _refreshElementVisibility() {
    this._displayIndex(this.displayedElementIndex);
  }

  _displayIndex(index) {
    if (!this._slotElements?.length) return;

    this._slotElements.forEach(element => {
      ColorPickerUtils.conditionallySetAttribute(
        element,
        !(this.pinned && this._isElementRelevant(element)),
        'hidden'
      );
    });

    const enabledElements = this._slotElements.filter(el => this._isElementRelevant(el));
    if (!enabledElements.length) return;

    let elementIndex = index % this._slotElements.length;
    while (!this._isElementRelevant(this._slotElements[elementIndex])) {
      elementIndex = (elementIndex + 1) % this._slotElements.length;
    }

    this._slotElements[elementIndex].removeAttribute('hidden');
    this.displayedElementIndex = elementIndex;
    this.dispatchEvent(new CustomEvent('displayed-element-index-changed', {
      detail: { value: elementIndex }
    }));
    this._showSwitchButton = !this.pinned && enabledElements.length > 1;
  }

  _isElementRelevant(element) {
    return !element.hasAttribute('disable-for-switch');
  }

  _displayNextElement() {
    this._displayIndex(this.displayedElementIndex + 1);
  }
}

customElements.define(ElementCarouselElement.is, ElementCarouselElement);

window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
window.Vaadin.ColorPicker.ElementCarouselElement = ElementCarouselElement;
