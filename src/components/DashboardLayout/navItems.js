import HomeIcon from "assets/icons/sidebar/home-icon.svg";
import PeopleIcon from "assets/icons/sidebar/people-icon.svg";
import AssetsIcon from "assets/icons/sidebar/assets-icon.svg";
import TransactionsIcon from "assets/icons/sidebar/transactions-icon.svg";
import SupportIcon from "assets/icons/sidebar/support-icon.svg";
import DocsIcon from "assets/icons/sidebar/docs-icon.svg";
import ActiveHomeIcon from "assets/icons/sidebar/home-icon-active.svg";
import ActivePeopleIcon from "assets/icons/sidebar/people-icon-active.svg";
import ActiveAssetsIcon from "assets/icons/sidebar/assets-icon-active.svg";
import ActiveTransactionsIcon from "assets/icons/sidebar/transactions-icon-active.svg";
import ActiveSupportIcon from "assets/icons/sidebar/support-icon-active.svg";
import ExchangeIcon from "assets/icons/sidebar/exchange-icon.svg";
import ExchangeIconActive from "assets/icons/sidebar/exchange-icon-active.svg";
import { routeGenerators } from "constants/routes/generators";
import {FEATURE_NAMES} from "hooks/useFeatureManagement";

export const mainNavItems = [
  {
    link: routeGenerators.dashboard.root,
    name: "Home",
    icon: HomeIcon,
    activeIcon: ActiveHomeIcon,
  },
  {
    link: routeGenerators.dashboard.people,
    name: "People",
    icon: PeopleIcon,
    activeIcon: ActivePeopleIcon,
  },
  {
    link: routeGenerators.dashboard.exchange,
    name: "Exchange",
    icon: ExchangeIcon,
    activeIcon: ExchangeIconActive,
    feature: FEATURE_NAMES.TOKEN_SWAP
  },
  {
    link: routeGenerators.dashboard.assets,
    name: "Assets",
    icon: AssetsIcon,
    activeIcon: ActiveAssetsIcon,
  },
  {
    link: routeGenerators.dashboard.transactions,
    name: "Transactions",
    icon: TransactionsIcon,
    activeIcon: ActiveTransactionsIcon,
  },
  {
    href: "https://discord.gg/yHwg8DkBpf",
    name: "Support",
    icon: SupportIcon,
    activeIcon: ActiveSupportIcon,
  },
  {
    href: "https://docs.coinshift.xyz/",
    name: "Docs",
    icon: DocsIcon,
    activeIcon: DocsIcon,
  },
];
