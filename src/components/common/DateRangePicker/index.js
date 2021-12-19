import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { DateRangePicker } from "react-date-range";

export default function DateRange(props) {
  return <DateRangePicker {...props} />;
}
