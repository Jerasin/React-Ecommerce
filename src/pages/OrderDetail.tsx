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
import { useFetch } from "../utils/client";

interface OrderItem {
  amount: number;
  orderID: number;
  price: number;
  productId: number;
  productName: string;
}

export default function OrderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams(); // สมมุติว่ารับ orderId จาก URL
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await useFetch<any>(`orders/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res) {
        setItems(res.data);
      }
    };

    fetchData();
  }, [orderId]);

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.amount, 0);
  };

  return (
    <AppTheme>
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

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      </Container>
    </AppTheme>
  );
}
