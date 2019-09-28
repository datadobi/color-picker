window.Vaadin = window.Vaadin || {};
window.Vaadin.ColorPicker = window.Vaadin.ColorPicker || {};
import 'tinycolor2';
/**
 * @polymerBehaviour
 */
Vaadin.ColorPicker.HasColorValueMixin =
  superClass => class HasColorValueMixin extends superClass {

    static get properties() {
      return {
        /**
         * The selected color in the form of a
         * [TinyColor](https://github.com/bgrins/TinyColor|TinyColor) color.
         */
        value: {
          type: Object,
          value: tinycolor({h: 0, s: 1, l: 0.5}),
          notify: true
        }
      };
    }
  };
