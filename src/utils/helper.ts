export const getItemLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);

  if (value == null) {
    throw Error("getItemLocalStorage not found");
  }

  return value;
};

export const handleDialogError = (
  value?: string,
  options?: {
    setErrorMessage: (value: string) => void;
    setErrorDialogOpen: (value: boolean) => void;
  }
) => {
  const { setErrorMessage, setErrorDialogOpen } = options ?? {};
  console.log("value", value);
  if (value != null && setErrorMessage != null && setErrorDialogOpen != null) {
    setErrorMessage(value);
    setErrorDialogOpen(true);
  }
};
