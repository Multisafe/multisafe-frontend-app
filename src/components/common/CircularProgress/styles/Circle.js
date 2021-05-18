import styled from "styled-components/macro";

export default styled.div`
  position: relative;
  width: 9rem;
  height: 9rem;
  svg,
  circle {
    width: 9rem;
    height: 9rem;
  }

  circle {
    stroke: #f9f9f9;
    fill: none;
    stroke-width: 5;
    transform: translate(1rem, 1rem);
    stroke-dasharray: 220;
    stroke-linecap: round;
  }

  circle:nth-child(2) {
    stroke-dashoffset: calc(220 - (${(props) => props.percentage} * 220) / 100);
    stroke: ${({ theme }) => theme.primary};
    animation: percent 1.5s linear;
    animation-delay: 0s;
    transition: all 0.5s linear;
  }

  @keyframes percent {
    0% {
      stroke-dashoffset: 220;
      stroke-width: 5;
    }
  }
`;
