import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Divider,
  CssBaseline,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import AppTheme from "../shared-theme/AppTheme";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useFetch } from "../utils/client";

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  amount: number;
  imgUrl?: string;
}

export default function CartPage(props: { disableCustomTheme?: boolean }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wallets, setWallets] = useState<{ id: number; name: string }[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<number | "">("");
  const navigate = useNavigate();

  const fetchUserWallets = async () => {
    const token = localStorage.getItem("token");

    if (token == null) return;

    const decoded = jwtDecode<{ id: number }>(token);

    const response = await useFetch<any>(`users/${decoded.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data?.wallets) {
      setWallets(response.data.wallets);
    }
  };

  const createOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token == null || selectedWallet == null) return;
      const orders = cartItems.map((i) => {
        return {
          amount: i.amount,
          product_id: i.id,
        };
      });

      useFetch(`orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: {
          orders,
          wallet_id: selectedWallet,
        },
      });

      localStorage.removeItem("cart")
      navigate('/')
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }

    fetchUserWallets();
  }, []);

  const handleRemove = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getTotalPrice = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.amount, 0);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Cart
        </Typography>

        {cartItems.length === 0 ? (
          <div>
            <Typography variant="body1">Your cart is empty.</Typography>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="contained" color="primary" sx={{ marginX: 2 }}>
                Sell
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Back
              </Button>
            </Box>
          </div>
        ) : (
          <Grid container spacing={3}>
            {cartItems.map((item) => (
              <Grid size={{ xs: 12 }} key={item.id}>
                <Card sx={{ display: "flex", alignItems: "center" }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 150 }}
                    image={
                      item.imgUrl != null && item.imgUrl != ""
                        ? item.imgUrl
                        : "/images/no_img.jpg"
                    }
                    alt={item.name}
                  />
                  <Box
                    sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                  >
                    <CardContent>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Price: ${item.price.toFixed(2)}
                      </Typography>
                      <Typography variant="body2">
                        Quantity: {item.amount}
                      </Typography>
                    </CardContent>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}

            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel id="wallet-label">Payment Method</InputLabel>
              <Select
                labelId="wallet-label"
                value={selectedWallet}
                label="Payment Method"
                onChange={(e) => setSelectedWallet(e.target.value as number)}
              >
                {wallets.map((wallet) => (
                  <MenuItem key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" align="right">
                Total: ${getTotalPrice().toFixed(2)}
              </Typography>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginX: 2 }}
                  onClick={createOrder}
                >
                  Sell
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Back
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </AppTheme>
  );
}
