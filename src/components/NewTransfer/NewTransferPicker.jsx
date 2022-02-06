import LeftArrowIcon from "assets/icons/new-transfer/left-arrow-secondary.svg";
import SuperfluidAsset from "assets/images/powered-by-superfluid.svg";
import { Button } from "components/common/Button/styles";
import Img from "components/common/Img";
import React from "react";
import { STEPS } from "store/register/resources";
import {
  DescriptionText,
  Heading,
  HeadingContainer,
  NewTransferContainer,
  PickerContainer,
  TransferPickerCard,
} from "./styles/Picker";

const NewTransferPicker = ({ chooseTransferType }) => {
  return (
    <NewTransferContainer>
      <HeadingContainer>
        <Heading>New Transfer</Heading>
        <DescriptionText>
          Globally envisioneer B2C results whereas viral e-commerce.
          Dramatically communicate timely niches rather than virtual solutions.
        </DescriptionText>
      </HeadingContainer>
      <PickerContainer>
        <TransferPickerCard>
          <div>
            <p className="title">One Time Payment</p>
            <p className="desc">
              Rapidiously deliver global e-business and multimedia based
              scenarios.
            </p>
          </div>
          <Button
            className="secondary-5"
            onClick={() => chooseTransferType(STEPS.ONE)}
          >
            <span className="mr-3">Proceed</span>
            <Img
              src={LeftArrowIcon}
              style={{ transform: "rotate(180deg)" }}
              alt="right arrow"
            />
          </Button>
        </TransferPickerCard>
        <TransferPickerCard>
          <div>
            <p className="title">
              Start Streaming
              <img src={SuperfluidAsset} alt="Powered by Superfluid" />
            </p>
            <p className="desc">
              Rapidiously deliver global e-business and multimedia based
              scenarios.
            </p>
          </div>
          <Button
            className="secondary-5"
            onClick={() => chooseTransferType(STEPS.TWO)}
          >
            <span className="mr-3">Proceed</span>
            <Img
              src={LeftArrowIcon}
              style={{ transform: "rotate(180deg)" }}
              alt="right arrow"
            />
          </Button>
        </TransferPickerCard>
      </PickerContainer>
    </NewTransferContainer>
  );
};
export default NewTransferPicker;
