import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  CssBaseline,
  Typography,
  Grid,
  Pagination,
  Box,
} from "@mui/material";
import AppTheme from "../shared-theme/AppTheme";
import Navbar from "../components/Navbar";
import React, { useEffect } from "react";
import { useUserStore, type UserInfoStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import DialogError from "../components/DialogError";
import { getProducts, getUserInfo } from "../api";
import type { Product } from "../interface";
import { ErrorHandler, handleDialogError } from "../utils";

export default function ProductPage(props: { disableCustomTheme?: boolean }) {
  const [cartCount, setCartCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);
  const [productData, setProductData] = React.useState<Product[]>([]);
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const addCart = (product: Product) => {
    const cart = localStorage.getItem("cart");
    if (cart != null) {
      const cartObj: Product[] = JSON.parse(cart);
      const index = cartObj.findIndex((i) => i.id == product.id);

      if (index != -1) {
        cartObj[index].amount += 1;
      } else {
        cartObj.push({ ...product, amount: 1 });
      }

      setCartCount(cartObj.length);
      localStorage.setItem("cart", JSON.stringify(cartObj));
    } else {
      const newProduct = { ...product, amount: 1 };
      localStorage.setItem("cart", JSON.stringify([newProduct]));
      setCartCount(1);
    }
  };

  const handleCloseDialog = (value: boolean) => {
    setErrorDialogOpen(value);
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      const cart = localStorage.getItem("cartCount");
      if (cart != null) {
        setCartCount(parseInt(cart));
      }

      const userInfo = await getUserInfo({
        500: () => ErrorHandler(navigate),
        401: () => ErrorHandler(navigate),
        403: () => ErrorHandler(navigate),
        400: (value?: string) =>
          handleDialogError(value, { setErrorMessage, setErrorDialogOpen }),
      });
      const products = await getProducts(page, {
        500: () => ErrorHandler(navigate),
        401: () => ErrorHandler(navigate),
        403: () => ErrorHandler(navigate),
        400: (value?: string) =>
          handleDialogError(value, { setErrorMessage, setErrorDialogOpen }),
      });

      setProductData(products.data);
      setTotalPage(products.totalPage);
      const userInfoStore: UserInfoStore = userInfo.data;
      setUser(userInfoStore);
    };

    const cart = localStorage.getItem("cart");

    if (cart != null) {
      const cartObj: Product[] = JSON.parse(cart);
      setCartCount(cartObj.length);
    }
    fetchData();
  }, [page]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <Navbar cartCount={cartCount} />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4" gutterBottom>
            Our Products
          </Typography>

          {user?.userRole?.permissionInfos != null &&
          user?.userRole?.permissionInfos.length > 0 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                navigate("/add-product");
              }}
            >
              Add Product
            </Button>
          ) : (
            <></>
          )}
        </Box>

        <Grid container spacing={4}>
          {productData?.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    product.imgUrl != null && product.imgUrl != ""
                      ? product.imgUrl
                      : "/images/no_img.jpg"
                  }
                  alt="no img"
                />
                <CardContent>
                  <Typography variant="h6">Name: {product.name}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Description: {product.description}
                  </Typography>

                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Price:
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                      <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        {product.price}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 4 }}>
                      <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Amount:
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                      <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        {product.amount}
                      </Typography>
                    </Grid>
                  </Grid>

                  {product.saleOpenDate != null ? (
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                          Open Sell Date:
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 8 }}>
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                          {new Date(product.saleOpenDate).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                              timeZone: "Asia/Bangkok",
                            }
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}

                  {product.saleCloseDate != null ? (
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                          Close Sell Date:
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 8 }}>
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                          {new Date(product.saleCloseDate).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                              timeZone: "Asia/Bangkok",
                            }
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  ) : null}
                </CardContent>

                {user?.userRole.permissionInfos != null &&
                user.userRole.permissionInfos.length === 0 &&
                product.amount > 0 ? (
                  <CardActions sx={{ mt: "auto", p: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => {
                        addCart(product);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                ) : null}
              </Card>
            </Grid>
          )) ?? []}
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
}
