import { createGlobalStyle } from "styled-components";
import AvenirLTProBook from "assets/fonts/AvenirLTProBook.otf";
import AvenirLTProHeavy from "assets/fonts/AvenirLTProHeavy.otf";
import AvenirLTProMedium from "assets/fonts/AvenirLTProMedium.otf";

export const lightTheme = {
  primary: "#7367f0",
  secondary: "#373737",
  body: "#FFF",
  text: "#363537",
  toggleBorder: "#FFF",
  background: "#FFF",
  logo: {
    color: "#7367F0",
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
  primary: "#7367f0",
  secondary: "#373737",
  body: "#363537",
  text: "#FAFAFA",
  toggleBorder: "#6B8096",
  background: "#292C35",
  logo: {
    color: "#7367F0",
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
    line-height: 1.5;
    margin: 0;
    font-size: 10px;
  }

  p, h1, h2, h3, h4, h5, h6 {
    margin-bottom: 0;
  }

  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
    font-family: 'Avenir Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: normal;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  a {
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

  // Scaling/zooming depending on screen width
  // @media (max-width: 1500px) {
  //   #root, .modal-dialog {
  //    zoom: 85%;
  //  }

  //  .tooltip {
  //     zoom: 85%;
  //   }
  // }

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
`;

export default GlobalStyle;
