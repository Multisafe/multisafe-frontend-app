import styled from "styled-components/macro";

export default styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  font-size: 1.2rem;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #373737;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 1rem;

    .income-circle {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background: #687fdc;
    }
    .expense-circle {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background: #cad2f3;
    }
  }
`;
