import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableHead,
  TableBody,
  TableLoader,
} from "components/common/Table";
import { formatNumber } from "utils/number-helpers";
import {
  AmountCard,
  StatsContainer,
  AmountCardContainer,
  StatsCard,
} from "./styles";
import { getAdminStats } from "store/stats/actions";
import statsReducer from "store/stats/reducer";
import statsSaga from "store/stats/saga";
import { makeSelectLoading, makeSelectAdminStats } from "store/stats/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import LoadingIndicator from "components/common/Loading/PageLoader";
import { useActiveWeb3React } from "hooks";

const statsKey = "stats";

export default function AdminStats() {
  const dispatch = useDispatch();

  const { chainId } = useActiveWeb3React();

  useInjectReducer({ key: statsKey, reducer: statsReducer });

  useInjectSaga({ key: statsKey, saga: statsSaga });

  useEffect(() => {
    dispatch(getAdminStats(chainId));
  }, [dispatch, chainId]);

  // Selectors
  const loading = useSelector(makeSelectLoading());
  const stats = useSelector(makeSelectAdminStats());

  const renderOrganisations = (organisations) => {
    if (loading) return <TableLoader colSpan={4} />;

    return (
      organisations &&
      organisations.map(
        (
          { name, balance, threshold, totalOwners, type, moneyIn, moneyOut },
          index
        ) => (
          <tr key={`${name}-${index}`}>
            <td style={{ width: "7%" }}>{index + 1}</td>
            <td>{name}</td>
            <td>${formatNumber(balance, 0)}</td>
            <td>
              {threshold}/{totalOwners}
            </td>
            <td>{type === 0 ? "Company" : "DAO"}</td>
            <td>+${formatNumber(moneyIn, 0)}</td>
            <td>-${formatNumber(moneyOut, 0)}</td>
          </tr>
        )
      )
    );
  };

  const renderLoading = () => <LoadingIndicator />;

  const renderStats = () => {
    if (!stats) return null;
    const {
      organisations,
      totalAssetsImported,
      totalTransactionAmount,
      totalUsers,
      totalImported,
      totalCreated,
      totalCompanies,
      totalDaos,
    } = stats;

    return (
      <StatsContainer>
        <AmountCardContainer>
          <AmountCard>
            <div>
              <div className="title">Total Amount Managed using Coinshift</div>
              <div className="amount d-flex justify-content-center">
                ${formatNumber(totalAssetsImported, 0)}
              </div>
            </div>
          </AmountCard>
          <AmountCard>
            <div>
              <div className="title">
                Total Transaction Amount through Coinshift
              </div>
              <div className="amount">
                ${formatNumber(totalTransactionAmount, 0)}
              </div>
            </div>
          </AmountCard>
        </AmountCardContainer>

        <StatsCard>
          <div className="title">
            Total Safes: <span>{totalUsers}</span>
          </div>
          <div className="flex">
            <div className="title">
              Safes Imported: <span>{totalImported}</span>
            </div>
            <div className="title">
              Safes Created: <span>{totalCreated}</span>
            </div>
          </div>
          <div className="flex">
            <div className="title">
              Companies: <span>{totalCompanies}</span>
            </div>
            <div className="title">
              DAOs: <span>{totalDaos}</span>
            </div>
          </div>
        </StatsCard>

        <Table style={{ marginTop: "3rem" }}>
          <TableHead>
            <tr>
              <th style={{ width: "7%" }}>No.</th>
              <th>Name</th>
              <th>Portfolio Balance</th>
              <th>Threshold / Owners</th>
              <th>Type</th>
              <th>Money IN Last Month</th>
              <th>Money OUT Last Month</th>
            </tr>
          </TableHead>

          <TableBody>{renderOrganisations(organisations)}</TableBody>
        </Table>
      </StatsContainer>
    );
  };

  return loading ? renderLoading() : renderStats();
}
