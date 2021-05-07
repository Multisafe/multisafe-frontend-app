import styled from "styled-components/macro";

export default styled.div`
  width: 100%;
  min-height: 6rem;
  max-width: 80rem;
  margin-bottom: 1rem;
  padding: 1.2rem 1.5rem;
  border-radius: 0.4rem;
  background-color: ${({ backgroundColor }) =>
    backgroundColor ? backgroundColor : "#f7f7f8"};
  flex-wrap: wrap;

  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    display: flex;
    align-items: center;
  }

  .details {
    margin-left: 2rem;
    .name {
      font-size: 1.4rem;
      font-weight: 900;
      text-align: left;
      line-height: normal;
      color: #373737;
    }
    .address {
      font-size: 1.2rem;
      font-weight: normal;
      line-height: normal;
      text-align: left;
      color: #373737;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .invite-status,
  .you-status,
  .approve-status {
    font-size: 1.2rem;
    font-weight: bold;
    line-height: 1.5rem;
    text-align: right;
    color: #fff;
    padding: 0.6rem 1.6rem;
    border-radius: 0.2rem;
    background-color: ${({ theme }) => theme.primary};
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      opacity: 0.8;
    }
  }

  .you-status {
    padding: 0.6rem 1.2rem;
  }

  .highlighted-status,
  .joined-status {
    font-size: 1.2rem;
    font-weight: bold;
    line-height: 1.5rem;
    text-align: right;
    color: #fff;
    padding: 0.6rem 1.6rem;
    border-radius: 0.2rem;
    background-color: #6cb44c;
  }

  .awaiting-status {
    font-size: 1.2rem;
    font-weight: bold;
    line-height: 1.5rem;
    text-align: right;
    color: #aaaaaa;
    padding: 0.6rem 0.6rem 0.4rem;
    border-radius: 0.2rem;
    border: solid 0.1rem #c7c7c7;
  }

  @media (max-width: 600px) {
    grid-gap: 1rem;

    .left {
      width: 100%;
    }

    .details {
      width: 100%;
      margin-left: 0;
    }
  }
`;
