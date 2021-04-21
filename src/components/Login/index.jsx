import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { hashMessage } from "@ethersproject/hash";
import { toUtf8Bytes } from "@ethersproject/strings";
import { keccak256 } from "@ethersproject/keccak256";
import { recoverAddress } from "@ethersproject/transactions";
// import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import {
  faArrowLeft,
  faArrowRight,
  faLock,
  faQuestionCircle,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { cryptoUtils } from "parcel-sdk";
import { show } from "redux-modal";

import Container from "react-bootstrap/Container";
import { useActiveWeb3React, useLocalStorage } from "hooks";
import ConnectButton from "components/Connect";
import { Card } from "components/common/Card";
import { useInjectReducer } from "utils/injectReducer";
import loginWizardReducer from "store/loginWizard/reducer";
import loginReducer from "store/login/reducer";
import {
  makeSelectFormData,
  makeSelectStep,
  makeSelectFlow,
  makeSelectChosenSafeAddress,
  makeSelectLoading,
  makeSelectSafes,
  makeSelectCreatedBy,
  makeSelectGnosisSafeOwners,
  makeSelectGnosisSafeThreshold,
  makeSelectFetchingSafeDetails,
} from "store/loginWizard/selectors";
import {
  chooseStep,
  updateForm,
  selectFlow,
  getSafes,
  getParcelSafes,
  fetchSafes,
  chooseSafe,
  getSafeOwners,
} from "store/loginWizard/actions";
import {
  setOwnerDetails,
  setOwnersAndThreshold,
  setOrganisationType,
} from "store/global/actions";
import Button from "components/common/Button";
import CircularProgress from "components/common/CircularProgress";
import { Input, ErrorMessage } from "components/common/Form";
import { useForm, useFieldArray } from "react-hook-form";
import Img from "components/common/Img";
import CompanyPng from "assets/images/register/company.png";
// import OwnerPng from "assets/images/register/owner.png";
import PrivacySvg from "assets/images/register/privacy.svg";
import { Error } from "components/common/Form/styles";
import { getPublicKey } from "utils/encryption";

import { MESSAGE_TO_SIGN } from "constants/index";
import loginSaga from "store/login/saga";
import loginWizardSaga from "store/loginWizard/saga";
import registerReducer from "store/register/reducer";
import registerSaga from "store/register/saga";
import {
  makeSelectError as makeSelectRegisterError,
  makeSelectLoading as makeSelectLoadingRegister,
} from "store/register/selectors";
import { useInjectSaga } from "utils/injectSaga";
import { loginUser } from "store/login/actions";
import { registerUser } from "store/register/actions";
import Loading from "components/common/Loading";
import TeamPng from "assets/images/user-team.png";
import ParcelLogo from "assets/images/parcel-logo-purple.png";
import WelcomeImage from "assets/images/welcome-new.png";
import {
  STEPS,
  ORGANISATION_TYPE,
  FLOWS as OWNER_FLOWS,
  organisationInfo,
} from "store/register/resources";
import {
  FLOWS,
  LOGIN_STEPS,
  IMPORT_STEPS,
  IMPORT_INDIVIDUAL_STEPS,
} from "store/login/resources";
import OrganisationInfoModal, {
  MODAL_NAME as INFO_MODAL,
} from "components/Register/InfoModal";
import {
  OrganisationCards,
  OrganisationCard,
  HighlightedText,
  ReviewContent,
  ReviewOwnerDetails,
} from "components/Register/styles";

import {
  Background,
  InnerCard,
  StepDetails,
  StepInfo,
  Safe,
  RetryText,
} from "./styles";

const loginKey = "login";
const loginWizardKey = "loginWizard";
const registerKey = "register";

const getStepsByFlow = (flow) => {
  switch (flow) {
    case FLOWS.IMPORT:
      return IMPORT_STEPS;
    case FLOWS.LOGIN:
      return LOGIN_STEPS;
    case FLOWS.IMPORT_INDIVIDUAL:
      return IMPORT_INDIVIDUAL_STEPS;
    default:
      return LOGIN_STEPS;
  }
};

const getStepsCountByFlow = (flow) => {
  switch (flow) {
    case FLOWS.IMPORT:
      return Object.keys(IMPORT_STEPS).length - 1;
    case FLOWS.LOGIN:
      return Object.keys(LOGIN_STEPS).length - 1;
    case FLOWS.IMPORT_INDIVIDUAL:
      return Object.keys(IMPORT_INDIVIDUAL_STEPS).length - 1;
    default:
      return Object.keys(LOGIN_STEPS).length - 1;
  }
};

const Login = () => {
  const [sign, setSign] = useLocalStorage("SIGNATURE");
  const [encryptionKey, setEncryptionKey] = useLocalStorage("ENCRYPTION_KEY"); // eslint-disable-line
  const [hasAlreadySigned, setHasAlreadySigned] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [safeDetails, setSafeDetails] = useState([]);
  const [signing, setSigning] = useState(false);

  const { active, account, library, connector } = useActiveWeb3React();

  // Reducers
  useInjectReducer({ key: loginWizardKey, reducer: loginWizardReducer });
  useInjectReducer({ key: loginKey, reducer: loginReducer });
  useInjectReducer({ key: registerKey, reducer: registerReducer });

  // Sagas
  useInjectSaga({ key: loginKey, saga: loginSaga });
  useInjectSaga({ key: loginWizardKey, saga: loginWizardSaga });
  useInjectSaga({ key: registerKey, saga: registerSaga });

  const dispatch = useDispatch();
  const location = useLocation();

  // Selectors
  const step = useSelector(makeSelectStep());
  const formData = useSelector(makeSelectFormData());
  const safes = useSelector(makeSelectSafes());
  const createdBy = useSelector(makeSelectCreatedBy());
  const getSafesLoading = useSelector(makeSelectLoading());
  const flow = useSelector(makeSelectFlow());
  const chosenSafeAddress = useSelector(makeSelectChosenSafeAddress());
  const fetching = useSelector(makeSelectFetchingSafeDetails());
  const gnosisSafeOwners = useSelector(makeSelectGnosisSafeOwners());
  const gnosisSafeThreshold = useSelector(makeSelectGnosisSafeThreshold());
  const errorInRegister = useSelector(makeSelectRegisterError());
  const creating = useSelector(makeSelectLoadingRegister());

  // Form
  const { register, handleSubmit, errors, reset, control } = useForm();
  const { fields } = useFieldArray({
    control,
    name: "owners",
  });

  useEffect(() => {
    let timer;
    if (!active) {
      timer = setTimeout(() => {
        dispatch(chooseStep(STEPS.ZERO));
        setLoadingAccount(false);
      }, 300);
    }
    if (active) setLoadingAccount(false);

    return () => clearTimeout(timer);
  }, [active, dispatch]);

  useEffect(() => {
    dispatch(chooseStep(STEPS.ZERO)); // start from beginning, when component mounts
  }, [dispatch]);

  useEffect(() => {
    reset({
      owners: [{ name: "", owner: account }],
      ...formData,
    });
  }, [reset, formData, account]);

  useEffect(() => {
    if (sign) {
      const msgHash = hashMessage(MESSAGE_TO_SIGN);
      const recoveredAddress = recoverAddress(msgHash, sign);

      if (recoveredAddress !== account) {
        setHasAlreadySigned(false);
        reset({});
        setSign("");
        dispatch(chooseStep(STEPS.ZERO));
      } else {
        setHasAlreadySigned(true);
      }
    }
  }, [reset, account, dispatch, sign, setSign, connector]);

  useEffect(() => {
    reset({
      ...formData,
      owners: gnosisSafeOwners.map((owner) => ({ name: "", owner })),
    });
  }, [reset, gnosisSafeOwners, formData]);

  useEffect(() => {
    if (step === STEPS.ONE && account) {
      dispatch(fetchSafes(account));
    }
    if (step === STEPS.TWO && account) {
      if (flow === FLOWS.IMPORT || flow === FLOWS.IMPORT_INDIVIDUAL) {
        dispatch(getSafes(account));
      } else {
        dispatch(getParcelSafes(account));
      }
    }
  }, [step, dispatch, account, flow]);

  useEffect(() => {
    if (step === STEPS.THREE && flow === FLOWS.IMPORT) {
      dispatch(getSafeOwners(chosenSafeAddress));
    }
  }, [step, dispatch, chosenSafeAddress, flow]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const referralId = searchParams.get("referralId");
    if (referralId) {
      dispatch(updateForm({ referralId }));
    }
  }, [location, dispatch]);

  const completeImport = async () => {
    await signup();
  };

  const onSubmit = async (values) => {
    dispatch(updateForm(values));
    goNext();
  };

  const signTerms = async () => {
    if (!!library && !!account) {
      setSigning(true);
      try {
        if (connector.name === "WalletConnect") {
          const rawMessage = MESSAGE_TO_SIGN;
          const messageLength = new Blob([rawMessage]).size;
          const message = toUtf8Bytes(
            "\x19Ethereum Signed Message:\n" + messageLength + rawMessage
          );
          const hashedMessage = keccak256(message);

          connector.provider.wc
            .signMessage([account.toLowerCase(), hashedMessage])
            .then((signature) => {
              setSign(signature);
              setSigning(false);
              goNext();
            })
            .catch((error) => {
              setSigning(false);
              console.error("Signature Rejected");
            });
        } else {
          await library
            .getSigner(account)
            .signMessage(MESSAGE_TO_SIGN)
            .then((signature) => {
              setSign(signature);
              setSigning(false);
              goNext();
            });
        }
      } catch (error) {
        console.error("Signature Rejected");
        setSigning(false);
      }
    }
  };

  const goBack = () => {
    dispatch(chooseStep(step - 1));
  };

  const goNext = () => {
    dispatch(chooseStep(step + 1));
  };

  const signup = async () => {
    // let body;
    if (account) {
      // set encryptionKey
      const encryptionKey = cryptoUtils.getEncryptionKey(
        sign,
        chosenSafeAddress
      );
      // set encryptionKey
      setEncryptionKey(encryptionKey);

      const organisationType = parseInt(formData.organisationType);

      const encryptedOwners =
        formData.owners && formData.owners.length
          ? formData.owners.map(({ name, owner }) => ({
              name: cryptoUtils.encryptDataUsingEncryptionKey(
                name,
                encryptionKey,
                organisationType
              ),
              owner,
            }))
          : [
              {
                name: cryptoUtils.encryptDataUsingEncryptionKey(
                  formData.name,
                  encryptionKey,
                  organisationType
                ),
                owner: account,
              },
            ];

      const threshold = gnosisSafeThreshold ? parseInt(gnosisSafeThreshold) : 1;

      const publicKey = getPublicKey(sign);

      let encryptionKeyData;
      try {
        encryptionKeyData = await cryptoUtils.encryptUsingSignatures(
          encryptionKey,
          sign
        );
      } catch (error) {
        console.error(error);
        return;
      }

      const body = {
        name: cryptoUtils.encryptDataUsingEncryptionKey(
          formData.name,
          encryptionKey,
          organisationType
        ),
        safeAddress: chosenSafeAddress,
        createdBy: account,
        owners: encryptedOwners,
        referralId: formData.referralId,
        threshold,
        publicKey,
        encryptionKeyData,
        organisationType,
      };

      dispatch(setOwnerDetails(formData.name, chosenSafeAddress, account));
      dispatch(setOwnersAndThreshold(encryptedOwners, threshold));
      dispatch(setOrganisationType(organisationType));
      dispatch(registerUser(body));
    }
  };

  const handleSelectFlow = (flow) => {
    dispatch(selectFlow(flow));
    goNext();
  };

  const showOrganisationInfo = (info) => {
    dispatch(show(INFO_MODAL, { info }));
  };

  const handleSelectOrganisation = (id) => {
    let ownerFlow;
    let organisationType;

    switch (id) {
      case 1:
        ownerFlow = OWNER_FLOWS.INDIVIDUAL;
        organisationType = ORGANISATION_TYPE.PRIVATE;
        break;
      case 2:
        ownerFlow = OWNER_FLOWS.COMPANY;
        organisationType = ORGANISATION_TYPE.PRIVATE;
        break;
      case 3:
        ownerFlow = OWNER_FLOWS.DAO;
        organisationType = ORGANISATION_TYPE.PUBLIC;
        break;
      default:
        ownerFlow = OWNER_FLOWS.INDIVIDUAL;
    }
    dispatch(updateForm({ ownerFlow, organisationType }));
    dispatch(chooseStep(step + 1));
  };

  const renderConnect = () => (
    <div>
      <Img
        src={WelcomeImage}
        alt="welcome"
        width="70%"
        className="d-block mx-auto py-4"
      />
      <InnerCard height="260px">
        <h2 className="text-center mb-4">
          <img src={ParcelLogo} alt="parcel" width="240" />
        </h2>
        <div className="mt-2 title">
          Your one stop for crypto treasury management.
        </div>
        <div className="subtitle">
          {!active && `Please connect your Ethereum wallet to proceed.`}
        </div>
        {loadingAccount && (
          <div className="d-flex align-items-center justify-content-center mt-4">
            <Loading color="primary" width="50px" height="50px" />
          </div>
        )}

        {!loadingAccount &&
          (!active ? (
            <ConnectButton className="mx-auto d-block mt-3 connect" />
          ) : (
            <div className="row mt-3">
              <div className="col-6">
                <Button
                  type="button"
                  className="secondary import"
                  onClick={() => handleSelectFlow(FLOWS.IMPORT)}
                  disabled={!formData.referralId}
                >
                  Import Existing Safe
                </Button>
              </div>
              <div className="col-6">
                <Button
                  type="button"
                  className="login"
                  onClick={() => handleSelectFlow(FLOWS.LOGIN)}
                >
                  Login
                </Button>
              </div>
            </div>
          ))}
      </InnerCard>
    </div>
  );

  const renderStepHeader = () => {
    const steps = getStepsByFlow(flow);
    return (
      <div>
        <div style={{ height: "50px", padding: "8px 32px" }}>
          <Button iconOnly onClick={goBack} className="px-0">
            <FontAwesomeIcon icon={faArrowLeft} color="#aaa" />
          </Button>
        </div>
        <StepInfo>
          <div>
            <h3 className="title">
              {flow === FLOWS.LOGIN ? `Login` : `Import`}
            </h3>
            <p className="next">
              {steps[step + 1] ? `Next: ${steps[step + 1]}` : `Finish`}
            </p>
          </div>
          <div className="step-progress">
            <CircularProgress
              current={step}
              max={getStepsCountByFlow(flow)}
              color="#7367f0"
            />
          </div>
        </StepInfo>
      </div>
    );
  };

  const renderAboutYou = () => {
    return (
      <StepDetails>
        <p className="title">About You</p>
        <p className="subtitle mb-5">Please choose what defines you the best</p>

        <OrganisationCards>
          {organisationInfo.map((info) => (
            <OrganisationCard key={info.id}>
              <Img
                src={info.img}
                alt={info.name}
                width="100%"
                style={{ minWidth: "130px" }}
              />
              <div className="px-3">
                <div className="d-flex justify-content-between mt-3">
                  <div className="org-title">{info.name}</div>
                  <Button
                    iconOnly
                    className="p-0"
                    onClick={() => showOrganisationInfo(info)}
                    type="button"
                  >
                    <FontAwesomeIcon icon={faQuestionCircle} color="#7367f0" />
                  </Button>
                </div>
                <div className="org-subtitle">{info.subtitle}</div>
              </div>

              <div
                className="select-org"
                onClick={() => handleSelectOrganisation(info.id)}
              >
                <Button iconOnly className="px-0" type="button">
                  <FontAwesomeIcon icon={faArrowRight} color="#fff" />
                </Button>
              </div>
            </OrganisationCard>
          ))}
          <OrganisationInfoModal />
        </OrganisationCards>
      </StepDetails>
    );
  };

  const renderName = ({ required, placeholder, name }) => {
    return (
      <StepDetails>
        <Img
          src={CompanyPng}
          alt="company"
          className="my-4"
          width="130px"
          style={{ minWidth: "130px" }}
        />
        <p className="title">{name}</p>
        <p className="subtitle">
          You’ll be registered with this name on Parcel.
        </p>
        <div className="mt-2">
          <Input
            name="name"
            register={register}
            required={required}
            placeholder={placeholder}
            style={{ width: "400px" }}
            defaultValue={formData.name || ""}
          />
        </div>

        <ErrorMessage name="name" errors={errors} />
        <Button type="submit" className="proceed-btn">
          <span>Proceed</span>
          <span className="ml-3">
            <FontAwesomeIcon icon={faArrowRight} color="#fff" />
          </span>
        </Button>
      </StepDetails>
    );
  };

  const renderOwnerDetails = () => {
    if (fetching) {
      return (
        <div className="d-flex align-items-center justify-content-center mt-5">
          <Loading color="primary" width="50px" height="50px" />
        </div>
      );
    }
    return (
      <StepDetails>
        <h3 className="title">Owner Name & Address</h3>
        <p className="subtitle mb-3">Please enter the name of the owners</p>
        {fields.map(({ id, name, owner }, index) => {
          return (
            <div
              key={id}
              className="row mb-3 align-items-baseline"
              style={{ minHeight: "60px" }}
            >
              <div className="col-4 pr-0">
                <Input
                  name={`owners[${index}].name`}
                  register={register}
                  required={`Owner Name is required`}
                  placeholder="John Doe"
                  defaultValue={name}
                />
                {errors["owners"] &&
                  errors["owners"][index] &&
                  errors["owners"][index].name && (
                    <Error>{errors["owners"][index].name.message}</Error>
                  )}
              </div>
              <div className="col-8">
                <Input
                  name={`owners[${index}].owner`}
                  register={register}
                  required={`Owner Address is required`}
                  pattern={{
                    value: /^0x[a-fA-F0-9]{40}$/g,
                    message: "Invalid Ethereum Address",
                  }}
                  defaultValue={owner}
                  className="default-address"
                />
                {errors["owners"] &&
                  errors["owners"][index] &&
                  errors["owners"][index].owner && (
                    <Error>{errors["owners"][index].owner.message}</Error>
                  )}
              </div>
            </div>
          );
        })}

        <Button type="submit" className="mt-3 proceed-btn">
          <span>Proceed</span>
          <span className="ml-3">
            <FontAwesomeIcon icon={faArrowRight} color="#fff" />
          </span>
        </Button>
      </StepDetails>
    );
  };

  const renderPrivacy = () => {
    return (
      <StepDetails>
        <Img
          src={PrivacySvg}
          alt="privacy"
          className="my-2"
          width="100px"
          style={{ minWidth: "100px" }}
        />
        <h3 className="title">We care for Your Privacy </h3>

        {!hasAlreadySigned ? (
          <React.Fragment>
            <p className="subtitle mb-5 pb-5">
              Please sign to authorize Parcel.
            </p>
            <Button
              type="button"
              onClick={signTerms}
              className="mx-auto d-block proceed-btn"
              loading={signing}
              disabled={signing}
            >
              I'm in
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p className="subtitle mb-5 pb-5">
              You have already authorized Parcel. Simply click Proceed to
              continue.
            </p>
            <Button
              type="button"
              onClick={goNext}
              className="mx-auto d-block proceed-btn"
            >
              <span>Proceed</span>
              <span className="ml-3">
                <FontAwesomeIcon icon={faArrowRight} color="#fff" />
              </span>
            </Button>
          </React.Fragment>
        )}
      </StepDetails>
    );
  };

  const getEncryptionKey = async (data, sign, organisationType) => {
    const encryptionKey = await cryptoUtils.decryptUsingSignatures(
      data,
      sign,
      organisationType
    );
    return encryptionKey;
  };

  const getSafeDetails = useCallback(async () => {
    if (!safes || !safes.length) {
      setSafeDetails([]);
      return;
    }

    const safeDetails = [];

    for (let i = 0; i < safes.length; i++) {
      if (flow === FLOWS.IMPORT || flow === FLOWS.IMPORT_INDIVIDUAL) {
        safeDetails.push({
          safe: safes[i],
          name: "Gnosis Safe User",
          balance: "0",
          encryptionKeyData: "",
          createdBy,
        });
      } else {
        const encryptionKey = await getEncryptionKey(
          safes[i].encryptionKeyData,
          sign,
          safes[i].organisationType
        );

        safeDetails.push({
          safe: safes[i].safeAddress,
          name: cryptoUtils.decryptDataUsingEncryptionKey(
            safes[i].name,
            encryptionKey,
            safes[i].organisationType
          ),
          balance: "0",
          encryptionKeyData: safes[i].encryptionKeyData,
          createdBy,
          organisationType: safes[i].organisationType,
        });
      }
    }
    setSafeDetails(safeDetails);

    return safeDetails;
  }, [createdBy, flow, safes, sign]);

  useEffect(() => {
    if (step === STEPS.TWO) {
      getSafeDetails();
    }
  }, [step, getSafeDetails]);

  const handleSelectSafe = async (
    name,
    safe,
    encryptionKeyData,
    createdBy,
    organisationType
  ) => {
    dispatch(chooseSafe(safe));
    dispatch(setOwnerDetails(name, safe, createdBy));

    if (sign) {
      const encryptionKey = await getEncryptionKey(
        encryptionKeyData,
        sign,
        organisationType
      );
      setEncryptionKey(encryptionKey);
    }

    dispatch(loginUser(safe));
  };

  const handleImportSelectedSafe = async (safe) => {
    dispatch(chooseSafe(safe));
    goNext();
  };

  const handleRefetch = useCallback(() => {
    if (flow === FLOWS.IMPORT || flow === FLOWS.IMPORT_INDIVIDUAL) {
      dispatch(getSafes(account, 1)); // 1 => get safes from gnosis api
    } else {
      dispatch(getParcelSafes(account));
    }
  }, [dispatch, account, flow]);

  const renderSafes = () => {
    if (getSafesLoading)
      return (
        <div className="d-flex align-items-center justify-content-center mt-5">
          <Loading color="primary" width="50px" height="50px" />
        </div>
      );
    if (!safes.length)
      return (
        <div className="text-center my-5">
          <p className="mb-4">Oops, no safe found...</p>
          <Button
            to="/signup"
            style={{ maxWidth: "200px" }}
            className="mx-auto mb-5"
          >
            Sign Up
          </Button>

          <RetryText onClick={handleRefetch}>Safe not loaded?</RetryText>
        </div>
      );

    return (
      <StepDetails>
        <h3 className="title">Choose Account</h3>
        <p className="subtitle">
          Select the safe with which you would like to continue
        </p>
        {safeDetails &&
          safeDetails.map(
            ({ safe, name, balance, encryptionKeyData, organisationType }) => (
              <Safe
                key={safe}
                onClick={() =>
                  encryptionKeyData
                    ? handleSelectSafe(
                        name,
                        safe,
                        encryptionKeyData,
                        createdBy,
                        organisationType
                      )
                    : handleImportSelectedSafe(safe)
                }
              >
                <div className="top">
                  <div className="details">
                    <div className="icon">
                      <img src={TeamPng} alt="user" width="50" />
                    </div>
                    <div className="info">
                      <div className="desc">Name</div>
                      <div className="val">{name}</div>
                    </div>
                  </div>
                  {/* <div className="details">
                <div className="icon">
                  <FontAwesomeIcon icon={faWallet} color="#aaa" />
                </div>
                <div className="info">
                  <div className="desc">Balance</div>
                  <div className="val">{balance} ETH</div>
                </div>
              </div> */}
                </div>

                <div className="bottom">
                  <div className="details">
                    <div className="icon">
                      <FontAwesomeIcon icon={faLock} color="#aaa" />
                    </div>
                    <div className="info">
                      <div className="desc">Address</div>
                      <div className="val">{safe}</div>
                    </div>
                  </div>
                </div>

                <div className="select-safe">
                  <Button iconOnly className="px-0">
                    <FontAwesomeIcon icon={faArrowRight} color="#fff" />
                  </Button>
                </div>
              </Safe>
            )
          )}
        <RetryText onClick={handleRefetch}>Safe not loaded?</RetryText>
      </StepDetails>
    );
  };

  const getReviewHeading = () => {
    if (formData.flow === FLOWS.INDIVIDUAL) return `Your Name`;
    else if (formData.flow === FLOWS.COMPANY) return `Name of your Company`;
    else if (formData.flow === FLOWS.DAO) return `Name of your Organization`;
  };

  const renderReview = () => {
    return (
      <StepDetails>
        <ReviewContent className="row mt-4">
          <div className="col-5">
            <div>
              <div className="review-heading">{getReviewHeading()}</div>
              <div className="review-title">{formData.name}</div>
            </div>
            <div className="mt-4">
              <div className="review-heading">
                Any transaction requires the confirmation of:
              </div>
              <div className="review-title">
                {gnosisSafeThreshold} out of{" "}
                {gnosisSafeOwners && gnosisSafeOwners.length} owners
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="review-heading">Owner Details</div>
            <ReviewOwnerDetails>
              {formData.owners.map(({ name, owner }, idx) => (
                <div className="owner-card" key={`${owner}-${idx}`}>
                  <div>
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      color="#7367f0"
                      style={{ fontSize: "24px" }}
                    />
                  </div>
                  <div>
                    <div className="owner-name">{name}</div>
                    <div className="owner-address">{owner}</div>
                  </div>
                </div>
              ))}
            </ReviewOwnerDetails>
          </div>
        </ReviewContent>

        <HighlightedText className="mt-4">
          <div>You’re about to import this safe to Parcel.</div>
        </HighlightedText>

        <Button
          type="button"
          className="proceed-btn"
          onClick={completeImport}
          loading={creating}
          disabled={creating}
        >
          <span>Complete Import</span>
        </Button>
        {errorInRegister && (
          <div className="text-danger ml-2 my-3">{errorInRegister}</div>
        )}
      </StepDetails>
    );
  };

  const renderSteps = () => {
    switch (step) {
      case STEPS.ZERO: {
        return renderConnect();
      }

      case STEPS.ONE: {
        return renderPrivacy();
      }

      case STEPS.TWO: {
        return renderSafes();
      }

      case STEPS.THREE: {
        if (flow === FLOWS.IMPORT) return renderAboutYou();
        return null;
      }

      case STEPS.FOUR: {
        if (formData.ownerFlow === OWNER_FLOWS.COMPANY)
          return renderName({
            required: "Company Name is required",
            placeholder: "Awesome Company Inc",
            name: "Company Name",
          });
        else if (formData.ownerFlow === OWNER_FLOWS.DAO)
          return renderName({
            required: "Organization Name is required",
            placeholder: "Awesome DAO Inc",
            name: "Organization Name",
          });
        else
          return renderName({
            required: "Name is required",
            placeholder: "John Doe",
            name: "Your Name",
          });
      }

      case STEPS.FIVE: {
        if (flow === FLOWS.IMPORT) return renderOwnerDetails();
        return null;
      }

      case STEPS.SIX: {
        if (flow === FLOWS.IMPORT) return renderReview();
        return null;
      }

      default:
        return null;
    }
  };

  return (
    <Background withImage minHeight="92vh">
      <Container>
        <Card
          className="mx-auto p-0"
          style={{
            minHeight: "600px",
            width: "90%",
            marginTop: "80px",
          }}
        >
          {step !== STEPS.ZERO && renderStepHeader()}
          <form onSubmit={handleSubmit(onSubmit)}>{renderSteps()}</form>
        </Card>
      </Container>
    </Background>
  );
};

export default Login;
