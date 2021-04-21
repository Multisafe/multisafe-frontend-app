import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faQuestionCircle,
  faArrowRight,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { show } from "redux-modal";
import { toUtf8Bytes } from "@ethersproject/strings";
import { keccak256 } from "@ethersproject/keccak256";
// import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import Container from "react-bootstrap/Container";
import { useActiveWeb3React, useLocalStorage, useContract } from "hooks";
import ConnectButton from "components/Connect";
import { Card } from "components/common/Card";
import { useInjectReducer } from "utils/injectReducer";
import registerWizardReducer from "store/registerWizard/reducer";
import registerReducer from "store/register/reducer";
import {
  makeSelectFormData,
  makeSelectStep,
} from "store/registerWizard/selectors";
import { chooseStep, updateForm } from "store/registerWizard/actions";
import {
  setOrganisationType,
  setOwnerDetails,
  setOwnersAndThreshold,
} from "store/global/actions";
import Button from "components/common/Button";
import CircularProgress from "components/common/CircularProgress";
import { Input, ErrorMessage } from "components/common/Form";
import { useForm, useFieldArray } from "react-hook-form";
import Img from "components/common/Img";
import CompanyPng from "assets/images/register/company.png";
import OwnerPng from "assets/images/register/owner.png";
import ThresholdIcon from "assets/images/register/threshold.png";
import PrivacySvg from "assets/images/register/privacy.svg";
import { Error } from "components/common/Form/styles";
import { getPublicKey } from "utils/encryption";
import addresses from "constants/addresses";
import GnosisSafeABI from "constants/abis/GnosisSafe.json";
import ProxyFactoryABI from "constants/abis/ProxyFactory.json";
import registerSaga from "store/register/saga";
import {
  makeSelectError as makeSelectRegisterError,
  makeSelectTransactionHash,
  makeSelectRegistering,
} from "store/register/selectors";
import { useInjectSaga } from "utils/injectSaga";
import { registerUser, createMetaTx } from "store/register/actions";
import { cryptoUtils } from "parcel-sdk";
import { MESSAGE_TO_SIGN, DEFAULT_GAS_PRICE } from "constants/index";
import Loading from "components/common/Loading";
import gasPriceSaga from "store/gas/saga";
import gasPriceReducer from "store/gas/reducer";
import { makeSelectAverageGasPrice } from "store/gas/selectors";
import { getGasPrice } from "store/gas/actions";
import NoReferralModal from "./NoReferralModal";
import ParcelLogo from "assets/images/parcel-logo-purple.png";
import DeleteSvg from "assets/icons/delete-bin.svg";
import LightbulbIcon from "assets/icons/lightbulb.svg";
import LoadingSafeIcon1 from "assets/images/register/loading-1.svg";
import LoadingSafeIcon2 from "assets/images/register/loading-2.svg";
import LoadingSafeIcon3 from "assets/images/register/loading-3.svg";
import WelcomeImage from "assets/images/welcome-new.png";
import OrganisationInfoModal, { MODAL_NAME as INFO_MODAL } from "./InfoModal";
import {
  STEPS,
  COMPANY_REGISTER_STEPS,
  INDIVIDUAL_REGISTER_STEPS,
  DAO_REGISTER_STEPS,
  FLOWS,
  ORGANISATION_TYPE,
  organisationInfo,
} from "store/register/resources";

import {
  Background,
  InnerCard,
  StepDetails,
  StepInfo,
  OrganisationCards,
  OrganisationCard,
  HighlightedText,
  ReviewContent,
  ReviewOwnerDetails,
  LoadingTransaction,
} from "./styles";
import { TransactionUrl } from "components/common/Web3Utils";
import {
  StepperContent,
  Stepper,
} from "components/common/Stepper/SimpleStepper";

const { GNOSIS_SAFE_ADDRESS, PROXY_FACTORY_ADDRESS, ZERO_ADDRESS } = addresses;

const registerKey = "register";
const registerWizardKey = "registerWizard";
const gasPriceKey = "gas";

const getStepsByFlow = (flow) => {
  switch (flow) {
    case FLOWS.COMPANY:
      return COMPANY_REGISTER_STEPS;
    case FLOWS.INDIVIDUAL:
      return INDIVIDUAL_REGISTER_STEPS;
    case FLOWS.DAO:
      return DAO_REGISTER_STEPS;
    default:
      return COMPANY_REGISTER_STEPS;
  }
};

const getStepsCountByFlow = (flow) => {
  switch (flow) {
    case FLOWS.COMPANY:
      return Object.keys(COMPANY_REGISTER_STEPS).length - 1;
    case FLOWS.INDIVIDUAL:
      return Object.keys(INDIVIDUAL_REGISTER_STEPS).length - 1;
    case FLOWS.DAO:
      return Object.keys(DAO_REGISTER_STEPS).length - 1;
    default:
      return Object.keys(COMPANY_REGISTER_STEPS).length - 1;
  }
};

const Register = () => {
  const [sign, setSign] = useLocalStorage("SIGNATURE");
  const setEncryptionKey = useLocalStorage("ENCRYPTION_KEY")[1];
  const [loadingTx, setLoadingTx] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [isMetaTxEnabled, setIsMetaTxEnabled] = useState(false);
  const [txLoadingStep, setTxLoadingStep] = useState(0);
  const [signing, setSigning] = useState(false);

  const { active, account, library, connector } = useActiveWeb3React();
  // Reducers
  useInjectReducer({ key: registerWizardKey, reducer: registerWizardReducer });
  useInjectReducer({ key: registerKey, reducer: registerReducer });
  useInjectReducer({ key: gasPriceKey, reducer: gasPriceReducer });

  // Sagas
  useInjectSaga({ key: registerKey, saga: registerSaga });
  useInjectSaga({ key: gasPriceKey, saga: gasPriceSaga });

  // Route
  const location = useLocation();

  const dispatch = useDispatch();

  // Selectors
  const step = useSelector(makeSelectStep());
  const formData = useSelector(makeSelectFormData());
  const averageGasPrice = useSelector(makeSelectAverageGasPrice());
  const errorInRegister = useSelector(makeSelectRegisterError());
  const txHash = useSelector(makeSelectTransactionHash());
  const registering = useSelector(makeSelectRegistering());

  // Form
  const { register, handleSubmit, errors, reset, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "owners",
  });

  // Contracts
  const gnosisSafeMasterContract = useContract(
    GNOSIS_SAFE_ADDRESS,
    GnosisSafeABI,
    true
  );

  const proxyFactory = useContract(
    PROXY_FACTORY_ADDRESS,
    ProxyFactoryABI,
    true
  );

  useEffect(() => {
    if (!averageGasPrice)
      // get gas prices
      dispatch(getGasPrice());
  }, [dispatch, averageGasPrice]);

  useEffect(() => {
    let timer;
    if (!active) {
      timer = setTimeout(() => {
        dispatch(chooseStep(STEPS.ZERO));
        setLoadingAccount(false);
      }, 300);
    }
    if (active) {
      dispatch(chooseStep(STEPS.ONE));
      setLoadingAccount(false);
    }

    return () => clearTimeout(timer);
  }, [active, dispatch]);

  useEffect(() => {
    reset({
      flow: FLOWS.INDIVIDUAL,
      owners: [{ name: "", owner: account }],
      ...formData,
    });
  }, [reset, formData, account]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const referralId = searchParams.get("referralId");
    if (referralId) {
      dispatch(updateForm({ referralId }));
      setIsMetaTxEnabled(true);
    }
  }, [location, dispatch]);

  useEffect(() => {
    if (errorInRegister) setLoadingTx(false);
  }, [errorInRegister]);

  useEffect(() => {
    if (txHash) setTxLoadingStep(2); // Creating Wallet
  }, [txHash]);

  useEffect(() => {
    if (registering) setTxLoadingStep(3); // Transaction Complete
  }, [registering]);

  const onSubmit = async (values) => {
    // console.log(values);
    dispatch(updateForm(values));
    const lastStep = getStepsCountByFlow(formData.flow);
    if (step === lastStep) {
      if (!formData.referralId) {
        try {
          await createSafe();
          // dispatch(chooseStep(step + 1));
        } catch (err) {
          console.error(err);
        }
      } else {
        try {
          await createSafeWithMetaTransaction();
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      dispatch(chooseStep(step + 1));
    }
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
              dispatch(chooseStep(step + 1));
            })
            .catch((error) => {
              setSigning(false);
              console.error("Signature Rejected");
            });
        } else {
          await library
            .getSigner(account)
            .signMessage(MESSAGE_TO_SIGN)
            .then(async (signature) => {
              setSign(signature);
              setSigning(false);
              dispatch(chooseStep(step + 1));
            });
        }
      } catch (error) {
        setSigning(false);
        console.error("Signature Failed");
      }
    }
  };

  const goBack = () => {
    dispatch(chooseStep(step - 1));
  };

  const getReviewHeading = () => {
    if (formData.flow === FLOWS.INDIVIDUAL) return `Your Name`;
    else if (formData.flow === FLOWS.COMPANY) return `Name of your Company`;
    else if (formData.flow === FLOWS.DAO) return `Name of your Organization`;
  };

  const createSafe = async () => {
    if (gnosisSafeMasterContract && proxyFactory && account) {
      const ownerAddresses =
        formData.owners && formData.owners.length
          ? formData.owners.map(({ owner }) => owner)
          : [account];

      const threshold = formData.threshold ? parseInt(formData.threshold) : 1;
      const creationData = gnosisSafeMasterContract.interface.encodeFunctionData(
        "setup",
        [
          ownerAddresses,
          threshold,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          0,
          ZERO_ADDRESS,
        ]
      );

      // Execute normal transaction
      // Create Proxy
      const estimateGas = await proxyFactory.estimateGas.createProxy(
        GNOSIS_SAFE_ADDRESS,
        creationData
      );

      const tx = await proxyFactory.createProxy(
        GNOSIS_SAFE_ADDRESS,
        creationData,
        {
          gasLimit: estimateGas,
          gasPrice: averageGasPrice || DEFAULT_GAS_PRICE,
        }
      );

      proxyFactory.once("ProxyCreation", async (proxy) => {
        dispatch(
          updateForm({
            safeAddress: proxy,
            creationData,
          })
        );
        await registerUserToParcel();
      });

      setLoadingTx(true);
      const result = await tx.wait();
      setLoadingTx(false);
      console.log("tx success", result);
    }
  };

  const createSafeWithMetaTransaction = async () => {
    let body;

    if (account && sign) {
      const ownerAddresses =
        formData.owners && formData.owners.length
          ? formData.owners.map(({ owner }) => owner)
          : [account];

      const threshold = formData.threshold ? Number(formData.threshold) : 1;
      const organisationType = parseInt(formData.organisationType);

      const creationData = gnosisSafeMasterContract.interface.encodeFunctionData(
        "setup",
        [
          ownerAddresses,
          threshold,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          0,
          ZERO_ADDRESS,
        ]
      );

      // Execute Meta transaction

      setLoadingTx(true);
      setTxLoadingStep(1); // Transaction Submitted
      // const publicKey = getPublicKey(sign);

      const metaTxBody = {
        referralId: formData.referralId,
        createdBy: account,
        proxyData: {
          from: account,
          params: [GNOSIS_SAFE_ADDRESS, creationData],
        },
      };

      dispatch(createMetaTx(metaTxBody));

      proxyFactory.once("ProxyCreation", async (proxy) => {
        if (proxy) {
          const publicKey = getPublicKey(sign);
          // set encryptionKey
          const encryptionKey = cryptoUtils.getEncryptionKey(sign, proxy);
          setEncryptionKey(encryptionKey);
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
                    owner: account,
                    name: cryptoUtils.encryptDataUsingEncryptionKey(
                      formData.name,
                      encryptionKey,
                      organisationType
                    ),
                  },
                ];

          body = {
            name: cryptoUtils.encryptDataUsingEncryptionKey(
              formData.name,
              encryptionKey,
              organisationType
            ),
            referralId: formData.referralId,
            safeAddress: proxy,
            createdBy: account,
            owners: encryptedOwners,
            proxyData: {
              from: account,
              params: [GNOSIS_SAFE_ADDRESS, creationData],
            },
            email: "",
            encryptionKeyData,
            publicKey,
            threshold,
            organisationType,
          };
          dispatch(registerUser(body));
          dispatch(setOwnerDetails(formData.name, proxy, account));
          dispatch(setOwnersAndThreshold(encryptedOwners, threshold));
          dispatch(setOrganisationType(organisationType));
          // setLoadingTx(false);
          // history.push("/dashboard");
        }
      });
    }
  };

  const registerUserToParcel = async () => {
    const encryptionKey = cryptoUtils.getEncryptionKey(
      sign,
      formData.safeAddress
    );
    const organisationType = parseInt(formData.organisationType);

    // set encryptionKey
    setEncryptionKey(encryptionKey);
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
              owner: account,
              name: cryptoUtils.encryptDataUsingEncryptionKey(
                formData.name,
                encryptionKey,
                organisationType
              ),
            },
          ];

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

    const threshold = formData.threshold ? parseInt(formData.threshold) : 1;

    const body = {
      name: cryptoUtils.encryptDataUsingEncryptionKey(
        formData.name,
        encryptionKey,
        organisationType
      ),
      safeAddress: formData.safeAddress,
      createdBy: account,
      owners: encryptedOwners,
      proxyData: {
        from: account,
        params: [GNOSIS_SAFE_ADDRESS, formData.creationData],
      },
      email: "",
      encryptionKeyData,
      publicKey,
      threshold,
      organisationType,
    };
    dispatch(setOwnerDetails(formData.name, formData.safeAddress, account));
    dispatch(setOwnersAndThreshold(encryptedOwners, threshold));
    dispatch(setOrganisationType(organisationType));
    dispatch(registerUser(body));
  };

  const showOrganisationInfo = (info) => {
    dispatch(show(INFO_MODAL, { info }));
  };

  const handleSelectOrganisation = (id) => {
    let flow;
    let organisationType;

    switch (id) {
      case 1:
        flow = FLOWS.INDIVIDUAL;
        organisationType = ORGANISATION_TYPE.PRIVATE;
        break;
      case 2:
        flow = FLOWS.COMPANY;
        organisationType = ORGANISATION_TYPE.PRIVATE;
        break;
      case 3:
        flow = FLOWS.DAO;
        organisationType = ORGANISATION_TYPE.PUBLIC;
        break;
      default:
        flow = FLOWS.INDIVIDUAL;
    }
    dispatch(updateForm({ flow, organisationType }));
    dispatch(chooseStep(step + 1));
  };

  const renderConnect = () => {
    return (
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
            <div className="d-flex align-items-center justify-content-center">
              <Loading color="primary" width="50px" height="50px" />
            </div>
          )}
          {!loadingAccount && (
            <ConnectButton className="mx-auto d-block mt-3 connect" />
          )}
        </InnerCard>
      </div>
    );
  };

  const renderStepHeader = () => {
    const steps = getStepsByFlow(formData.flow);
    return (
      <div>
        <div style={{ height: "50px", padding: "8px 32px" }}>
          {step > 1 && (
            <Button iconOnly onClick={goBack} className="px-0">
              <FontAwesomeIcon icon={faArrowLeft} color="#aaa" />
            </Button>
          )}
        </div>
        <StepInfo>
          <div>
            <h3 className="title">Signup</h3>
            <p className="next">
              {steps[step + 1] ? `Next: ${steps[step + 1]}` : `Finish`}
            </p>
          </div>
          {step >= STEPS.ONE && (
            <div className="step-progress">
              <CircularProgress
                current={step}
                max={getStepsCountByFlow(formData.flow)}
                color="#7367f0"
              />
            </div>
          )}
        </StepInfo>
      </div>
    );
  };

  const renderAboutYou = () => {
    return (
      <StepDetails>
        <p className="title">About You</p>
        <p className="subtitle mb-4">
          Please choose what defines you the best.
        </p>

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
    return (
      <StepDetails>
        {fields.length === 1 && (
          <Img
            src={OwnerPng}
            alt="owner"
            className="my-3"
            width="100px"
            style={{ minWidth: "100px" }}
          />
        )}
        <p className="subtitle">
          Please enter the name and address of the owners.
        </p>
        <div className="my-2">
          {fields.map(({ id, name, owner }, index) => {
            return (
              <div key={id} className="row mb-3 align-items-baseline">
                <div className="col-4">
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
                <div className="col-7">
                  <Input
                    name={`owners[${index}].owner`}
                    register={register}
                    required={`Owner Address is required`}
                    pattern={{
                      value: /^0x[a-fA-F0-9]{40}$/g,
                      message: "Invalid Ethereum Address",
                    }}
                    placeholder={"Enter Address"}
                    defaultValue={owner}
                  />
                  {errors["owners"] &&
                    errors["owners"][index] &&
                    errors["owners"][index].owner && (
                      <Error>{errors["owners"][index].owner.message}</Error>
                    )}
                </div>
                <div className="px-1">
                  {fields.length > 1 && index === fields.length - 1 && (
                    <div>
                      <Button
                        type="button"
                        iconOnly
                        onClick={() => remove(index)}
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          border: "solid 0.5px #dedede",
                          padding: "12px",
                        }}
                      >
                        <img src={DeleteSvg} alt="remove" width="18" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-1">
          <div>
            <Button
              type="button"
              onClick={() => append({})}
              className="px-3 py-2 secondary"
            >
              <span className="mr-2" style={{ fontSize: "24px" }}>
                +
              </span>
              <span>Add More</span>
            </Button>
          </div>
        </div>

        <HighlightedText style={{ marginBottom: "40px" }}>
          <div>
            <Img src={LightbulbIcon} alt="lightbulb" />
          </div>
          <div className="ml-2">
            To get maximum security, add more than one owner.
          </div>
        </HighlightedText>

        <Button type="submit" className="proceed-btn">
          <span>Proceed</span>
          <span className="ml-3">
            <FontAwesomeIcon icon={faArrowRight} color="#fff" />
          </span>
        </Button>
      </StepDetails>
    );
  };

  const renderThreshold = () => {
    return (
      <StepDetails>
        <Img
          src={ThresholdIcon}
          alt="threshold"
          className="my-0"
          width="140px"
          style={{ minWidth: "140px" }}
        />
        <p className="title">Threshold</p>
        <p className="subtitle">
          How many people should authorize transactions?
        </p>
        <div
          className="row mr-4 align-items-center radio-toolbar"
          style={{ padding: "10px 16px 0" }}
        >
          {formData.owners.map(({ owner }, index) => (
            <Input
              name={`threshold`}
              register={register}
              type="radio"
              id={`threshold${index}`}
              value={index + 1}
              defaultChecked={index === 0}
              label={index + 1}
              key={owner}
            />
          ))}
        </div>

        <ErrorMessage name="threshold" errors={errors} />
        <Button type="submit" className="proceed-btn">
          <span>Proceed</span>
          <span className="ml-3">
            <FontAwesomeIcon icon={faArrowRight} color="#fff" />
          </span>
          {/* {isMetaTxEnabled ? `Proceed` : `Create Safe and Proceed`} */}
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
          className="my-4"
          width="100px"
          style={{ minWidth: "100px" }}
        />
        <h3 className="title">We care for Your Privacy </h3>
        <p className="subtitle">Please sign to authorize Parcel.</p>

        <Button
          type="button"
          onClick={signTerms}
          className="proceed-btn"
          disabled={signing}
          loading={signing}
        >
          I'm in
        </Button>
      </StepDetails>
    );
  };

  const renderLoadingImageByStep = (step) => {
    switch (step) {
      case 1:
        return (
          <Img
            src={LoadingSafeIcon1}
            alt="loading-tx1"
            className="loading-img"
          />
        );
      case 2:
        return (
          <Img
            src={LoadingSafeIcon2}
            alt="loading-tx2"
            className="loading-img"
          />
        );
      case 3:
        return (
          <Img
            src={LoadingSafeIcon3}
            alt="loading-tx3"
            className="loading-img"
          />
        );
      default:
        return null;
    }
  };

  const renderReview = () => {
    return loadingTx ? (
      <LoadingTransaction>
        <div className="loading-heading">Creating account on Parcel</div>
        {renderLoadingImageByStep(txLoadingStep)}
        <div className="loading-title">Please do not leave this page</div>
        <div className="loading-subtitle">
          This process should take a couple of minutes
        </div>

        <div className="loading-hash my-3">
          {txHash && (
            <TransactionUrl hash={txHash}>
              View Transaction on Etherscan
            </TransactionUrl>
          )}
        </div>
        <Stepper>
          <StepperContent
            active={txLoadingStep >= 1}
            text={"Transaction Submitted"}
          />
          <StepperContent
            active={txLoadingStep >= 2}
            text={"Creating Wallet"}
          />
          <StepperContent
            active={txLoadingStep >= 3}
            text={"Transaction Completed"}
            last
          />
        </Stepper>
      </LoadingTransaction>
    ) : (
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
                {formData.threshold} out of {formData.owners.length} owners
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

        <HighlightedText className="mt-4 mb-5">
          {isMetaTxEnabled ? (
            <div>You’re about to create a new safe.</div>
          ) : (
            <div>
              You’re about to create a new safe and will have to sign a
              transaction with your currently connected wallet.
            </div>
          )}
        </HighlightedText>

        <Button
          type="submit"
          className="proceed-btn"
          loading={loadingTx}
          disabled={loadingTx}
        >
          <span>Create Account</span>
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
        return renderAboutYou();
      }

      case STEPS.TWO: {
        if (formData.flow === FLOWS.COMPANY)
          return renderName({
            required: "Company Name is required",
            placeholder: "Awesome Company Inc",
            name: "Company Name",
          });
        else if (formData.flow === FLOWS.DAO)
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

      case STEPS.THREE: {
        return renderOwnerDetails();
      }

      case STEPS.FOUR: {
        return renderThreshold();
      }

      case STEPS.FIVE: {
        return renderPrivacy();
      }

      case STEPS.SIX: {
        return renderReview();
      }

      default:
        return null;
    }
  };

  return (
    <Background withImage minHeight="92vh">
      <Container>
        <Card
          className="mx-auto"
          style={{
            minHeight: "600px",
            width: "90%",
            marginTop: "80px",
          }}
        >
          {step !== STEPS.ZERO && !loadingTx && renderStepHeader()}
          <form onSubmit={handleSubmit(onSubmit)}>{renderSteps()}</form>
        </Card>
      </Container>
      <NoReferralModal />
    </Background>
  );
};

export default Register;
