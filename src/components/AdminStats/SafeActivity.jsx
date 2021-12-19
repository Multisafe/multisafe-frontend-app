import React, { useEffect, useState } from "react";
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
  SafeActivityCard,
} from "./styles";
import {
  getAllSafeActivity,
  getCurrentSafeActivity,
  resetCurrentSafeActivity,
} from "store/stats/actions";
import statsReducer from "store/stats/reducer";
import statsSaga from "store/stats/saga";
import {
  makeSelectLoadingAllSafeActivity,
  makeSelectAllSafeActivity,
  makeSelectLoadingCurrentSafeActivity,
  makeSelectCurrentSafeActivity,
} from "store/stats/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import LoadingIndicator from "components/common/Loading/PageLoader";
import EtherscanLink from "components/common/EtherscanLink";
import { ETHERSCAN_LINK_TYPES } from "components/common/Web3Utils";
import Loading from "components/common/Loading";
import DateRange from "components/common/DateRangePicker";

const statsKey = "stats";

export default function SafeActivity() {
  const dispatch = useDispatch();
  const [selectedSafeAddress, setSelectedSafeAddress] = useState();
  const [range, setRange] = useState({
    selection: {
      startDate: new Date("12/01/2021"),
      endDate: new Date("12/31/2021"),
      key: "selection",
      color: "#1452f5",
    },
  });

  useInjectReducer({ key: statsKey, reducer: statsReducer });

  useInjectSaga({ key: statsKey, saga: statsSaga });

  // Selectors
  const loading = useSelector(makeSelectLoadingAllSafeActivity());
  const allSafeActivity = useSelector(makeSelectAllSafeActivity());
  const loadingCurrentSafeActivity = useSelector(
    makeSelectLoadingCurrentSafeActivity()
  );
  const currentSafeActivity = useSelector(makeSelectCurrentSafeActivity());

  useEffect(() => {
    dispatch(
      getAllSafeActivity({
        from: new Date("12/01/2021"),
        to: new Date("12/31/2021"),
      })
    );
  }, [dispatch]);

  const handleDateRangeChange = (item) => {
    setRange({ ...range, ...item });
    dispatch(
      getAllSafeActivity({
        from: item.selection.startDate,
        to: item.selection.endDate,
      })
    );
    dispatch(resetCurrentSafeActivity());
  };

  const handleSelectSafeAddress = (safeAddress) => {
    setSelectedSafeAddress(safeAddress);

    dispatch(
      getCurrentSafeActivity({
        from: range.selection.startDate,
        to: range.selection.endDate,
        safeAddress,
      })
    );
  };

  const renderActiveSafes = (safes) => {
    if (loading) return <TableLoader colSpan={4} />;

    return (
      safes &&
      safes.map(({ name, safeAddress }, index) => (
        <tr
          key={`${name}-${index}`}
          onClick={() => handleSelectSafeAddress(safeAddress)}
        >
          <td style={{ width: "10%" }}>{index + 1}</td>
          <td>{name}</td>
          <td>{safeAddress}</td>
        </tr>
      ))
    );
  };

  const renderLoading = () => <LoadingIndicator />;

  const renderAllSafeActivity = () => {
    if (!allSafeActivity) return null;
    const { totalFiatValues, totalSafes, safes } = allSafeActivity;

    return (
      <React.Fragment>
        <AmountCardContainer style={{ marginTop: "3rem" }}>
          <AmountCard>
            <div>
              <div className="title">Total Active Safes</div>
              <div className="amount">{totalSafes}</div>
            </div>
          </AmountCard>
          <AmountCard>
            <div>
              <div className="title">Total Amount Transferred</div>
              <div className="amount d-flex justify-content-center">
                ${formatNumber(totalFiatValues, 0)}
              </div>
            </div>
          </AmountCard>
        </AmountCardContainer>

        <Table style={{ marginTop: "3rem" }}>
          <TableHead>
            <tr>
              <th style={{ width: "10%" }}>No.</th>
              <th>Name</th>
              <th>Address</th>
            </tr>
          </TableHead>

          <TableBody style={{ maxHeight: "25rem", overflow: "auto" }}>
            {renderActiveSafes(safes)}
          </TableBody>
        </Table>
      </React.Fragment>
    );
  };

  const renderCurrentSafeActivity = () => {
    if (loadingCurrentSafeActivity)
      return (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "20vh" }}
        >
          <Loading color="primary" width="3rem" height="3rem" />
        </div>
      );

    if (!currentSafeActivity) return null;
    const { totalFiatValues, safesInfo, safes } = currentSafeActivity;
    const safeName = safes[0]?.name;

    const { peoples, transactions } = safesInfo[0];

    return (
      <SafeActivityCard>
        <div>
          <div className="title">{safeName}</div>
          <div className="value d-flex">
            <span>{selectedSafeAddress}</span>
            <span className="ml-3">
              <EtherscanLink
                id="etherscan-link"
                type={ETHERSCAN_LINK_TYPES.ADDRESS}
                address={selectedSafeAddress}
              />
            </span>
          </div>
        </div>

        <div>
          <div className="title">Total Transaction Amount</div>
          <div className="value">${formatNumber(totalFiatValues, 0)}</div>
        </div>

        <div>
          <div className="title">No. of Transactions</div>
          <div className="value">{transactions?.length || 0}</div>
        </div>

        <div>
          <div className="title">People Added/Updated</div>
          <div className="value">{peoples?.length || 0}</div>
        </div>
      </SafeActivityCard>
    );
  };

  return (
    <StatsContainer>
      <div className="text mb-4">Select range to view activity: </div>
      <DateRange
        onChange={handleDateRangeChange}
        minDate={new Date("03/01/2021")}
        maxDate={new Date()}
        direction="vertical"
        shownDate={new Date()}
        scroll={{ enabled: true }}
        ranges={[range.selection]}
      />

      {loading ? renderLoading() : renderAllSafeActivity()}
      {renderCurrentSafeActivity()}
    </StatsContainer>
  );
}
