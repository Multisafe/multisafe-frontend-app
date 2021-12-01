type Person = {
  firstName: string;
  lastName?: string;
};

export const getName = ({ firstName, lastName }: Person) =>
  `${firstName}${lastName ? ` ${lastName}` : ""}`;
