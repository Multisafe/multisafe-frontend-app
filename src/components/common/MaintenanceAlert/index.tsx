import { useEffect, useState } from "react";
import { isPast } from "date-fns";

import Img from "../Img";
import Button from "components/common/Button";
import InfoIcon from "assets/icons/dashboard/info-icon-primary.svg";
import CrossIcon from "assets/icons/dashboard/cross-small.svg";
import { useLocalStorage } from "hooks";
import ExternalLink from "components/common/ExternalLink";

import { message } from "./message";
import { AlertContainer, AlertText, AlertFlex, AlertReadMore } from "./styles";

export default function MaintenanceAlert() {
  const [shouldShowAlert, setShouldShowAlert] = useState<Boolean>(true);
  const [isAlertOpen, setIsAlertOpen] = useLocalStorage("SHOW_ALERT", true);

  useEffect(() => {
    if (!isAlertOpen || isPast(message.expiry)) {
      setShouldShowAlert(false);
    }
  }, [isAlertOpen, shouldShowAlert]);

  const closeAlert = () => {
    setIsAlertOpen(false);
  };

  if (!shouldShowAlert) return null;

  return (
    <AlertContainer>
      <AlertFlex>
        <Img src={InfoIcon} alt="info" className="mr-4" />
        <AlertText>{message.text}</AlertText>
        {message.link && (
          <AlertReadMore>
            <ExternalLink href={message.link}>Read More</ExternalLink>
          </AlertReadMore>
        )}
      </AlertFlex>
      <Button iconOnly onClick={closeAlert} className="p-0">
        <Img src={CrossIcon} alt="close" onClick={closeAlert} />
      </Button>
    </AlertContainer>
  );
}
