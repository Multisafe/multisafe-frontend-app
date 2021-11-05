import { useEffect, memo, useState } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { show } from "redux-modal";
import Big from "big.js";

import Button from "components/common/Button";
import { Input, CurrencyInput, ErrorMessage } from "components/common/Form";
import { makeSelectPrices } from "store/tokens/selectors";
import { MODAL_NAME as SELECT_FROM_TEAM_MODAL } from "./SelectFromTeamModal";
import DeleteSvg from "assets/icons/delete-bin.svg";
import Img from "components/common/Img";

import { formatText } from "utils/string-utils";
import PlusIcon from "assets/icons/new-transfer/plus-icon.svg";
import {
  OuterFlex,
  DetailsRow,
  Divider,
  TeamLabel,
} from "./styles/NewTransfer";

function Receiver({
  item,
  nestIndex,
  k,
  register,
  control,
  watch,
  selectedToken,
  prices,
  selectedTokenDetails,
  fields,
  remove,
  errors,
  setReceivers,
  getValues,
}) {
  const amountChanged = watch(`batch[${nestIndex}].receivers[${k}].amount`);
  // const amountChanged = useWatch({
  //   control,
  //   name: `batch[${nestIndex}].receivers[${k}].amount`,
  // });
  // const receivers = watch(`batch[${nestIndex}].receivers`);

  useEffect(() => {
    if (amountChanged) {
      console.log("updating receivers");
      setReceivers([...getValues().batch[nestIndex].receivers]);
    }
  }, [amountChanged, getValues, setReceivers, nestIndex]);

  return (
    <div style={{ marginBottom: "1.8rem" }}>
      <OuterFlex>
        <DetailsRow>
          <Input
            type="text"
            name={`batch[${nestIndex}].receivers[${k}].name`}
            register={register}
            placeholder="Enter Name (optional)"
            style={{ maxWidth: "20rem" }}
            defaultValue={item.name || ""}
            readOnly={item.isDisabled}
          />

          <Input
            type="text"
            name={`batch[${nestIndex}].receivers[${k}].address`}
            register={register}
            required={`Wallet Address is required`}
            pattern={{
              value: /^0x[a-fA-F0-9]{40}$/,
              message: "Invalid Ethereum Address",
            }}
            placeholder="Wallet Address"
            style={{ maxWidth: "38rem" }}
            defaultValue={item.address || ""}
            readOnly={item.isDisabled || false}
          />

          <Input
            type="hidden"
            name={`batch[${nestIndex}].receivers[${k}].departmentName`}
            register={register}
            defaultValue={item.departmentName}
          />
          <Input
            type="hidden"
            name={`batch[${nestIndex}].receivers[${k}].isDisabled`}
            register={register}
            defaultValue={item.isDisabled}
          />

          {selectedToken && selectedToken.value && (
            <div>
              <Controller
                control={control}
                name={`batch[${nestIndex}].receivers[${k}].amount`}
                rules={{
                  required: "Amount is required",
                  validate: (value) => {
                    if (value <= 0) return "Please check your input";

                    return true;
                  },
                }}
                defaultValue={item.amount || ""}
                render={({ onChange, value }) => (
                  <CurrencyInput
                    type="number"
                    name={`batch[${nestIndex}].receivers[${k}].amount`}
                    value={value}
                    onChange={onChange}
                    placeholder="0.00"
                    conversionRate={
                      prices &&
                      selectedTokenDetails &&
                      prices[selectedTokenDetails.name]
                    }
                    tokenName={
                      selectedTokenDetails ? selectedTokenDetails.name : ""
                    }
                  />
                )}
              />
            </div>
          )}

          <div style={{ minWidth: "2rem" }}>
            {fields.length > 1 && (
              <Button
                type="button"
                iconOnly
                onClick={() => remove(k)}
                className="p-0"
              >
                <Img src={DeleteSvg} alt="remove" width="16" />
              </Button>
            )}
          </div>
        </DetailsRow>
        <div>
          {item.departmentName && <TeamLabel>{item.departmentName}</TeamLabel>}
        </div>
      </OuterFlex>

      <div>
        <ErrorMessage
          errors={errors}
          name={`batch[${nestIndex}].receivers[${k}].address.message`}
        />
        <ErrorMessage
          errors={errors}
          name={`batch[${nestIndex}].receivers[${k}].amount.message`}
        />
      </div>
    </div>
  );
}

function NestedReceivers({
  nestIndex,
  control,
  register,
  watch,
  existingTokenDetails,
  errors,
  setReceivers,
  // receivers,
  getValues,
}) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `batch[${nestIndex}].receivers`,
  });

  const selectedToken = watch(`batch[${nestIndex}].token`);
  const receivers = watch(`batch[${nestIndex}].receivers`);

  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  const [peopleFromTeam, setPeopleFromTeam] = useState([]);

  const dispatch = useDispatch();

  // Selectors
  const prices = useSelector(makeSelectPrices());

  useEffect(() => {
    if (selectedToken && selectedToken.value && existingTokenDetails) {
      setSelectedTokenDetails(
        existingTokenDetails.filter(
          ({ name }) => name === selectedToken.value
        )[0]
      );
    }
  }, [selectedToken, existingTokenDetails]);

  useEffect(() => {
    // remove the first empty row, if people from team are added
    if (
      peopleFromTeam.length > 0 &&
      receivers.length === 1 &&
      !receivers[0].address &&
      !receivers[0].amount
    ) {
      remove(0);
    }
  }, [receivers, peopleFromTeam, remove]);

  useEffect(() => {
    if (peopleFromTeam.length > 0 && selectedTokenDetails) {
      const peopleToAdd = peopleFromTeam.map((people) => {
        const {
          firstName,
          lastName,
          salaryToken,
          address,
          salaryAmount,
          departmentName,
        } = people;

        console.log({ people });

        const amount =
          salaryToken === "USD"
            ? Big(salaryAmount || "0")
                .div(Big(selectedTokenDetails.usdConversionRate))
                .round(selectedTokenDetails.decimals)
                .toString()
            : salaryAmount;

        return {
          name: formatText(`${firstName} ${lastName}`),
          address,
          amount,
          departmentName,
          isDisabled: true,
        };
      });

      append(peopleToAdd);
      setPeopleFromTeam([]);
    }
  }, [peopleFromTeam, append, selectedTokenDetails]);

  const showSelectFromTeamModal = () => {
    dispatch(
      show(SELECT_FROM_TEAM_MODAL, {
        selectedToken: selectedToken && selectedToken.value,
        setPeopleFromTeam,
      })
    );
  };

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <Receiver
            key={item.id}
            {...{
              item,
              nestIndex,
              k,
              register,
              control,
              watch,
              selectedToken,
              prices,
              selectedTokenDetails,
              fields,
              remove,
              errors,
              setReceivers,
              getValues,
            }}
          />
        );
        // return (
        //   <div key={item.id} style={{ marginBottom: "1.8rem" }}>
        //     <OuterFlex>
        //       <DetailsRow>
        //         <Input
        //           type="text"
        //           name={`batch[${nestIndex}].receivers[${k}].name`}
        //           register={register}
        //           placeholder="Enter Name (optional)"
        //           style={{ maxWidth: "20rem" }}
        //           defaultValue={item.name || ""}
        //           disabled={item.isDisabled}
        //         />

        //         <Input
        //           type="text"
        //           name={`batch[${nestIndex}].receivers[${k}].address`}
        //           register={register}
        //           required={`Wallet Address is required`}
        //           pattern={{
        //             value: /^0x[a-fA-F0-9]{40}$/,
        //             message: "Invalid Ethereum Address",
        //           }}
        //           placeholder="Wallet Address"
        //           style={{ maxWidth: "38rem" }}
        //           defaultValue={item.address || ""}
        //           disabled={item.isDisabled}
        //         />

        //         <Input
        //           type="hidden"
        //           name={`batch[${nestIndex}].receivers[${k}].departmentName`}
        //           register={register}
        //           defaultValue={item.departmentName}
        //         />
        //         <Input
        //           type="hidden"
        //           name={`batch[${nestIndex}].receivers[${k}].isDisabled`}
        //           register={register}
        //           defaultValue={item.isDisabled}
        //         />

        //         {selectedToken && selectedToken.value && (
        //           <div>
        //             <Controller
        //               control={control}
        //               name={`batch[${nestIndex}].receivers[${k}].amount`}
        //               rules={{
        //                 required: "Amount is required",
        //                 validate: (value) => {
        //                   if (value <= 0) return "Please check your input";

        //                   return true;
        //                 },
        //               }}
        //               defaultValue={item.amount || ""}
        //               render={({ onChange, value }) => (
        //                 <CurrencyInput
        //                   type="number"
        //                   name={`batch[${nestIndex}].receivers[${k}].amount`}
        //                   value={value}
        //                   onChange={onChange}
        //                   placeholder="0.00"
        //                   conversionRate={
        //                     prices &&
        //                     selectedTokenDetails &&
        //                     prices[selectedTokenDetails.name]
        //                   }
        //                   tokenName={
        //                     selectedTokenDetails
        //                       ? selectedTokenDetails.name
        //                       : ""
        //                   }
        //                 />
        //               )}
        //             />
        //           </div>
        //         )}

        //         <div style={{ minWidth: "2rem" }}>
        //           {fields.length > 1 && (
        //             <Button
        //               type="button"
        //               iconOnly
        //               onClick={() => remove(k)}
        //               className="p-0"
        //             >
        //               <Img src={DeleteSvg} alt="remove" width="16" />
        //             </Button>
        //           )}
        //         </div>
        //       </DetailsRow>
        //       <div>
        //         {item.departmentName && (
        //           <TeamLabel>{item.departmentName}</TeamLabel>
        //         )}
        //       </div>
        //     </OuterFlex>

        //     <div>
        //       <ErrorMessage
        //         errors={errors}
        //         name={`batch[${nestIndex}].receivers[${k}].address.message`}
        //       />
        //       <ErrorMessage
        //         errors={errors}
        //         name={`batch[${nestIndex}].receivers[${k}].amount.message`}
        //       />
        //     </div>
        //   </div>
        // );
      })}

      <div className="my-4 d-flex">
        <Button
          type="button"
          onClick={() => append({})}
          className="secondary-4"
          width="16rem"
        >
          <span className="mr-2">
            <Img src={PlusIcon} alt="plus" />
          </span>
          Add People
        </Button>
        {selectedToken && selectedToken.value && (
          <Button
            type="button"
            onClick={showSelectFromTeamModal}
            className="secondary-4 ml-3"
            width="16rem"
          >
            Select from team
          </Button>
        )}
      </div>

      {selectedToken && selectedToken.value && <Divider />}
    </div>
  );
}

export default memo(NestedReceivers);
