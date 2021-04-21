import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  height: 480px;
  padding: 22px 0 101px 0;
  background-color: ${({ theme }) => theme.primary};

  .title {
    max-width: 1200px;
    margin: 40px auto 0;
    font-size: 28px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.21;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
  }

  .subtitle {
    max-width: 1200px;
    margin: 10px auto;
    font-size: 16px;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
  }
`;
