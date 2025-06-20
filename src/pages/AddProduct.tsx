import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useRef, useState } from "react";
import AppTheme from "../shared-theme/AppTheme";
import Navbar from "../components/Navbar";
import DialogError from "../components/DialogError";
import { createProduct, getProductCategories } from "../api";
import { ErrorHandler, handleDialogError } from "../utils";
import type { CreateProduct } from "../interface";

interface FormValues {
  name: string;
  description?: string;
  imgUrl?: string;
  price: number;
  amount: number;
  productCategoryId: number;
  saleOpenDate?: Dayjs | null;
  saleCloseDate?: Dayjs | null;
}

export default function AddProduct(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [productCates, setProductCates] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(1);
  const isFetchingRef = useRef(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const totalPage = Math.ceil(total / pageSize);
  const handleMenuScroll = () => {
    if (!menuRef.current || isFetchingRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = menuRef.current;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 50;
    const totalPages = Math.ceil(total / pageSize);

    if (nearBottom && productCates.length < total && page < totalPages) {
      isFetchingRef.current = true;
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (page > totalPage) return;

      const res = await getProductCategories(page, pageSize, {
        500: () => ErrorHandler(navigate),
        401: () => ErrorHandler(navigate),
        403: () => ErrorHandler(navigate),
        400: (value?: string) =>
          handleDialogError(value, { setErrorMessage, setErrorDialogOpen }),
      });
      setProductCates((prev: any) => {
        const existingIds = new Set(prev.map((item: any) => item.id));
        const newItems = res.data.filter(
          (item: any) => !existingIds.has(item.id)
        );
        const updated = [...prev, ...newItems];
        return updated;
      });
      setTotal(res.total);
      isFetchingRef.current = false;
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    const currentMenu = menuRef.current;
    if (currentMenu) {
      currentMenu.addEventListener("scroll", handleMenuScroll);
    }
    return () => {
      if (currentMenu) {
        currentMenu.removeEventListener("scroll", handleMenuScroll);
      }
    };
  }, [productCates, total]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      imgUrl: "",
      price: 0,
      amount: 0,
      productCategoryId: 1,
      saleOpenDate: null,
      saleCloseDate: null,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const payload: CreateProduct = {
      ...data,
      saleOpenDate: data.saleOpenDate
        ? data.saleOpenDate.toISOString()
        : undefined,
      saleCloseDate: data.saleCloseDate
        ? data.saleCloseDate.toISOString()
        : undefined,
    };

    console.log("submit data:", payload);

    await createProduct(payload, {
      500: () => ErrorHandler(navigate),
      401: () => ErrorHandler(navigate),
      403: () => ErrorHandler(navigate),
      400: (value?: string) =>
        handleDialogError(value, { setErrorMessage, setErrorDialogOpen }),
    });

    navigate("/");
  };

  const handleCloseDialog = (value: boolean) => {
    setErrorDialogOpen(value);
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Navbar cartCount={0} />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add Product
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Description"
            fullWidth
            margin="normal"
            rows={3}
            {...register("description")}
          />

          <TextField
            label="Image URL"
            fullWidth
            margin="normal"
            {...register("imgUrl")}
          />

          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: { value: 0, message: "Price must be >= 0" },
            })}
            error={!!errors.price}
            helperText={errors.price?.message}
          />

          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            {...register("amount", {
              required: "Amount is required",
              valueAsNumber: true,
              min: { value: 0, message: "Amount must be >= 0" },
            })}
            error={!!errors.amount}
            helperText={errors.amount?.message}
          />

          {productCates.length > 0 && (
            <Grid sx={{ marginY: 2 }}>
              <Controller
                name="productCategoryId"
                control={control}
                defaultValue={productCates[0]?.id ?? ""}
                rules={{ required: "Please select a category" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Product Category"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    slotProps={{
                      select: {
                        MenuProps: {
                          PaperProps: {
                            sx: { maxHeight: 200, overflowY: "auto" },
                            ref: (node: HTMLDivElement) => {
                              if (node && !menuRef.current) {
                                menuRef.current = node;
                                node.addEventListener(
                                  "scroll",
                                  handleMenuScroll
                                );
                              }
                            },
                          },
                        },
                      },
                    }}
                  >
                    {productCates.map((item: any) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          )}

          <Controller
            name="saleOpenDate"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Sale Open Date"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                />
              </LocalizationProvider>
            )}
          />

          <Controller
            name="saleCloseDate"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Sale Close Date"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                />
              </LocalizationProvider>
            )}
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Add Product
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
