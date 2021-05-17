import styled from "styled-components/macro";
import BackgroundImage from "assets/images/background.png";

export default styled.div`
  background: ${(props) =>
    props.withImage
      ? `url(${BackgroundImage}) no-repeat`
      : props.theme.background};

  background-size: contain;
  background-repeat: repeat;
  min-height: ${(props) => props.minHeight || "auto"};
  display: flex;
  justify-content: center;
  max-width: 100rem;
  margin: 6rem auto;
`;
