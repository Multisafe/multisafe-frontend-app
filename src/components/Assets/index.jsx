import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeSelectTokenList, makeSelectLoading } from "store/tokens/selectors";
import { getTokens } from "store/tokens/actions";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import {
  Table,
  TableHead,
  TableBody,
  TableLoader,
} from "components/common/Table";
import { formatNumber } from "utils/number-helpers";
import { InfoCard } from "components/People/styles";
import TokenImg from "components/common/TokenImg";

export default function Assets() {
  const dispatch = useDispatch();
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  // Selectors
  const loading = useSelector(makeSelectLoading());
  const tokenList = useSelector(makeSelectTokenList());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getTokens(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch]);

  const renderAssets = () => {
    if (loading) return <TableLoader colSpan={4} />;

    return tokenList.map(({ name, usd, balance }) => (
      <tr key={name}>
        <td className="d-flex align-items-center">
          <TokenImg token={name} />
          <div className="ml-2 mt-1">{name}</div>
        </td>
        <td>
          {formatNumber(balance)} {name}
        </td>
        <td>
          <span>{formatNumber(usd)} USD</span>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <InfoCard>
        <div>
          <div className="title">Assets</div>
          <div className="subtitle">View all your assets here</div>
        </div>
        <div></div>
      </InfoCard>
      <Table style={{ marginTop: "3rem" }}>
        <TableHead>
          <tr>
            <th>Asset</th>
            <th>Balance</th>
            <th>Fiat Value</th>
          </tr>
        </TableHead>
        <TableBody>{renderAssets()}</TableBody>
      </Table>
    </div>
  );
}
