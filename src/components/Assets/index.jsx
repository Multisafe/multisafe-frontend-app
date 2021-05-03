import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { getAddress } from "@ethersproject/address";
import Button from "components/common/Button";
import { Input, ErrorMessage } from "components/common/Form";
import {
  makeSelectTokenList,
  makeSelectLoading,
  makeSelectSuccess,
  makeSelectUpdating,
  makeSelectError,
} from "store/tokens/selectors";
import { getTokens, addCustomToken } from "store/tokens/actions";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import Loading from "components/common/Loading";
import {
  Table,
  TableHead,
  TableBody,
  TableInfo,
} from "components/common/Table";
import { isTestnet } from "constants/index";
import { formatNumber } from "utils/number-helpers";
import { FiltersCard } from "components/People/styles";
import TokenImg from "components/common/TokenImg";
import ErrorText from "components/common/ErrorText";
import SuccessText from "components/common/SuccessText";

export default function Assets() {
  const { register, errors, handleSubmit, reset } = useForm({
    mode: "onChange",
  });

  const dispatch = useDispatch();
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  // const [totalBalance, setTotalBalance] = useState("0.00");
  const [success, setSuccess] = useState(false);

  // Selectors
  const loading = useSelector(makeSelectLoading());
  const updating = useSelector(makeSelectUpdating());
  const tokenList = useSelector(makeSelectTokenList());
  const addedSuccessfully = useSelector(makeSelectSuccess());
  const error = useSelector(makeSelectError());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getTokens(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch]);

  // useEffect(() => {
  //   const total = tokenList.reduce(
  //     (sum, token) => (sum += parseFloat(token.usd)),
  //     0
  //   );
  //   setTotalBalance(parseFloat(total).toFixed(2));
  // }, [tokenList]);

  useEffect(() => {
    if (addedSuccessfully) {
      setSuccess(true);
      reset({
        contractAddress: "",
      });
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
  }, [addedSuccessfully, reset]);

  const onSubmit = async (values) => {
    if (ownerSafeAddress) {
      dispatch(
        addCustomToken(ownerSafeAddress, getAddress(values.contractAddress))
      );
    }
  };

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

  const renderAddCustomToken = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FiltersCard className="mt-5 d-block">
        <div>
          <div className="title">Add Token</div>
          <div className="subtitle">
            Copy and paste the token contract address
          </div>
        </div>
        <div className="mt-4">
          <div className="d-flex">
            <Input
              type="text"
              name="contractAddress"
              register={register}
              required={`Contract Address is required`}
              pattern={{
                value: /^0x[a-fA-F0-9]{40}$/,
                message: "Invalid Ethereum Address",
              }}
              placeholder="Token Contract Address"
              className="mr-3"
            />
            <Button
              type="submit"
              width="16rem"
              loading={updating}
              disabled={updating}
            >
              Add
            </Button>
          </div>
          <ErrorMessage name="contractAddress" errors={errors} />
          {success && <SuccessText>Token added successfully!</SuccessText>}
          {error && <ErrorText>{error}</ErrorText>}
        </div>
      </FiltersCard>
    </form>
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
      {isTestnet && renderAddCustomToken()}
    </div>
  );
}
