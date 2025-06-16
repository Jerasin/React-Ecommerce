import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import AppTheme from "../shared-theme/AppTheme";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useFetch } from "../utils/client";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import { useNavigate } from "react-router-dom";
import DialogError from "../components/DialogError";

export interface PermissionInfo {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export interface UserRole {
  name: string;
  description: string;
  permissionInfos: PermissionInfo[];
}

export interface UserProfile {
  id: number;
  username: string;
  fullname: string;
  avatar: string;
  userId: number;
  userRole: UserRole;
  email: string;
  createdAt: string;
}

const Profile = (props: { disableCustomTheme?: boolean }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleCloseDialog = (value: boolean) => {
    setErrorDialogOpen(value);
    navigate("/");
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const user = await useFetch<any>(`users/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("user", user);
      if (user) {
        setUser(user.data);
      }
    } catch (err: any) {
      console.log("err", err);
      setErrorMessage(err?.message || "Network error");
      setErrorDialogOpen(true);
    }
  };

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (cart != null) {
      const cartArr = JSON.parse(cart);
      setCartCount(cartArr.length);
    }
    const fetchData = async () => {
      await fetchUser();
    };

    fetchData();
  }, []);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Navbar cartCount={cartCount} />
      <Box sx={{ p: 4 }}>
        <Box
          display={"flex"}
          justifyContent="space-between"
          alignItems="center"
          marginBottom={2}
        >
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>

          <ColorModeSelect />
        </Box>

        {user != null ? (
          <Card sx={{ p: 3 }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: deepPurple[500],
                    margin: "auto",
                    fontSize: 40,
                  }}
                  src={user.avatar ?? undefined}
                >
                  {!user.avatar && user?.fullname}
                </Avatar>

                <Typography variant="h6" sx={{ mt: 2 }}>
                  {user.fullname}
                </Typography>

                {/* <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => alert("Edit profile")}
                >
                  Edit Profile
                </Button> */}
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography>{user.email}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Username
                      </Typography>
                      <Typography>{user.username}</Typography>
                    </Grid>
                    {/* <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography>""</Typography>
                    </Grid> */}
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" color="text.secondary">
                        Member Since
                      </Typography>
                      <Typography>
                        {new Date(user.createdAt).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          timeZone: "Asia/Bangkok",
                        })}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        ) : (
          <></>
        )}

        <DialogError
          errorMessage={errorMessage}
          errorDialogOpen={errorDialogOpen}
          setErrorDialogOpen={handleCloseDialog}
        />
      </Box>
    </AppTheme>
  );
};

export default Profile;
