import styled from "styled-components/macro";

export const SelectFromTeamContainer = styled.div`
  padding: 4rem;

  @media (max-width: 978px) {
    padding: 3rem 2rem;
  }
`;

export const OuterFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 978px) {
    flex-direction: column;
    grid-gap: 2rem;
    align-items: flex-start;
  }
`;

export const Title = styled.div`
  font-size: 1.4rem;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #373737;
  margin-bottom: 1.4rem;
`;

export const SelectAll = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 1.4rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #373737;
  margin-bottom: 1rem;
`;

export const ConfirmContainer = styled.div`
  width: 100%;
`;
