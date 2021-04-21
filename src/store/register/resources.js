import CompanyImg from "assets/images/register/company.svg";
import DaoImg from "assets/images/register/dao.png";
import IndividualImg from "assets/images/register/individual.svg";

export const organisationInfo = [
  {
    id: 1,
    name: "Individual",
    subtitle:
      "Secure your personal crypto assets with best security and convenience",
    img: IndividualImg,
    points: [
      <span>Ideal for individuals</span>,
      <span>
        A <span className="bold">gnosis safe</span> will be created for you
        where you can manage your personal crypto assets
      </span>,
      <span>
        You can keep a single address as the owner or even have multiple owners
        for the gnosis safe
      </span>,
      <span>
        All your information like personal details and transaction history would
        be <span className="bold">end to end encrypted</span>. Only the owners
        of the gnosis safe can view data.
      </span>,
    ],
  },
  {
    id: 2,
    name: "Company",
    subtitle: "Frictionless management of your corporate crypto treasury",
    img: CompanyImg,
    points: [
      <span>Ideal for companies</span>,
      <span>
        A <span className="bold">gnosis safe</span> will be created for your
        company where you can manage your crypto treasury
      </span>,
      <span>
        You can keep a single address as the owner or even have multiple owners
        for the gnosis safe
      </span>,
      <span>
        All your information like teammate details and transaction history would
        be <span className="bold">end to end encrypted</span>. Only the owners
        of the gnosis safe can view data.
      </span>,
    ],
  },
  {
    id: 3,
    name: "DAO",
    subtitle:
      "Collaborate with co-signers of your multisig and manage payouts seamlessly",
    img: DaoImg,
    points: [
      <span>Ideal for Decentralized Autonomous Organizations (DAOs)</span>,
      <span>
        A <span className="bold">gnosis safe</span> will be created for your
        organization where you can manage your funds
      </span>,
      <span>
        You can keep a single address as the owner or even have multiple owners
        for the gnosis safe
      </span>,
      <span>
        All your information like organization details and transaction history
        would be <span className="bold">publicly available</span> even outside
        Parcel
      </span>,
    ],
  },
];

export const FLOWS = {
  COMPANY: "COMPANY",
  INDIVIDUAL: "INDIVIDUAL",
  DAO: "DAO",
};

export const ORGANISATION_TYPE = {
  PRIVATE: "0",
  PUBLIC: "1",
};

export const STEPS = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
};

export const COMPANY_REGISTER_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "About you",
  [STEPS.TWO]: "Owner Details",
  [STEPS.THREE]: "Owner Name and Address",
  [STEPS.FOUR]: "Threshold",
  [STEPS.FIVE]: "Privacy",
  [STEPS.SIX]: "Review your entry",
};

export const DAO_REGISTER_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "About you",
  [STEPS.TWO]: "Owner Details",
  [STEPS.THREE]: "Owner Name and Address",
  [STEPS.FOUR]: "Threshold",
  [STEPS.FIVE]: "Privacy",
  [STEPS.SIX]: "Review your entry",
};

export const INDIVIDUAL_REGISTER_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "About you",
  [STEPS.TWO]: "Owner Details",
  [STEPS.THREE]: "Owner Name and Address",
  [STEPS.FOUR]: "Threshold",
  [STEPS.FIVE]: "Privacy",
  [STEPS.SIX]: "Review your entry",
};
