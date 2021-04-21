import styled from "styled-components/macro";

export default styled.div`
  .dropdown {
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    position: relative;
    perspective: 1000px;
    z-index: 100;

    &:hover {
      cursor: pointer;

      .profile {
        border-radius: 32px 32px 0 0;
        padding: 4px;
      }
    }

    &:hover .dropdown_menu li {
      display: flex;
    }
  }

  .dropdown_menu {
    position: absolute;
    top: 100%;
    min-width: 200px;
    width: 100%;
    perspective: 1000px;
    z-index: -1;
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      display: none;
      font-size: 16px;
      opacity: 0;
    }
  }

  // Menu as a whole animated
  .dropdown:hover .dropdown_menu--animated {
    display: block;
  }

  .dropdown_menu--animated {
    display: none;
    li:first-child {
      // border-radius: 10px 10px 0 0;
    }

    li:last-child {
      border-radius: 0 0 10px 10px;
    }
    li,
    a {
      color: #fff;
      opacity: 1;

      color: white;
      background-color: #665dca;
      font-size: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .option {
        font-size: 14px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.29;
        letter-spacing: normal;
        text-align: left;
      }

      &:hover {
        transition: 1s;
        opacity: 0.7;
        cursor: pointer;
      }
    }
  }

  .dropdown_menu-6 {
    animation: growDown 300ms ease-in-out forwards;
    transform-origin: top center;
  }

  @keyframes growDown {
    0% {
      transform: scaleY(0);
    }
    80% {
      transform: scaleY(1.1);
    }
    100% {
      transform: scaleY(1);
    }
  }

  i {
    position: relative;
    opacity: 0.3;
  }
`;
