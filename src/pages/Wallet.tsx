import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import AppTheme from "../shared-theme/AppTheme";
import Navbar from "../components/Navbar";
import { useFetch } from "../utils/client";
import { useNavigate } from "react-router-dom";

interface Wallet {
  id: number;
  name: string;
  token: string;
  user_id: number;
  uuid: string;
  value: number;
}

export default function WalletManager(props: { disableCustomTheme?: boolean }) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);

  const navigate = useNavigate();

  const fetchWallets = async () => {
    const token = localStorage.getItem("token");
    if (token == null) return;
    const res = await useFetch<any>(`wallets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res) {
      setWallets(res.data);
      setTotalPage(res.totalPage);
    }
  };

  useEffect(() => {
    const cart = localStorage.getItem("cart");

    const fetchData = async () => {
      fetchWallets();
    };

    if (cart != null) {
      const cartArr = JSON.parse(cart);
      setCartCount(cartArr.length);
    }

    fetchData();
  }, []);

  const handleEdit = (wallet: Wallet) => {
    console.log("Edit", wallet);
  };

  const handleDelete = (walletId: number) => {
    setWallets(wallets.filter((w) => w.id !== walletId));
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Navbar cartCount={cartCount} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">Wallet Management</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            color="primary"
            onClick={() => {
              navigate("/add-wallet");
            }}
          >
            Add Wallet
          </Button>
        </Box>

        <Grid container spacing={2}>
          {wallets.map((wallet) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={wallet.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6">{wallet.name}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    Token: {wallet.token}
                  </Typography>
                  <Typography variant="body2">UUID: {wallet.uuid}</Typography>
                  <Typography variant="body2">Value: {wallet.value}</Typography>
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <IconButton
                      color="primary"
                      disabled
                      onClick={() => handleEdit(wallet)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      disabled
                      onClick={() => handleDelete(wallet.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Pagination
          sx={{ marginY: 4 }}
          defaultPage={page}
          count={totalPage}
          color="primary"
          onChange={(_, v) => {
            setPage(v);
          }}
        />
      </Container>
    </AppTheme>
  );
}
