import styled from "styled-components/macro";

export const NewTransferContainer = styled.div`
  padding: 4rem;
  max-width: 128rem;
  margin: auto;
  min-height: calc(92vh - 8rem);
  position: relative;
  @media (max-width: 978px) {
    padding: 3rem 2rem;
  }
`;

export const SummaryContainer = styled.div`
  padding: 4rem 0;
  display: grid;
  grid-template-columns: 7.5fr 2.5fr;
  grid-gap: 0 4rem;
  margin: auto;
  position: relative;
  @media (max-width: 978px) {
    padding: 3rem 2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3rem 0;
  }
`;

export const OuterFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 978px) {
    flex-direction: column;
    gap: 2rem;
    align-items: flex-start;
  }
`;

export const Title = styled.div`
  font-size: 1.8rem;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #373737;
  margin-bottom: 1.4rem;
`;

export const TransferFooter = styled.div`
  width: 100%;
  min-height: 8rem;
  position: sticky;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  box-shadow: -1rem -1rem 2rem rgba(178, 178, 178, 0.15);
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;

  @media (max-width: 978px) {
    flex-wrap: wrap-reverse;
  }
`;

export const DetailsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  min-width: 82%;
  @media (max-width: 978px) {
    flex-wrap: wrap;
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 0.1rem;
  margin: 2rem 0;
  background-color: #dddcdc;
`;

export const HeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Heading = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 2.2rem;
`;

export const TeamLabel = styled.div`
  padding: 0.5rem 1rem;
  background: rgba(0, 206, 252, 0.2);
  border-radius: 0.4rem;
  font-style: normal;
  font-weight: normal;
  font-size: 1.4rem;
  color: #373737;
`;

export const BatchContainer = styled.div`
  &:last-child {
    margin-bottom: 2rem;
  }
`;

export const TransferSummaryContainer = styled.div`
  max-width: 100rem;
  width: 100%;
  margin: auto;
  padding: 0 2rem 0 4rem;
  @media (max-width: 978px) {
    padding: 0 2rem;
  }
`;

export const TransferRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  padding: 2.6rem 3rem;
  border-bottom: 0.1rem solid #dddcdc;
  font-style: normal;
  font-weight: normal;
  font-size: 1.4rem;
  grid-gap: 1rem;
  overflow: hidden;

  &:first-of-type {
    border-top: 0.1rem solid #dddcdc;
  }

  @media (max-width: 978px) {
    font-size: 1.2rem;
    display: flex;
    flex-wrap: wrap;

    div:nth-child(3) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const InputTitle = styled.div`
  font-weight: bold;
  font-size: 1.4rem;
  margin-bottom: 1rem;
`;

export const GrandTotalText = styled.div`
  font-weight: bold;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.primary};
  margin: 3rem 0 2rem 0;
`;

export const FixedPortion = styled.div`
  position: fixed;
  margin-right: 4rem;

  @media (max-width: 978px) {
    position: relative;
    padding: 0 2rem;
  }
`;

export const SectionDivider = styled.div`
  width: 0.1rem;
  background-color: #dddcdc;
  height: 100vh;
  position: fixed;
  right: 28%;
  top: 0;

  @media (max-width: 978px) {
    display: none;
  }
`;
