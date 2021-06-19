import { createGlobalStyle } from "styled-components";
import AvenirLTProBook from "assets/fonts/AvenirLTProBook.otf";
import AvenirLTProHeavy from "assets/fonts/AvenirLTProHeavy.otf";
import AvenirLTProMedium from "assets/fonts/AvenirLTProMedium.otf";

export const lightTheme = {
  primary: "#1452f5",
  accent: "#e7eefe",
  secondary: "#373737",
  body: "#FFF",
  text: "#373737",
  toggleBorder: "#FFF",
  background: "#f7f7f7",
  logo: {
    color: "#1452f5",
  },
  border: {
    color: "#eee",
  },
  card: {
    backgroundColor: "#fff",
    color: "#363537",
    inner: {
      backgroundColor: "#fff",
      borderColor: "#f2f2f2",
      disabledBackgroundColor: "f2f2f2",
    },
  },
};
export const darkTheme = {
  primary: "#1452f5",
  secondary: "#373737",
  body: "#363537",
  text: "#FAFAFA",
  toggleBorder: "#6B8096",
  background: "#292C35",
  logo: {
    color: "#1452f5",
  },
  border: {
    color: "#535766",
  },
  card: {
    backgroundColor: "#292C35",
    color: "#fff",
    inner: {
      backgroundColor: "#f1f1f1",
      borderColor: "#333",
      disabledBackgroundColor: "f2f2f2",
    },
  },
};

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Avenir Pro';
    src: local('Avenir Pro'), local('AvenirPro'),
    url(${AvenirLTProBook}) format('opentype');
    font-weight: normal; 
    font-style: normal;
  }

  @font-face {
    font-family: 'Avenir Pro';
    src: local('Avenir Pro'), local('AvenirPro'),
    url(${AvenirLTProHeavy}) format('opentype');
    font-style: normal;
    font-weight: bold;
  }

  @font-face {
    font-family: 'Avenir Pro';
    src: local('Avenir Pro'), local('AvenirPro'),
    url(${AvenirLTProMedium}) format('opentype');
    font-style: normal;
    font-weight: 500;
  }

  html,
  body {
    height: 100%;
    width: 100%;
    line-height: normal;
    margin: 0;
    font-size: 10px;
  }

  p, h1, h2, h3, h4, h5, h6 {
    margin-bottom: 0;
  }

  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: 'Avenir Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: normal;
    overflow-x: hidden;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  a {
    color: ${({ theme }) => theme.primary};
    &:hover, &:focus {
      text-decoration: none;
      color: inherit;
      background: none;
    }
    &:active{
      background : none;
    }

  }

  .cursor-pointer{
    cursor: pointer;
  }

  .modal {
    color: #373737;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  .svg-inline--fa {
    font-size: 1.6em;
  }

  .text-green {
    color: #6cb44c;
  }

  .text-orange {
    color: #fcbc04;
  }
  
  .text-red {
    color: #ff4660;
  }

  .tooltip {
    font-size: 1.2rem;
  }

  .text-primary {
    color: ${({ theme }) => theme.primary} !important;
  }

  .text-bold {
    font-weight: 900 !important;
  }

  .font-size-14 {
    font-size: 1.4rem;
  }
`;

export default GlobalStyle;
