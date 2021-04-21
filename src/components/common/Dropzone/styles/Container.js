import styled from "styled-components/macro";

const getColor = (props) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isDragActive) {
    return "#2196f3";
  }
  return "#c7c7c7";
};

export default styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  padding: 3rem;
  border-radius: 0.4rem;
  border: solid 0.1rem #c7c7c7;
  border-color: ${(props) => getColor(props)};
  background-color: rgba(221, 220, 220, 0.4);
  background-color: #fafafa;

  &:hover {
    cursor: pointer;
  }

  .upload {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .drag-text {
      margin: 2rem auto;
      font-size: 1.2rem;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #8b8b8b;
    }

    .click-text {
      font-size: 1.2rem;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #7367f0;
      padding-bottom: 0.25rem;
      border-bottom: 0.1rem solid #7367f0;
    }
  }
`;
