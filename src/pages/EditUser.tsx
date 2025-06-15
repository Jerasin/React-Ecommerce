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
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../utils/client";
import AppTheme from "../shared-theme/AppTheme";
import Navbar from "../components/Navbar";

interface User {
  id: number;
  username: string;
  fullname: string;
  email: string;
  avatar: string;
  roleId: number;
  isActive: boolean;
}

const EditUser = (props: { disableCustomTheme?: boolean }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<User | null>(null);
  const [defaultData, setDefaultData] = useState<User | null>(null);
  const [roles, setRoles] = useState<{ id: number; name: string }[] | null>(
    null
  );

  const fetchUser = async (token: string) => {
    const res = await useFetch<any>(`users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res) {
      setFormData(res.data.user);
      setDefaultData(res.data.user);
    }
  };

  const fetchRoles = async (token: string) => {
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
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetchUser(token);
      await fetchRoles(token);
    };

    fetchData();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [name]: name === "roleId" ? parseInt(value) : value,
      };
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        isActive: e.target.checked,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("formData", formData);
    try {
      const token = localStorage.getItem("token");
      if (!token || formData == null) return;
      await useFetch(`users/${formData?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      navigate("/user-management");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Navbar cartCount={0} />

      {formData != null ? (
        <Card sx={{ maxWidth: 600, mx: "auto", p: 4, mt: 4 }}>
          <Typography variant="h5" mb={2}>
            Edit User
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
              label="Avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              fullWidth
            />

            {roles && roles.length > 0 ? (
              <TextField
                select
                label="Role"
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                fullWidth
              >
                {roles && roles.length > 0 ? (
                  roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Loading roles...</MenuItem>
                )}
              </TextField>
            ) : null}

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
                onClick={() => setFormData(defaultData)}
              >
                Reset
              </Button>
              <Button variant="contained" type="submit">
                Save
              </Button>
            </Box>
          </Box>
        </Card>
      ) : null}
    </AppTheme>
  );
};

export default EditUser;
