import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AppTheme from "../shared-theme/AppTheme";
import Navbar from "../components/Navbar";
import { uuidv7 } from "uuidv7";
import { useState } from "react";
import DialogError from "../components/DialogError";
import { createWallet } from "../api";
import { ErrorHandler, handleDialogError } from "../utils";

interface WalletForm {
  name: string;
  token: string;
  userId?: number;
  uuid: string;
  value: number;
}

export default function AddWallet() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WalletForm>();
  const navigate = useNavigate();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: WalletForm) => {
    data.uuid = uuidv7();
    data.token = uuidv7();

    await createWallet(data, {
      500: () => ErrorHandler(navigate),
      401: () => ErrorHandler(navigate),
      403: () => ErrorHandler(navigate),
      400: (value?: string) =>
        handleDialogError(value, { setErrorMessage, setErrorDialogOpen }),
    });

    navigate(-1);
  };

  const handleCloseDialog = (value: boolean) => {
    setErrorDialogOpen(value);
  };

  return (
    <AppTheme>
      <CssBaseline />
      <Navbar cartCount={0} />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create New Wallet
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Wallet Name"
            margin="normal"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            fullWidth
            label="Value"
            margin="normal"
            type="number"
            {...register("value", {
              required: "Value is required",
              valueAsNumber: true,
              min: { value: 0, message: "Price must be >= 0" },
            })}
            error={!!errors.token}
            helperText={errors.token?.message}
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
          </Box>
        </Box>

        <DialogError
          errorMessage={errorMessage}
          errorDialogOpen={errorDialogOpen}
          setErrorDialogOpen={handleCloseDialog}
        />
      </Container>
    </AppTheme>
  );
}
