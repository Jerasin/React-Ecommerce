import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AppTheme from "../shared-theme/AppTheme";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DialogError from "../components/DialogError";
import { getRoles, getUsers } from "../api";
import type { RoleInfo } from "../interface";
import { ErrorHandler, handleDialogError } from "../utils";

export default function UserManagement(props: {
  disableCustomTheme?: boolean;
}) {
  const [userList, setUserList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const navigate = useNavigate();
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseDialog = (value: boolean) => {
    setErrorDialogOpen(value);
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      const roleInfoList = await getRoles({
        500: () => ErrorHandler(navigate),
        401: () => ErrorHandler(navigate),
        403: () => ErrorHandler(navigate),
        400: (value?: string) =>
          handleDialogError(value, { setErrorMessage, setErrorDialogOpen }),
      });
      setRoles(roleInfoList.data);

      const users = await getUsers({
        500: () => ErrorHandler(navigate),
        401: () => ErrorHandler(navigate),
        403: () => ErrorHandler(navigate),
        400: (value?: string) =>
          handleDialogError(value, { setErrorMessage, setErrorDialogOpen }),
      });
      setUserList(users.data);
      setTotalPage(users.totalPage);
    };

    fetchData();
  }, []);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Navbar cartCount={0} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigate("/user/create");
            }}
          >
            Add User
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList?.map((user) => (
                <TableRow key={user.username}>
                  <TableCell>
                    <Avatar>{user?.avatar[0]?.toUpperCase() ?? null}</Avatar>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {roles?.find((i) => i.id == user.roleId)?.name ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? "Active" : "Inactive"}
                      color={user.isActive ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => {
                        navigate(`/user/${user.id}/edit`);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton color="error" size="small" disabled>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) ?? []}
            </TableBody>
          </Table>
        </TableContainer>

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
