import {
  faHome,
  // faChartPie,
  faMoneyBill,
  // faFolderOpen,
  faUserCircle,
  faQuestionCircle,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
  {
    id: 0,
    link: "/dashboard",
    name: "Home",
    icon: faHome,
  },
  // {
  //   id: 1,
  //   link: "/dashboard",
  //   name: "Accounting",
  //   icon: faChartPie,
  // },
  {
    id: 2,
    link: "/dashboard/payments",
    name: "Payments",
    icon: faMoneyBill,
  },
  {
    id: 3,
    link: "/dashboard/people",
    name: "People",
    icon: faUserCircle,
  },
  {
    id: 4,
    link: "/dashboard/transactions",
    name: "Transactions",
    icon: faReceipt,
  },
  {
    id: 5,
    href: "https://discord.com/invite/UwRZjmMYVS",
    name: "Support",
    icon: faQuestionCircle,
    style: { position: "absolute", top: "75%", minWidth: "100px" },
  },
];

export default navItems;
