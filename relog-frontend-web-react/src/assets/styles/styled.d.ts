import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      ice: string;
      red: string;
      black: string;
      purple: string;
      white: string;
      registrationField: string;
      textNav: string;
    };
    fonts: {
      title: string;
      subtitle: string;
      nav: string;
      text: string;
      secondaryText: string;
      selectText: string;
      button: string;
      date: string;
    };
  }
}
