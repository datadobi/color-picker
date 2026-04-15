import { css } from 'lit';

export const sharedStyles = css`
  .horizontal-spacing,
  .vertical-spacing {
    align-items: center;
    display: flex;
  }

  .horizontal-spacing > :not(style),
  .vertical-spacing > :not(style) {
    flex-grow: 1;
    align-items: stretch;
  }

  .horizontal-spacing {
    flex-direction: row;
    margin-right: calc(var(--color-picker-spacing) * -1);
  }

  .horizontal-spacing > :not(style) {
    margin-right: var(--color-picker-spacing);
  }

  .vertical-spacing {
    flex-direction: column;
    margin-bottom: calc(var(--color-picker-spacing) * -1);
  }

  .vertical-spacing > :not(style) {
    margin-bottom: var(--color-picker-spacing);
  }
`;
