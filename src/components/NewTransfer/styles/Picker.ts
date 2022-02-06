import styled from "styled-components";

const PickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const TransferPickerCard = styled.div`
  width: 40rem;
  padding: 2rem;
  background: #ffffff;
  border: 1px solid rgba(20, 82, 245, 0.05);
  box-sizing: border-box;
  box-shadow: 0px 2rem 4rem -0.4rem rgba(145, 158, 171, 0.12);
  border-radius: 0.8rem;
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 3.6rem;
  align-items: center;

  p.title {
    font-size: 1.8rem;
    line-height: normal;
    font-weight: 400;
    color: #373737;
    margin-bottom: 1rem;
    & > img {
      margin-left: 1rem;
    }
  }

  p.desc {
    color: #989898;
    font-weight: 400;
    font-size: 1.4rem;
    line-height: normal;
  }
`;

const Heading = styled.h2`
  font-size: 3rem;
  color: ${({ theme }) => theme.primary};
  margin: 0 0 2rem 0;
  padding: 0;
`;

const DescriptionText = styled.p`
  font-size: 1.6rem;
  color: #373737;
  font-weight: normal;
  line-height: 133.4%;
`;

const HeadingContainer = styled.div`
  text-align: center;
  margin-bottom: 8rem;
  display: flex;
  flex-direction: column;
`;

const NewTransferContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
  max-width: 65rem;
  margin: auto;
`;

export {
  NewTransferContainer,
  PickerContainer,
  TransferPickerCard,
  Heading,
  HeadingContainer,
  DescriptionText,
};
