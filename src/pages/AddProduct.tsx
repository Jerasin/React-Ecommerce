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
import { useEffect, useState } from "react";
import { useFetch } from "../utils/client";

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

export default function AddProduct() {
  const navigate = useNavigate();
  const [productCates, setProductCates] = useState<any>(null);

  useEffect(() => {
    const fetchData = async (page: number) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const productCate = await useFetch<any>(`products/categories?${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (productCate != null) {
          setProductCates(productCate.data);
        }
      } catch (error) {
        console.log("Error", error);
      }
    };

    fetchData(1);
  }, []);

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
    const token = localStorage.getItem("token");
    if (!token) return;
    const payload = {
      ...data,
      saleOpenDate: data.saleOpenDate
        ? data.saleOpenDate.toISOString()
        : undefined,
      saleCloseDate: data.saleCloseDate
        ? data.saleCloseDate.toISOString()
        : undefined,
    };

    console.log("submit data:", payload);

    await useFetch(`products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    });

    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <CssBaseline />
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
          multiline
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

        {productCates != null ? (
          <Grid size={{ xs: 12 }} sx={{ marginY: 2 }}>
            <Controller
              name="productCategoryId"
              control={control}
              defaultValue={productCates[0].id}
              rules={{ required: "Please select a category" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Product Category"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  {productCates?.map((item: any) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
        ) : (
          <></>
        )}

        <Controller
          name="saleOpenDate"
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select date"
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
    </Container>
  );
}
