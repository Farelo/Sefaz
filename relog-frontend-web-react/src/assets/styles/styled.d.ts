import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      ice: string;
      blue: {
        100: string;
        50: string;
        10: string;
      };
      green: {
        100: string;
        50: string;
      };
      black: string;
      text: string;
      negative: string;
      positive: string;
      white: {
        100: string;
        50: string;
        10: string;
      };
      gray: {
        100: string;
        80: string;
        50: string;
        10: string;
        5: string;
      };
      yellow: string;
      orange: string;
    };
    fonts: {
      title: string;
    };
  }
}
