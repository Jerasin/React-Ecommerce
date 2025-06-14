import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import {
  Badge,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useUserStore } from "../store/userStore";

interface MenuAppBarOption {
  cartCount: number;
}
export default function MenuAppBar({ cartCount }: MenuAppBarOption) {
  // const [cartCount, setCartCount] = React.useState(3);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const staticMenu = [
    {
      name: "Home",
      path: "/home",
      isAdmin: true,
    },
    {
      name: "Product",
      path: "/product",
      isAdmin: true,
    },
    {
      name: "History",
      path: "/history",
      isAdmin: false,
    },
    // {
    //   name: "Product Category",
    //   path: "/product-category",
    // },
  ];
  const user = useUserStore((state) => state.user);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("cart");
    navigate("/sign-in");
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Menu
      </Typography>
      <Divider />
      <List>
        {staticMenu.map((item) => {
          if (item.isAdmin) {
            if (
              user?.userRole.permissionInfos != null &&
              user?.userRole.permissionInfos.length > 0
            ) {
              return (
                <ListItem key={item.name} disablePadding>
                  <ListItemButton sx={{ textAlign: "left" }}>
                    <ListItemText
                      onClick={() => {
                        navigate(item.path);
                      }}
                      primary={item.name}
                    />
                  </ListItemButton>
                </ListItem>
              );
            }
          }

          if (
            user?.userRole.permissionInfos != null &&
            user?.userRole.permissionInfos.length == 0
          ) {
            return (
              <ListItem key={item.name} disablePadding>
                <ListItemButton sx={{ textAlign: "left" }}>
                  <ListItemText
                    onClick={() => {
                      navigate(item.path);
                    }}
                    primary={item.name}
                  />
                </ListItemButton>
              </ListItem>
            );
          }
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Shopping
          </Typography>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              ml: 4,
              marginRight: 4,
            }}
          >
            {staticMenu.map((item) => {
              if (item.isAdmin) {
                if (
                  user?.userRole.permissionInfos != null &&
                  user.userRole.permissionInfos.length > 0
                ) {
                  return (
                    <Button
                      key={item.name}
                      color="inherit"
                      onClick={() => navigate(item.path)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 500,
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255 )", // สี hover จาง ๆ
                        },
                        color: "black",
                      }}
                    >
                      {item.name}
                    </Button>
                  );
                }
              }

              if (
                user?.userRole.permissionInfos != null &&
                user.userRole.permissionInfos.length == 0
              ) {
                return (
                  <Button
                    key={item.name}
                    color="inherit"
                    onClick={() => navigate(item.path)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255 )", // สี hover จาง ๆ
                      },
                      color: "black",
                    }}
                  >
                    {item.name}
                  </Button>
                );
              }
            })}
          </Box>

          <div>
            {user?.userRole != null &&
            user.userRole.permissionInfos.length == 0 ? (
              <IconButton
                sx={{ marginRight: 2 }}
                size="large"
                aria-label={`${cartCount} items in cart`}
                color="inherit"
                onClick={() => {
                  navigate("/cart"); // สมมติเปลี่ยนเส้นทางไปหน้า cart
                }}
              >
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            ) : (
              <></>
            )}

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better mobile performance
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
