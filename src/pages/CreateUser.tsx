import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Card,
  Typography,
  MenuItem,
  CssBaseline,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../utils/client";
import AppTheme from "../shared-theme/AppTheme";
import Navbar from "../components/Navbar";
import DialogError from "../components/DialogError";

interface User {
  username: string;
  password: string;
  fullname: string;
  email: string;
  avatar: string;
  roleId: number;
  isActive: boolean;
}

const CreateUser = (props: { disableCustomTheme?: boolean }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<User>({
    username: "",
    fullname: "",
    email: "",
    avatar: "",
    roleId: 0,
    isActive: true,
    password: "",
  });

  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchRoles = async (token: string) => {
    try {
      const res = await useFetch<any>(`role_infos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res) {
        setRoles(res.data);
      }
    } catch (err: any) {
      console.log("err", err);
      setErrorMessage(err?.message || "Network error");
      setErrorDialogOpen(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetchRoles(token);
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "roleId" ? parseInt(value) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) return;

      await useFetch(`users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      navigate("/user-management");
    } catch (err: any) {
      console.log("err", err);
      setErrorMessage(err?.message || "Network error");
      setErrorDialogOpen(true);
    }
  };

  const handleCloseDialog = (value: boolean) => {
    setErrorDialogOpen(value);
    navigate("/");
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Navbar cartCount={0} />

      <Card sx={{ maxWidth: 600, mx: "auto", p: 4, mt: 4 }}>
        <Typography variant="h5" mb={2}>
          Create User
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Avatar"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Role"
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            fullWidth
          >
            {roles.length > 0 ? (
              roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Loading roles...</MenuItem>
            )}
          </TextField>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isActive}
                onChange={handleCheckboxChange}
                name="isActive"
              />
            }
            label="Active"
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              type="reset"
              onClick={() =>
                setFormData({
                  username: "",
                  fullname: "",
                  email: "",
                  avatar: "",
                  roleId: 0,
                  isActive: true,
                  password: "",
                })
              }
            >
              Reset
            </Button>
            <Button variant="contained" type="submit">
              Create
            </Button>
          </Box>
        </Box>

        <DialogError
          errorMessage={errorMessage}
          errorDialogOpen={errorDialogOpen}
          setErrorDialogOpen={handleCloseDialog}
        />
      </Card>
    </AppTheme>
  );
};

export default CreateUser;
