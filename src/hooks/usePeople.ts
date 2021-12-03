import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import viewPeopleReducer, { viewPeopleKey } from "store/view-people/reducer";
import viewPeopleSaga from "store/view-people/saga";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import { getAllPeople } from "store/view-people/actions";
import {
  makeSelectLoading as makeSelectLoadingPeople,
  makeSelectPeople,
} from "../store/view-people/selectors";
import { useEncryptionKey } from "./index";
import { getDecryptedDetails } from "../utils/encryption";

export const usePeople = () => {
  const dispatch = useDispatch();

  //@ts-ignore
  useInjectReducer({ key: viewPeopleKey, reducer: viewPeopleReducer });
  //@ts-ignore
  useInjectSaga({ key: viewPeopleKey, saga: viewPeopleSaga });

  const [encryptionKey] = useEncryptionKey();
  const loadingPeople = useSelector(makeSelectLoadingPeople());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const organisationType = useSelector(makeSelectOrganisationType());
  const encryptedPeople = useSelector(makeSelectPeople());

  useEffect(() => {
    dispatch(getAllPeople(safeAddress));
  }, [dispatch, safeAddress]);

  const decryptedPeople = useMemo(() => {
    return encryptedPeople
      ? encryptedPeople.map(({ data, ...rest }: FixMe) => {
          const { firstName, lastName, salaryAmount, salaryToken, address } =
            getDecryptedDetails(data, encryptionKey, organisationType);

          return {
            firstName,
            lastName,
            salaryAmount,
            salaryToken,
            address,
            ...rest,
          };
        })
      : [];
  }, [encryptedPeople, encryptionKey, organisationType]);

  const personByAddress = useMemo(() => {
    return decryptedPeople.reduce(
      (acc: Record<string, FixMe>, personData: FixMe) => {
        acc[personData.address] = personData;
        return acc;
      },
      {}
    );
  }, [decryptedPeople]);

  return {
    loadingPeople,
    encryptedPeople,
    decryptedPeople,
    personByAddress,
  };
};
