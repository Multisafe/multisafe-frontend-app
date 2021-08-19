import styled from "styled-components/macro";

export default styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.8rem;
  border: solid 0.1rem rgba(168, 168, 168, 0.5);
  background-color: #ffffff;

  .owner-card {
    width: 100%;
    flex-grow: 0;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    border-bottom: solid 0.1rem rgba(168, 168, 168, 0.5);
    position: relative;

    &:last-child {
      border-bottom: none;
    }

    .owner-details {
      margin-left: 1.7rem;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;

      .owner-name {
        font-size: 1.4rem;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
        margin-bottom: 0.5rem;
      }
      .owner-address {
        width: 100%;
        font-size: 1.2rem;
        font-weight: 300;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: left;
        color: #373737;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;
