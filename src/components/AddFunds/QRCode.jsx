import React, { useCallback, useEffect } from "react";
import EthereumQRplugin from "ethereum-qr-code";
import PropTypes from "prop-types";

const generator = new EthereumQRplugin();
export default function EthereumQRCode(props) {
  const { to, value, gas, afterGenerate, size } = props;
  const id = "qr-code";

  const generateQRCode = useCallback(() => {
    let sendDetails;

    sendDetails = {
      to: to,
      value: value,
      gas: gas,
    };

    const qrCode = generator.toCanvas(sendDetails, {
      selector: `#${id}`,
      size: size || 200,
    });

    qrCode.then((code) => {
      if (afterGenerate) {
        afterGenerate(code);
      }
    });
  }, [afterGenerate, gas, to, size, value]);
  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  return <div id={id}></div>;
}

EthereumQRCode.propTypes = {
  uriScheme: PropTypes.string,
  to: PropTypes.string.isRequired,
  value: PropTypes.number,
  gas: PropTypes.number,
  afterGenerate: PropTypes.func,
};
