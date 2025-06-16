import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { forwardRef } from "react";
import { Button } from "@mui/material";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface DialogErrorProps {
  errorMessage: string;
  errorDialogOpen: boolean;
  setErrorDialogOpen: (value: boolean) => void;
}

function DialogError({
  errorMessage,
  errorDialogOpen,
  setErrorDialogOpen,
}: DialogErrorProps) {
  return (
    <Dialog
      open={errorDialogOpen}
      onClose={() => setErrorDialogOpen(false)}
      slots={{ transition: Transition }}
      keepMounted
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "error.main",
        }}
      >
        <ErrorOutlineIcon color="error" />
        Login Error
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ color: "text.primary", mt: 1 }}
        >
          {errorMessage || "Something went wrong. Please try again."}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setErrorDialogOpen(false)}
          variant="contained"
          color="error"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogError;
