import styled from "styled-components/macro";

export default styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(132px, 1fr));
  grid-gap: 20px 10px;

  .department-details {
    &:hover {
      opacity: 0.8;
    }
    cursor: pointer;
  }

  .small-card {
    width: 132px;
    height: 72px;
    padding: 0 30px;
    border-radius: 8px;
    border: solid 0.5px #aaaaaa;
    background-color: #f2f2f2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .department-name {
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.29;
    letter-spacing: normal;
    text-align: center;
    color: #373737;
    margin-top: 8px;
  }
`;
