import "styled-components";
import { Theme } from "../global-styles";

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
