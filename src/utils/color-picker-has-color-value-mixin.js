window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};

import { TinyColor } from '@ctrl/tinycolor';

/**
 * Mixin that adds a `value` property holding a TinyColor instance.
 * Components must dispatch `value-changed` events themselves when value
 * changes from internal user interaction.
 */
Vaadin.ColorPicker.HasColorValueMixin = superClass => class HasColorValueMixin extends superClass {
  static properties = {
    value: { type: Object }
  };

  constructor() {
    super();
    this.value = new TinyColor({ h: 0, s: 1, l: 0.5 });
  }
};
