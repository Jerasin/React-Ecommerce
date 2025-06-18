import {
  Box,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AppTheme from "../shared-theme/AppTheme";
import Navbar from "../components/Navbar";
import DialogError from "../components/DialogError";
import { getOrderDetail } from "../api";
import type { OrderDetailItem } from "../interface";
import { ErrorHandler, handleDialogError } from "../utils";

export default function OrderDetail(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [items, setItems] = useState<OrderDetailItem[]>([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseDialog = (value: boolean) => {
    setErrorDialogOpen(value);
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (orderId != null) {
        const orderDetail = await getOrderDetail(parseInt(orderId), {
          500: () => ErrorHandler(navigate),
          401: () => ErrorHandler(navigate),
          403: () => ErrorHandler(navigate),
          400: (value?: string) =>
            handleDialogError(value, { setErrorMessage, setErrorDialogOpen }),
        });
        setItems(orderDetail.data);
      }
    };

    fetchData();
  }, [orderId]);

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.amount, 0);
  };

  return (
    <AppTheme {...props}>
      <CssBaseline />
      <Navbar cartCount={0} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Order Detail - #{orderId}
        </Typography>

        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid size={{ xs: 12 }} key={item.productId}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{item.productName}</Typography>
                  <Typography color="text.secondary">
                    Quantity: {item.amount}
                  </Typography>
                  <Typography color="text.secondary">
                    Unit Price: ${item.price.toFixed(2)}
                  </Typography>
                  <Typography color="text.secondary">
                    Total: ${(item.price * item.amount).toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" align="right">
          Total Price: ${getTotal().toFixed(2)}
        </Typography>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
          marginBottom={4}
        >
          <Button variant="contained" onClick={() => navigate(-1)}>
            Back
          </Button>
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
