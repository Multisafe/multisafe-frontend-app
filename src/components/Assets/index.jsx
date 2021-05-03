import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeSelectTokenList, makeSelectLoading } from "store/tokens/selectors";
import { getTokens } from "store/tokens/actions";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import Loading from "components/common/Loading";
import {
  Table,
  TableHead,
  TableBody,
  TableInfo,
} from "components/common/Table";
import { formatNumber } from "utils/number-helpers";
import { FiltersCard } from "components/People/styles";
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

  const renderLoading = () => (
    <TableInfo
      style={{
        textAlign: "center",
        height: "40rem",
      }}
    >
      <td colSpan={4}>
        <div className="d-flex align-items-center justify-content-center">
          <Loading color="primary" width="3rem" height="3rem" />
        </div>
      </td>
    </TableInfo>
  );

  const renderAssets = () => {
    if (loading) return renderLoading();

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
      <FiltersCard>
        <div>
          <div className="title">Assets</div>
          <div className="subtitle">View all your assets here</div>
        </div>
        <div></div>
      </FiltersCard>
      <Table style={{ marginTop: "3rem" }}>
        <TableHead>
          <tr>
            <th style={{ width: "40%" }}>Asset</th>
            <th style={{ width: "30%" }}>Balance</th>
            <th style={{ width: "30%" }}>Fiat Value</th>
          </tr>
        </TableHead>
        <TableBody>{renderAssets()}</TableBody>
      </Table>
    </div>
  );
}
