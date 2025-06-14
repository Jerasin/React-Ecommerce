import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Container,
  CssBaseline,
  Pagination,
} from "@mui/material";
import AppTheme from "../shared-theme/AppTheme";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useFetch } from "../utils/client";
import { useNavigate } from "react-router-dom";

interface HistoryItem {
  id: number;
  totalAmount: number;
  totalPrice: number;
  updatedAt: string;
}

interface HistoryData {
  data: HistoryItem[];
  page: number;
  pageSize: number;
  totalPage: number;
}

const History = (props: { disableCustomTheme?: boolean }) => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  
  const fetchHistories = async (page: number) => {
    try {
      const token = localStorage.getItem("token");
      const cart = localStorage.getItem("cart");

      if (cart != null) {
        const cartItem = JSON.parse(cart);
        setCartCount(cartItem.length);
      }
      if (token == null) return;
      const histories = await useFetch<HistoryData>(`orders?${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (histories) {
        setHistories(histories.data);
        setTotalPage(histories.totalPage);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchHistories(page);
    };
    fetchData();
  }, [page]);

  const handleDetail = (id: number) => {
    console.log("Go to detail of order id:", id);
    navigate(`/order-detail/${id}`)
    // คุณสามารถ navigate ไปหน้ารายละเอียด เช่น navigate(`/history/${id}`)
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Navbar cartCount={cartCount} />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Order History
        </Typography>

        <Grid container spacing={3}>
          {histories.map((item) => (
            <Grid size={{ xs: 12 }} key={item.id}>
              <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="h6">Order #{item.id}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Items: {item.totalAmount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Price: ${item.totalPrice.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Time:
                      {new Date(item.updatedAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone: "Asia/Bangkok",
                      })}
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleDetail(item.id)}
                    >
                      View Detail
                    </Button>
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
};

export default History;
