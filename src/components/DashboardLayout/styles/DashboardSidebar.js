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

  &.sidebar-responsive {
    position: absolute;
    display: block;
    z-index: 2;
    left: 0;
    height: 100vh;
    max-width: 30em;
  }

  .close-btn {
    display: none;
    position: absolute;
    right: 2.5em;
    top: 3.2em;
    cursor: pointer;
  }

  .parcel-logo {
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20em;
  }

  .settings-container {
    padding: 0 2.5em;
    width: 100%;
  }

  .settings {
    min-height: 5em;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1em 0 2em;
    padding: 0.7em 1.5em;
    border-radius: 1em;
    border: solid 0.1em #dddcdc;
    background-color: #ffffff;
    cursor: pointer;
    position: relative;

    .company-title {
      margin-bottom: 0.5em;
      font-size: 1.4em;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #373737;
    }

    .company-subtitle {
      font-size: 1.2em;
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
      top: 6em;
      left: 0;
      width: 100%;
      max-width: 100%;
      border-radius: 1em;
      box-shadow: 1em 1em 2em 0 rgba(170, 170, 170, 0.2);
      border: solid 0.1em #dddcdc;
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
        padding: 1.5em;
        border-bottom: 0.1em solid #f1f0fd;
        display: flex;
        align-items: center;

        .icon {
          margin-right: 1em;
          font-size: 1.6em;
        }

        .name {
          font-size: 1.4em;
          font-weight: 900;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          text-align: left;
          color: #373737;
          padding-top: 0.3em;
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
    grid-gap: 0.5em;
    padding: 0 2.5em;
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: 1.5em;
    width: 100%;
    color: #373737;

    &.menu-item-highlighted {
      width: 100%;
      padding: 1.5em;
      border-radius: 1em;
      background-color: #e3e1fc;
      color: #7367f0;
    }

    .icon {
      margin-right: 1.5em;
    }

    .name {
      padding-top: 0.4em;
      font-size: 1.6em;
      font-weight: 900;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
    }

    &:hover {
      cursor: pointer;
      border-radius: 1em;
      opacity: 0.85;
    }
  }

  .invite-owners {
    min-height: 5em;
    padding: 1em;
    background-color: #7367f0;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      margin-right: 1em;
    }

    .name {
      padding-top: 0.4em;
      font-size: 1.6em;
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
