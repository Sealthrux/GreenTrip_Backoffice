import { createGlobalStyle } from "styled-components";
import MontserratRegular from "./assets/Montserrat-Regular.ttf";
import MontserratBold from "./assets/Montserrat-Bold.ttf";

const GlobalStyles = createGlobalStyle`
  /* Include your Montserrat font-face definitions */
  @font-face {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    src: url(${MontserratRegular}) format("truetype");
  }

  @font-face {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 700;
    src: url(${MontserratBold}) format("truetype");
  }

  /* Apply Montserrat font-family to the body */
  body {
    font-family: "Montserrat", sans-serif;
    margin: 0;
    padding: 0;
  }

  /* Add any other global styles here */
`;

export default GlobalStyles;
