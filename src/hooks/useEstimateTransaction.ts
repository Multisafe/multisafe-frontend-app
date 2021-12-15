import {GNOSIS_SAFE_TRANSACTION_ENDPOINTS, GNOSIS_SAFE_TRANSACTION_V2_ENDPOINTS} from '../constants/endpoints';
import {useActiveWeb3React} from './index';
import {useSelector} from 'react-redux';
import {makeSelectOwnerSafeAddress} from '../store/global/selectors';
import {CHAIN_IDS, NETWORK_NAMES} from '../constants/networks';

type EstimateParams = {
  to: string;
  value: string;
  data: string;
  operation: number;
}

type EstimateParamsSafeRelay = EstimateParams & {
  gasToken: string;
}

export const useEstimateTransaction = () => {
  const { chainId } = useActiveWeb3React();
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());

  const estimateGasSafeRelay = async ({
  to,
  value,
  data,
  operation,
  gasToken

}: EstimateParamsSafeRelay) => {
    const estimateResponse = await fetch(
      `${GNOSIS_SAFE_TRANSACTION_V2_ENDPOINTS[chainId]}${safeAddress}/transactions/estimate/`,
      {
        method: "POST",
        body: JSON.stringify({
          safe: safeAddress,
          to,
          value,
          data,
          operation,
          gasToken,
        }),
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const estimateResult = await estimateResponse.json();

    if (estimateResult.exception) {
      throw new Error("Gas estimation error. The transaction might fail.");
    }

    return estimateResult;
  };

  const estimateGasTransactionService = async ({to, value, data, operation}: EstimateParams) => {
    const baseGas = 100000;
    const lastUsedNonce = null;

    const estimateResponse = await fetch(
      `${GNOSIS_SAFE_TRANSACTION_ENDPOINTS[chainId]}${safeAddress}/multisig-transactions/estimations/`,
      {
        method: "POST",
        body: JSON.stringify({
          safe: safeAddress,
          to,
          value,
          data,
          operation
        }),
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const {safeTxGas} = await estimateResponse.json();

    return { safeTxGas, baseGas, lastUsedNonce };
  };

  const estimateTransaction = async (params: EstimateParamsSafeRelay) => {
    const useSafeRelayForEstimation =
      chainId === CHAIN_IDS[NETWORK_NAMES.MAINNET] ||
      chainId === CHAIN_IDS[NETWORK_NAMES.RINKEBY];

    return useSafeRelayForEstimation
      ? await estimateGasSafeRelay(params)
      : await estimateGasTransactionService(params);
  }

  return {
    estimateTransaction
  }
}
