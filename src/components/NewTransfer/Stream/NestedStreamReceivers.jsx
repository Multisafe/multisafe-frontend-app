import DeleteSvg from "assets/icons/delete-bin.svg";
import PlusIcon from "assets/icons/new-transfer/plus-icon.svg";
import Button from "components/common/Button";
import { ErrorMessage, Input, Select } from "components/common/Form";
import Img from "components/common/Img";
import { STREAM_DURATION_OPTIONS } from "constants/index";
import { useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { useDispatch } from "react-redux";
import { show } from "redux-modal";
import { formatText } from "utils/string-utils";
import { MODAL_NAME as SELECT_FROM_TEAM_MODAL } from "../SelectFromTeamModal";
import { DetailsRow, Divider, OuterFlex } from "../shared/styles/Components";
import StreamRateMessage from "./StreamRateMessage";
import TokenValueInput from "./TokenValueInput";

const DEFAULT_STREAM_DURATION = STREAM_DURATION_OPTIONS[0];

function StreamReceiver({
  item,
  nestIndex,
  k,
  register,
  control,
  watch,
  selectedToken,
  selectedTokenDetails,
  fields,
  remove,
  errors,
  setReceivers,
  receivers,
  getValues,
  setValue,
}) {
  const baseName = `batch[${nestIndex}].receivers[${k}]`;
  const durationKey = `${baseName}.duration`;
  const tokenValueKey = `${baseName}.tokenValue`;

  const duration = watch(durationKey);
  const tokenValue = watch(tokenValueKey);

  return (
    <>
      <OuterFlex>
        <DetailsRow>
          <Input
            type="text"
            name={`${baseName}.name`}
            register={register}
            placeholder="Enter Name (optional)"
            style={{ maxWidth: "20rem" }}
            defaultValue={item.name || ""}
            readOnly={Number(item.isDisabled) === 1 ? true : false}
          />

          <Input
            type="text"
            name={`${baseName}.address`}
            register={register}
            required={`Wallet Address is required`}
            pattern={{
              value: /^0x[a-fA-F0-9]{40}$/,
              message: "Invalid Ethereum Address",
            }}
            placeholder="Wallet Address"
            style={{ maxWidth: "36rem" }}
            defaultValue={item.address || ""}
            readOnly={Number(item.isDisabled) === 1 ? true : false}
          />

          <Input
            type="hidden"
            name={`${baseName}.departmentName`}
            register={register}
            defaultValue={item.departmentName}
          />
          <Input
            type="hidden"
            name={`${baseName}.isDisabled`}
            register={register}
            defaultValue={item.isDisabled}
          />

          {selectedToken && selectedToken.value && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <TokenValueInput
                control={control}
                item={item}
                baseName={baseName}
                setValue={setValue}
                tokenName={
                  selectedTokenDetails ? selectedTokenDetails.name : ""
                }
              />
              {/* Flow Duration Dropdown */}
              <Controller
                name={durationKey}
                control={control}
                rules={{ required: true }}
                defaultValue={item.duration || duration}
                render={({ onChange, value }) => (
                  <Select
                    name={durationKey}
                    required={`Team is required`}
                    width="12rem"
                    control={control}
                    options={STREAM_DURATION_OPTIONS}
                    placeholder={`Select duration...`}
                    defaultValue={item.duration || duration}
                    value={value}
                    onChange={(event) => {
                      const { value } = event;
                      if (value) {
                        setValue(durationKey, value);
                      }
                      onChange(event);
                    }}
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
      </OuterFlex>

      <div>
        <ErrorMessage errors={errors} name={`${baseName}.address.message`} />
        <ErrorMessage errors={errors} name={`${baseName}.tokenValue.message`} />
      </div>

      {selectedToken && selectedToken.value && (
        <StreamRateMessage
          duration={duration?.value}
          tokenName={selectedTokenDetails?.name}
          tokenValue={tokenValue}
        />
      )}
    </>
  );
}

function NestedStreamReceivers({
  nestIndex,
  control,
  register,
  watch,
  existingTokenDetails,
  errors,
  setReceivers,
  receivers,
  getValues,
  setValue,
}) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `batch[${nestIndex}].receivers`,
  });

  const selectedToken = watch(`batch[${nestIndex}].token`);
  const visibleReceivers = watch(`batch[${nestIndex}].receivers`);

  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  const [peopleFromTeam, setPeopleFromTeam] = useState([]);

  const dispatch = useDispatch();

  const getDefaultDuration = useCallback(() => {
    if (visibleReceivers.length > 0) {
      return visibleReceivers[visibleReceivers.length - 1].duration;
    }
    return DEFAULT_STREAM_DURATION;
  }, [visibleReceivers]);

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
      visibleReceivers.length === 1 &&
      !visibleReceivers[0].address &&
      !visibleReceivers[0].tokenValue
    ) {
      remove(0);
    }
  }, [visibleReceivers, peopleFromTeam, remove]);

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

        return {
          name: formatText(`${firstName} ${lastName}`),
          address,
          tokenValue: salaryToken !== "USD" ? salaryAmount : "",
          departmentName,
          isDisabled: 1,
          tokenName: salaryToken,
          fiatValue: salaryToken === "USD" ? salaryAmount : "",
          duration: getDefaultDuration(),
        };
      });

      append(peopleToAdd);
      setPeopleFromTeam([]);
    }
  }, [peopleFromTeam, append, selectedTokenDetails, getDefaultDuration]);

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
          <StreamReceiver
            key={item.id}
            {...{
              item,
              nestIndex,
              k,
              register,
              control,
              watch,
              selectedToken,
              selectedTokenDetails,
              fields,
              remove,
              errors,
              setReceivers,
              receivers,
              getValues,
              setValue,
            }}
          />
        );
      })}

      <div className="d-flex" style={{ marginTop: "3rem" }}>
        <Button
          type="button"
          onClick={() =>
            append({
              address: "",
              tokenValue: "",
              duration: DEFAULT_STREAM_DURATION,
            })
          }
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
            Select from teams
          </Button>
        )}
      </div>

      {selectedToken && selectedToken.value && <Divider />}
    </div>
  );
}

export default NestedStreamReceivers;
