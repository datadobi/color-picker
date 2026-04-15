window.Vaadin = window.Vaadin || {};

/**
 * Mixin that adds a reflected `disabled` boolean property.
 */
Vaadin.DisabledPropertyMixin = superClass => class DisabledPropertyMixin extends superClass {
  static properties = {
    disabled: { type: Boolean, reflect: true }
  };
};
