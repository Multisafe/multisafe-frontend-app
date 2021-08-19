import styled from "styled-components/macro";

export default styled.button`
  display: flex;
  align-items: center;
  border: none;
  margin: 0.33em 0;
  background: inherit;
  font-size: inherit;
  width: 100%;
  padding: 0.625em 1.25em;
  transition: box-shadow 150ms ease-in-out, background 200ms ease-in-out;
  border-radius: 4px;
  cursor: pointer;
  color: #373737;
  &:hover {
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  }
  &:focus {
    outline: 0;
  }

  .wallet-details {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .wallet-name {
    margin-left: 0.66em;
    display: flex;
    align-items: center;
  }
  .wallet-selected {
    font-size: 0.8rem;
    text-decoration: underline;
  }
`;
