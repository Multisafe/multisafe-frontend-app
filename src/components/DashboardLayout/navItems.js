import HomeIcon from "assets/icons/sidebar/home-icon.svg";
import PeopleIcon from "assets/icons/sidebar/people-icon.svg";
import AssetsIcon from "assets/icons/sidebar/assets-icon.svg";
import TransactionsIcon from "assets/icons/sidebar/transactions-icon.svg";
import SupportIcon from "assets/icons/sidebar/support-icon.svg";
import ActiveHomeIcon from "assets/icons/sidebar/home-icon-active.svg";
import ActivePeopleIcon from "assets/icons/sidebar/people-icon-active.svg";
import ActiveAssetsIcon from "assets/icons/sidebar/assets-icon-active.svg";
import ActiveTransactionsIcon from "assets/icons/sidebar/transactions-icon-active.svg";
import ActiveSupportIcon from "assets/icons/sidebar/support-icon-active.svg";

export const mainNavItems = [
  {
    link: "/dashboard",
    name: "Home",
    icon: HomeIcon,
    activeIcon: ActiveHomeIcon,
  },
  {
    link: "/dashboard/people",
    name: "People",
    icon: PeopleIcon,
    activeIcon: ActivePeopleIcon,
  },
  {
    link: "/dashboard/account",
    name: "Assets",
    icon: AssetsIcon,
    activeIcon: ActiveAssetsIcon,
  },
  {
    link: "/dashboard/transactions",
    name: "Transactions",
    icon: TransactionsIcon,
    activeIcon: ActiveTransactionsIcon,
  },
  {
    href: "https://discord.com/invite/UwRZjmMYVS",
    name: "Support",
    icon: SupportIcon,
    activeIcon: ActiveSupportIcon,
  },
];
