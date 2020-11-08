import { createGlobalStyle } from "styled-components";

export const lightTheme = {
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
    backgroundColor: "#f2f2f2",
    color: "#363537",
    inner: {
      backgroundColor: "#fff",
      borderColor: "#f2f2f2",
      disabledBackgroundColor: "f2f2f2",
    },
  },
};
export const darkTheme = {
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
  html,
  body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
    margin: 0;
  }

  p, h1, h2, h3, h4, h5, h6 {
    margin-bottom: 0;
  }

  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
    font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  a {
    &:hover, &:focus,   {
      text-decoration: none;
      color: inherit;
      background: none;
    }
    &:active{
      background : red;
    }

  }

  .modal {
    color: #373737;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }
`;

export default GlobalStyle;
