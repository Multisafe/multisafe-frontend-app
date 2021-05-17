import styled from "styled-components/macro";

export default styled.div`
  padding: 1rem 3.6rem 4rem;

  .title {
    font-size: 2rem;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
    margin-top: 2rem;
  }

  .subtitle {
    font-size: 1.6rem;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #373737;
    padding: 1rem 0;
  }

  .radio-toolbar input[type="radio"] {
    display: none;
  }

  .radio-toolbar label {
    display: inline-block;
    padding: 0.4rem 1.1rem;
    font-size: 1.6rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem 0;
    margin-right: 1rem;
    min-width: 13rem;
    border-radius: 0.8rem;
    border: solid 0.05rem #aaaaaa;
    background-color: #f2f2f2;
  }

  .radio-toolbar input[type="radio"]:checked + label {
    background-color: #c3c3c3;
  }

  .default-address {
    pointer-events: none;
    opacity: 0.7;
  }

  .proceed-btn {
    width: 40rem;
    padding: 1rem;
    height: 4rem;
    border-radius: 0.4rem;
    box-shadow: 0.1rem 0.1rem 3rem 0 rgba(113, 113, 113, 0.25);
    background-color: ${({ theme }) => theme.primary};
    position: absolute;
    right: 4rem;
    bottom: 4rem;
    font-size: 1.4rem;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;

    &:hover {
      background-color: #3c3c3c;
    }
  }

  @media (max-width: 600px) {
    .proceed-btn {
      min-width: 14rem;
      width: auto;
    }
  }
`;
