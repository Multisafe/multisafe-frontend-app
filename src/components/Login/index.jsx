import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ethers } from "ethers";
import { faLock, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { cryptoUtils } from "coinshift-sdk";
import { show } from "redux-modal";

import { useActiveWeb3React, useEncryptionKey, useLocalStorage } from "hooks";
import ConnectButton from "components/Connect";
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
import PrivacySvg from "assets/images/register/privacy.svg";
import VerificationSvg from "assets/images/register/verification.svg";
import { Error } from "components/common/Form/styles";
import { getPassword, getPublicKey } from "utils/encryption";

import { MESSAGE_TO_SIGN } from "constants/index";
import loginSaga from "store/login/saga";
import loginWizardSaga from "store/loginWizard/saga";
import registerReducer from "store/register/reducer";
import registerSaga from "store/register/saga";
import {
  makeSelectError as makeSelectRegisterError,
  makeSelectLoading as makeSelectLoadingRegister,
  makeSelectIsFetching as makeSelectIsFetchingVerificationStatus,
  makeSelectIsVerified,
} from "store/register/selectors";
import { makeSelectError as makeSelectLoginError } from "store/login/selectors";
import { useInjectSaga } from "utils/injectSaga";
import { loginUser } from "store/login/actions";
import { registerUser, getVerificationStatus } from "store/register/actions";
import Loading from "components/common/Loading";
import TeamPng from "assets/images/user-team.png";
import {
  STEPS,
  FLOWS as OWNER_FLOWS,
  organisationInfo,
} from "store/register/resources";
import {
  FLOWS,
  LOGIN_STEPS,
  IMPORT_STEPS,
  ORGANISATION_TYPE,
} from "store/login/resources";
import OrganisationInfoModal, {
  MODAL_NAME as INFO_MODAL,
} from "components/Register/InfoModal";
import {
  OrganisationCards,
  OrganisationCard,
  Information,
  ReviewContent,
  ReviewOwnerDetails,
} from "components/Register/styles";
import LeftArrowIcon from "assets/icons/left-arrow.svg";
import RightArrowIcon from "assets/icons/right-arrow.svg";
import QuestionIcon from "assets/icons/login/question-icon.svg";
import WelcomeImg from "assets/images/register/welcome.svg";

import {
  Background,
  StyledCard,
  InnerCard,
  StepDetails,
  StepInfo,
  Safe,
  RetryText,
} from "./styles";
import ErrorText from "components/common/ErrorText";
import { routeTemplates } from "constants/routes/templates";
import {InfoContainer, NetworkLabelContainer} from "components/Login/styles/Safe";
import {NetworkLabel} from "components/NetworkSelect/NetworkLabel";
import {SUPPORTED_NETWORK_IDS} from "constants/networks";

const loginKey = "login";
const loginWizardKey = "loginWizard";
const registerKey = "register";

const getStepsByFlow = (flow) => {
  switch (flow) {
    case FLOWS.IMPORT:
      return IMPORT_STEPS;
    case FLOWS.LOGIN:
      return LOGIN_STEPS;
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
    default:
      return Object.keys(LOGIN_STEPS).length - 1;
  }
};

const Login = () => {
  const [sign, setSign] = useLocalStorage("SIGNATURE");
  const [, setEncryptionKey] = useEncryptionKey();
  const [hasAlreadySigned, setHasAlreadySigned] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [safeDetails, setSafeDetails] = useState([]);
  const [signing, setSigning] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [authSign, setAuthSign] = useState();
  const [isVerified, setIsVerified] = useState();

  const { active, account, library, connector, chainId, setChainId } = useActiveWeb3React();

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
  const errorInLogin = useSelector(makeSelectLoginError());
  const creating = useSelector(makeSelectLoadingRegister());
  const fetchingVerificationStatus = useSelector(
    makeSelectIsFetchingVerificationStatus()
  );
  const isAccountVerified = useSelector(makeSelectIsVerified());

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
      const msgHash = ethers.utils.hashMessage(MESSAGE_TO_SIGN);
      const recoveredAddress = ethers.utils.recoverAddress(msgHash, sign);

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
      owners:
        formData.owners && formData.owners.length > 0
          ? formData.owners
          : gnosisSafeOwners.map((owner) => ({ name: "", owner })),
    });
  }, [reset, gnosisSafeOwners, formData]);

  useEffect(() => {
    if (step === STEPS.ONE && account) {
      dispatch(fetchSafes(account));
    }
    if (step === STEPS.TWO && account) {
      if (flow === FLOWS.IMPORT) {
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

  useEffect(() => {
    if (account && sign) {
      const password = getPassword(sign);
      dispatch(
        getVerificationStatus({ password, owner: account })
      );
    }
  }, [dispatch, sign, account]);

  useEffect(() => {
    setIsVerified(isAccountVerified);
  }, [isAccountVerified]);

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
        await library
          .getSigner(account)
          .signMessage(MESSAGE_TO_SIGN)
          .then((signature) => {
            setSign(signature);
            setSigning(false);
            goNext();
          });
      } catch (error) {
        console.error("Signature Rejected");
        setSigning(false);
      }
    }
  };

  const signAndAuthenticate = async () => {
    if (!!library && !!account && sign) {
      setAuthenticating(true);

      try {
        const password = getPassword(sign);
        await library
          .getSigner(account)
          .signMessage(password)
          .then((signature) => {
            setAuthSign(signature);
            setAuthenticating(false);
            setIsVerified(true);
          });
      } catch (error) {
        setAuthenticating(false);
        console.error("Signature Failed");
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

      const password = getPassword(sign);

      const body = {
        name: formData.name,
        safeAddress: chosenSafeAddress,
        createdBy: account,
        owners: encryptedOwners,
        referralId: formData.referralId,
        threshold,
        publicKey,
        encryptionKeyData,
        organisationType,
        isImported: 1,
        signature: authSign,
        password,
      };

      dispatch(setOwnerDetails(formData.name, chosenSafeAddress, account));
      dispatch(setOwnersAndThreshold(encryptedOwners, threshold));
      dispatch(setOrganisationType(organisationType));
      dispatch(registerUser(body, chainId));
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
        src={WelcomeImg}
        alt="welcome"
        width="100%"
        style={{ maxWidth: "70rem" }}
        className="d-block mx-auto py-4"
      />
      <InnerCard>
        <div className="mt-5 title">
          Your one stop for crypto treasury management.
        </div>
        <div className="subtitle">
          {!active && `Please connect your Ethereum wallet to proceed.`}
        </div>
        {loadingAccount && (
          <div className="d-flex align-items-center justify-content-center mt-4">
            <Loading color="primary" width="3rem" height="3rem" />
          </div>
        )}

        {!loadingAccount &&
          (!active ? (
            <ConnectButton className="mx-auto d-block mt-3 connect" />
          ) : (
            <div className="buttons">
              <div>
                <Button
                  type="button"
                  className="secondary import"
                  onClick={() => handleSelectFlow(FLOWS.IMPORT)}
                >
                  Import Existing Safe
                </Button>
              </div>
              <div>
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
        <div className="back-btn-container">
          <Button
            iconOnly
            onClick={goBack}
            className="p-0 back-btn"
            style={{ color: "#373737" }}
          >
            <Img src={LeftArrowIcon} alt="back" />
            <span>Back</span>
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
              color="#1452f5"
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
        <p className="subtitle mb-4">Please choose what defines you the best</p>

        <OrganisationCards>
          {organisationInfo.map((info) => (
            <OrganisationCard
              key={info.id}
              onClick={() => handleSelectOrganisation(info.id)}
            >
              <Img
                src={info.img}
                alt={info.name}
                width="100%"
                style={{ minWidth: "13rem" }}
              />
              <div className="px-3">
                <div className="d-flex justify-content-between mt-3">
                  <div className="org-title">{info.name}</div>
                  <Button
                    iconOnly
                    className="p-0"
                    onClick={(e) => {
                      showOrganisationInfo(info);
                      e.stopPropagation();
                    }}
                    type="button"
                  >
                    <Img src={QuestionIcon} alt="question" />
                  </Button>
                </div>
                <div className="org-subtitle">{info.subtitle}</div>
              </div>

              <div className="select-org">
                <Button iconOnly className="px-0" type="button">
                  <Img src={RightArrowIcon} alt="right" />
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
          width="130"
          style={{ minWidth: "13rem" }}
        />
        <p className="title">{name}</p>
        <p className="subtitle">
          You’ll be registered with this name on Coinshift.
        </p>
        <div className="mt-2">
          <Input
            name="name"
            register={register}
            required={required}
            placeholder={placeholder}
            style={{ width: "40rem" }}
            defaultValue={formData.name || ""}
          />
        </div>

        <ErrorMessage name="name" errors={errors} />
        <Button type="submit" className="proceed-btn">
          <span>Proceed</span>
          <span className="ml-3">
            <Img src={RightArrowIcon} alt="right" />
          </span>
        </Button>
      </StepDetails>
    );
  };

  const renderOwnerDetails = () => {
    if (fetching) {
      return (
        <div className="d-flex align-items-center justify-content-center mt-5">
          <Loading color="primary" width="3rem" height="3rem" />
        </div>
      );
    }
    return (
      <StepDetails>
        <h3 className="title">Owner Name & Address</h3>
        <p className="subtitle mb-3">Please enter the name of the owners</p>
        {fields.map(({ id, name, owner }, index) => {
          return (
            <div key={id} className="row mb-4 align-items-baseline">
              <div className="col-4 pr-0">
                <Input
                  name={`owners[${index}].name`}
                  register={register}
                  required={`Owner Name is required`}
                  placeholder="John Doe"
                  defaultValue={name || `Owner ${index + 1}`}
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
            <Img src={RightArrowIcon} alt="right" />
          </span>
        </Button>
      </StepDetails>
    );
  };

  const renderPrivacy = () => {
    return (
      <StepDetails>
        <Img src={PrivacySvg} alt="privacy" className="my-2" width="100" />
        <h3 className="title">We care for Your Privacy </h3>

        {!hasAlreadySigned ? (
          <React.Fragment>
            <p className="subtitle mb-5 pb-5">
              Please sign and authorize Coinshift to derive your encryption key.
            </p>
            <Button
              type="button"
              onClick={signTerms}
              className="mx-auto d-block proceed-btn"
              loading={signing}
              disabled={signing}
            >
              Sign and Authorize
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p className="subtitle mb-5 pb-5">
              You have already authorized. Simply click Proceed to continue.
            </p>
            <Button
              width="40rem"
              type="button"
              onClick={goNext}
              className="mx-auto d-block proceed-btn"
            >
              <span>Proceed</span>
              <span className="ml-3">
                <Img src={RightArrowIcon} alt="right" />
              </span>
            </Button>
          </React.Fragment>
        )}
      </StepDetails>
    );
  };

  const getEncryptionKey = async (data, sign, organisationType) => {
    try {
      const encryptionKey = await cryptoUtils.decryptUsingSignatures(
        data,
        sign,
        organisationType
      );
      return encryptionKey;
    } catch (err) {
      console.error(err);
      return "";
    }
  };

  const getSafeDetails = useCallback(() => {
    if (!safes || !safes.length) {
      setSafeDetails([]);
      return;
    }

    const safeDetails = [];

    for (let i = 0; i < safes.length; i++) {
      if (flow === FLOWS.IMPORT) {
        safeDetails.push({
          safe: safes[i],
          name: "Gnosis Safe User",
          balance: "0",
          encryptionKeyData: "",
          createdBy,
        });
      } else {
        safeDetails.push({
          safe: safes[i].safeAddress,
          name: safes[i].name,
          networkId: safes[i].networkId,
          balance: "0",
          encryptionKeyData: safes[i].encryptionKeyData,
          createdBy,
          organisationType: safes[i].organisationType,
        });
      }
    }
    setSafeDetails(safeDetails);

    return safeDetails;
  }, [createdBy, flow, safes]);

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
    organisationType,
    networkId
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

    const password = getPassword(sign);

    setChainId(networkId);
    dispatch(
      loginUser({
        safeAddress: safe,
        encryptionKeyData,
        password,
        signature: authSign,
        owner: account,
        networkId,
      })
    );
  };

  const handleImportSelectedSafe = async (safe) => {
    dispatch(chooseSafe(safe));
    goNext();
  };

  const handleRefetch = useCallback(() => {
    if (flow === FLOWS.IMPORT) {
      dispatch(getSafes(account, 1)); // 1 => get safes from gnosis api
    } else {
      dispatch(getParcelSafes(account));
    }
  }, [dispatch, account, flow]);

  const renderAuthenticate = () => {
    return (
      <StepDetails>
        <Img
          src={VerificationSvg}
          alt="verification"
          className="my-4"
          width="100"
          style={{ minWidth: "10rem" }}
        />
        <h3 className="title">One-time Verification</h3>
        <p className="subtitle pb-0">
          A password has been created from your signature.
        </p>
        <p className="subtitle">
          Please sign your password to verify your connected account.
        </p>

        <Button
          type="button"
          onClick={signAndAuthenticate}
          className="proceed-btn"
          disabled={authenticating}
          loading={authenticating}
        >
          Sign and Verify
        </Button>
      </StepDetails>
    );
  };

  const renderSafes = () => {
    if (fetchingVerificationStatus) {
      return (
        <div className="d-flex align-items-center justify-content-center mt-5">
          <Loading color="primary" width="3rem" height="3rem" />
        </div>
      );
    }
    if (!isVerified) {
      return renderAuthenticate();
    }

    if (getSafesLoading)
      return (
        <div className="d-flex align-items-center justify-content-center mt-5">
          <Loading color="primary" width="3rem" height="3rem" />
        </div>
      );
    if (safes && !safes.length) {
      return (
        <div className="text-center my-5">
          <p className="mb-4 subtitle">Oops, no safe found...</p>
          {flow === FLOWS.IMPORT ? (
            <div>
              <p className="mb-4 subtitle">
                If you have already imported your safe, simply Login. Or else,
                Signup.
              </p>

              <div className="d-flex align-items-center justify-content-center mt-5">
                <Button
                  onClick={() => dispatch(chooseStep(STEPS.ZERO))}
                  width="20rem"
                  className="mr-3"
                >
                  Login
                </Button>
                <Button to={routeTemplates.signup} width="20rem">
                  Sign Up
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4 subtitle">
                If you have an existing safe, simply Import. Or else, Signup.
              </p>

              <div className="d-flex align-items-center justify-content-center mt-5">
                <Button
                  onClick={() => dispatch(chooseStep(STEPS.ZERO))}
                  width="20rem"
                  className="mr-3"
                >
                  Import
                </Button>
                <Button to={routeTemplates.signup} width="20rem">
                  Sign Up
                </Button>
              </div>
            </div>
          )}

          <RetryText onClick={handleRefetch}>Safe not loaded?</RetryText>
        </div>
      );
    }

    const sortedNetworkIds = [...new Set([chainId, ...SUPPORTED_NETWORK_IDS])];

    const sortedGroups = sortedNetworkIds.reduce((acc, currNetworkId) => {
      return [...acc, {
        networkId: currNetworkId,
        safes: (safeDetails || []).filter(({networkId}) => networkId === currNetworkId)
      }];
    }, []);

    return (
      <StepDetails>
        <h3 className="title">Choose Account</h3>
        <p className="subtitle">
          Select the safe with which you would like to continue
        </p>
        {sortedGroups.length && sortedGroups.map(({safes}) => {
          return safes.map(
            ({ safe, name, encryptionKeyData, organisationType, networkId }) => (
              <Safe
                key={`${safe}`}
                onClick={() =>
                  encryptionKeyData
                    ? handleSelectSafe(
                      name,
                      safe,
                      encryptionKeyData,
                      createdBy,
                      organisationType,
                      networkId
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
                      <InfoContainer>
                        <div className="val">{name}</div>
                        <NetworkLabelContainer>
                          <NetworkLabel chainId={networkId}/>
                        </NetworkLabelContainer>
                      </InfoContainer>
                    </div>
                  </div>
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
                    <Img src={RightArrowIcon} alt="right" />
                  </Button>
                </div>
              </Safe>
            )
          )
        })}
        {errorInLogin && <ErrorText>{errorInLogin}</ErrorText>}
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
          <div className="col-7">
            <div className="review-heading">Owner Details</div>
            <ReviewOwnerDetails>
              {formData.owners.map(({ name, owner }, idx) => (
                <div className="owner-card" key={`${owner}-${idx}`}>
                  <div>
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      color="#1452f5"
                      style={{ fontSize: "2.4rem" }}
                    />
                  </div>
                  <div className="owner-details">
                    <div className="owner-name">{name}</div>
                    <div className="owner-address">{owner}</div>
                  </div>
                </div>
              ))}
            </ReviewOwnerDetails>
          </div>
        </ReviewContent>

        <Information style={{ marginBottom: "5rem" }}>
          <div>You’re about to import this safe to Coinshift.</div>
        </Information>

        <Button
          type="button"
          className="proceed-btn"
          onClick={completeImport}
          loading={creating}
          disabled={creating}
        >
          <span>Complete Import</span>
        </Button>
        {errorInRegister && <ErrorText>{errorInRegister}</ErrorText>}
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
    <Background>
      {step === STEPS.ZERO ? (
        renderConnect()
      ) : (
        <StyledCard>
          {renderStepHeader()}

          <form onSubmit={handleSubmit(onSubmit)}>{renderSteps()}</form>
        </StyledCard>
      )}
    </Background>
  );
};

export default Login;
