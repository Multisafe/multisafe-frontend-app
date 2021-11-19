type Props = {
  children: any;
  hideError?: Boolean;
};

const ErrorText = ({ children, hideError }: Props) => {
  return (
    <div className="text-red my-3" style={{ fontSize: "1.4rem" }}>
      {!hideError && <span>Error: </span>}
      {children}
    </div>
  );
};

export default ErrorText;
