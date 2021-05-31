import styled from "styled-components/macro";

export default styled.div`
  grid-area: sidebar;
  width: 100%;
  background-color: #f7f7f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 0.1em solid #dddcdc;
  position: relative;

  .read-only {
    margin-bottom: 1rem;
    font-size: 1.4rem;
    font-weight: 900;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #373737;
    background-color: #fff;
    min-width: 12rem;
    padding: 1rem;
    box-shadow: 0.5rem 0.5rem 4rem 0 rgba(170, 170, 170, 0.2);
    border: solid 0.1rem #dddcdc;
    border-radius: 0.8rem;
  }

  &.sidebar-responsive {
    position: absolute;
    display: block;
    z-index: 2;
    left: 0;
    height: 100vh;
    max-width: 30rem;
  }

  .close-btn {
    display: none;
    position: absolute;
    right: 2.5rem;
    top: 3.2rem;
    cursor: pointer;
  }

  .multisafe-logo {
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20rem;
  }

  .settings-container {
    padding: 0 2.5rem;
    width: 100%;
  }

  .settings {
    min-height: 5rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0 2rem;
    padding: 0.7rem 1.5rem;
    border-radius: 1rem;
    border: solid 0.1em #dddcdc;
    background-color: #ffffff;
    cursor: pointer;
    position: relative;

    .company-title {
      margin-bottom: 0.5rem;
      font-size: 1.4rem;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }

    .company-subtitle {
      font-size: 1.2rem;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #aaaaaa;
    }

    .settings-dropdown {
      position: absolute;
      top: 6rem;
      left: 0;
      width: 100%;
      max-width: 100%;
      border-radius: 1rem;
      box-shadow: 1rem 1rem 2em 0 rgba(170, 170, 170, 0.2);
      border: solid 0.1rem #dddcdc;
      background-color: #ffffff;
      transition: opacity 0.15s linear;
      opacity: 0;
      height: 0;
      overflow: hidden;
      visibility: hidden;

      &.show {
        visibility: visible;
        opacity: 1;
        height: auto;
        z-index: 3;
      }

      .settings-option {
        padding: 1.5rem;
        border-bottom: 0.1rem solid ${({ theme }) => theme.accent};
        display: flex;
        align-items: center;

        &.column {
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
        }

        .icon {
          margin-right: 1rem;
          font-size: 1.6rem;
        }

        .name {
          font-size: 1.4rem;
          font-weight: 900;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          text-align: left;
          color: #373737;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          padding-top: 0.3rem;
        }

        &:hover {
          opacity: 0.85;
        }
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .menu-items {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    grid-gap: 0.5rem;
    padding: 0 2.5rem;
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: 1.5rem;
    width: 100%;
    color: #373737;

    &.menu-item-highlighted {
      width: 100%;
      padding: 1.5rem;
      border-radius: 1rem;
      background-color: ${({ theme }) => theme.accent};
      color: ${({ theme }) => theme.primary};
    }

    .icon {
      margin-right: 1.5rem;
    }

    .name {
      padding-top: 0.4rem;
      font-size: 1.6rem;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
    }

    &:hover {
      cursor: pointer;
      border-radius: 1rem;
      opacity: 0.85;
    }
  }

  .invite-owners {
    min-height: 5rem;
    padding: 1rem;
    background-color: ${({ theme }) => theme.primary};
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      margin-right: 1rem;
    }

    .name {
      padding-top: 0.4rem;
      font-size: 1.6rem;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #ffffff;
    }

    &:hover {
      cursor: pointer;
      opacity: 0.9;
    }
  }

  @media (max-width: 978px) {
    display: none;

    .close-btn {
      display: block;
    }
  }
`;
