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
import { useNavigate } from "react-router-dom";
import DialogError from "../components/DialogError";
import { getListHistory } from "../api";
import { ErrorHandler, handleDialogError } from "../utils";

interface HistoryItem {
  id: number;
  totalAmount: number;
  totalPrice: number;
  updatedAt: string;
}

const History = (props: { disableCustomTheme?: boolean }) => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseDialog = (value: boolean) => {
    setErrorDialogOpen(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const histories = await getListHistory(page, {
        500: () => ErrorHandler(navigate),
        401: () => ErrorHandler(navigate),
        403: () => ErrorHandler(navigate),
        400: (value?: string) =>
          handleDialogError(value, { setErrorMessage, setErrorDialogOpen }),
      });
      setHistories(histories.data);
      setTotalPage(histories.totalPage);

      const cart = localStorage.getItem("cart");

      if (cart != null) {
        const cartItem = JSON.parse(cart);
        setCartCount(cartItem.length);
      }
    };
    fetchData();
  }, [page]);

  const handleDetail = (id: number) => {
    console.log("Go to detail of order id:", id);
    navigate(`/order-detail/${id}`);
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

        <DialogError
          errorMessage={errorMessage}
          errorDialogOpen={errorDialogOpen}
          setErrorDialogOpen={handleCloseDialog}
        />
      </Container>
    </AppTheme>
  );
};

export default History;
