import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeSelectTokenList, makeSelectLoading } from "store/tokens/selectors";
import { getTokens } from "store/tokens/actions";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import {
  Table,
  TableHead,
  TableBody,
  TableLoader,
  TableInfo,
} from "components/common/Table";
import { formatNumber } from "utils/number-helpers";
import { InfoCard } from "components/People/styles";
import TokenImg from "components/common/TokenImg";
import Img from "components/common/Img";
import NoAssetsImg from "assets/icons/dashboard/empty/assets.svg";

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

  const isAssetsEmpty = useMemo(() => {
    return (
      tokenList &&
      tokenList.length > 0 &&
      tokenList.every(({ balance, usd }) => !balance && !usd)
    );
  }, [tokenList]);

  const renderAssets = () => {
    if (loading) return <TableLoader colSpan={4} />;

    return tokenList.map(({ name, usd, balance }) => (
      <tr key={name}>
        <td className="d-flex align-items-center">
          <TokenImg token={name} />
          <div className="ml-2 mt-1">{name}</div>
        </td>
        <td>
          {formatNumber(balance, 5)} {name}
        </td>
        <td>
          <span>{formatNumber(usd)} USD</span>
        </td>
      </tr>
    ));
  };

  const renderNoAssets = () => (
    <TableInfo
      style={{
        textAlign: "center",
        height: "40rem",
        fontSize: "16px",
        fontWeight: "bold",
        color: "#8b8b8b",
      }}
    >
      <td colSpan={3}>
        <div className="d-flex align-items-center justify-content-center">
          <div>
            <Img src={NoAssetsImg} alt="no-assets" className="mb-4" />
            <div className="text-center">No Assets</div>
          </div>
        </div>
      </td>
    </TableInfo>
  );

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

        <TableBody>
          {!isAssetsEmpty ? renderAssets() : renderNoAssets()}
        </TableBody>
      </Table>
    </div>
  );
}
