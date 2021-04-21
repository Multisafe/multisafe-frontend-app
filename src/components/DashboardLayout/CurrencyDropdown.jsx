import React from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useDropdown } from "hooks";
import Img from "components/common/Img";

import USDIcon from "assets/icons/navbar/usd.svg";
import INRIcon from "assets/icons/navbar/inr.svg";
import CNYIcon from "assets/icons/navbar/cny.svg";
import CADIcon from "assets/icons/navbar/cad.svg";

import { Currency } from "./styles";

export default function CurrencyDropdown() {
  const { open, toggleDropdown } = useDropdown();

  return (
    <Currency onClick={toggleDropdown}>
      <Img src={USDIcon} alt="currency" className="mr-2" />
      <div className="text">USD</div>
      <FontAwesomeIcon icon={faAngleDown} className="ml-3" color="#373737" />
      <div className={`currency-dropdown ${open && "show"}`}>
        <div className="currency-option">
          <Img src={USDIcon} alt="currency-usd" className="icon" />
          <div className="name">USD</div>
        </div>
        <div className="currency-option">
          <Img src={INRIcon} alt="currency-usd" className="icon" />
          <div className="name">INR</div>
        </div>
        <div className="currency-option">
          <Img src={CNYIcon} alt="currency-usd" className="icon" />
          <div className="name">CNY</div>
        </div>
        <div className="currency-option">
          <Img src={CADIcon} alt="currency-usd" className="icon" />
          <div className="name">CAD</div>
        </div>
      </div>
    </Currency>
  );
}
