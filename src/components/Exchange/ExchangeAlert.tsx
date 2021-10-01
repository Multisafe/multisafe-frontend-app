import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {Alert} from 'components/common/Alert';
import {makeSelectThreshold} from 'store/global/selectors';
import {useLocalStorage} from 'hooks';

const AlertMessage = styled.div`
  margin: auto;
  max-width: 659px;
  text-align: center;
`;

const SHOW_EXCHANGE_ALERT = 'SHOW_EXCHANGE_ALERT';

export const ExchangeAlert = React.memo(() => {
  const [showExchangeAlert, setShowExchangeAlert] = useLocalStorage(SHOW_EXCHANGE_ALERT, true);

  const threshold = useSelector(makeSelectThreshold());

  const isMultiSig = threshold && threshold > 1;

  const onClose = () => {
    setShowExchangeAlert(false);
  };

  return isMultiSig && showExchangeAlert ? (
    <Alert onClose={onClose}>
      <AlertMessage>
        The amount received can vary depending on the time when the swap transaction is finally executed.
        We recommend all the signers to sign and execute the transaction as soon as it is initiated.
      </AlertMessage>
    </Alert>
  ) : null;
});
