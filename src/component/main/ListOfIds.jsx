import React, { useState, useEffect } from 'react'
import SideNavBar from "../../navbar/SideNavBar"
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import LogoutIcon from '@mui/icons-material/Logout'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Divider from "@mui/material/Divider"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { getDatabase, ref, onValue, remove } from "firebase/database";

function ListOfIds() {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getData()
  }, []);

  const deleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        deleteApi(id);
      }
    });
  };

  const deleteApi = async (id) => {
    const db = getDatabase();
    await remove(ref(db, 'barangayResidentID/' + id));
    Swal.fire("Deleted!", "Your file has been deleted.", "success");
    getData()
  };

  const getData = async () => {
    const db = getDatabase();
    const idRef = ref(db, 'barangayResidentID/');
    onValue(idRef, (snapshot) => {
      let records = [];
      snapshot.forEach(childSnapshot => {
        // let keyName = childSnapshot.key;
        let data = childSnapshot.val()
        records.push(data)
      })
      setRows(records)
    });
  }

  const filterData = (v) => {
    if (v) {
      setRows([v])
    } else {
      getData()
    }
  };

  const { logout } = UserAuth()
  const navigate = useNavigate()

  const [open, setOpen] = useState(true)
  const handleNavbar = () => {
    setOpen(!open)
  }

  const MySwal = withReactContent(Swal)
  const handleLogout = async (e) => {
    try {
      await logout()
      navigate('/login')
      MySwal.fire({
        title: <p>Logout</p>,
        text: 'Logout successful',
        icon: 'success',
      });
    } catch (e) {
      MySwal.fire({
        title: <p>Error!</p>,
        text: e.message,
        icon: 'error',
      });
    }
  }

  return (
    <div className='flex'>
      <SideNavBar open={open} />
      <main className='py-4 px-12 flex-1 overflow-auto'>
        <div className='grid grid-cols-1 gap-2 mb-6 lg:grid-cols-1'>
          <AppBar position="static" color='transparent'>
            <Toolbar>
              <IconButton
                onClick={handleNavbar}
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                List of IDs
              </Typography>
              <IconButton onClick={handleLogout} color="primary" aria-label="logout" component="label">
                <LogoutIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <div className='p-0'>
            <div className='mt-10 sm:mt-0 w-full'>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ padding: "20px" }}
                >
                  List of IDs
                </Typography>
                <Divider />
                <Box height={10} />
                <Stack direction="row" spacing={2} className="my-2 mb-2">
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={rows}
                    sx={{ width: 300 }}
                    onChange={(e, v) => filterData(v)}
                    getOptionLabel={(rows) => rows.FirstName || ""}
                    renderInput={(params) => (
                      <TextField {...params} size="small" label="Search People" />
                    )}
                  />
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                  ></Typography>
                </Stack>
                <Box height={10} />
                <TableContainer sx={{ maxHeight: 330 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          key="left"
                          style={{ minWidth: '180px' }}
                        >
                          ID Type
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: '180px' }}
                        >
                          First Name
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: '180px' }}
                        >
                          Middle Name
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: '180px' }}
                        >
                          Surname
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: '180px' }}
                        >
                          Suffix
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: '180px' }}
                        >
                          Civil Status
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: '180px' }}
                        >
                          Date of Birth
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: '180px' }}
                        >
                          Registration Number
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: '180px' }}
                        >
                          Precinct Number
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: '180px' }}
                        >
                          Valid Until
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: '180px' }}
                        >
                          Nationality
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: '180px' }}
                        >
                          Address
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: '180px' }}
                        >
                          Photo
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: '180px' }}
                        >
                          Signature
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: '180px' }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.ID}>
                              <TableCell align="left">
                                {row.IDType}
                              </TableCell>
                              <TableCell align="left">
                                {row.FirstName}
                              </TableCell>
                              <TableCell align="left">
                                {row.MiddleName}
                              </TableCell>
                              <TableCell align="left">
                                {row.Surname}
                              </TableCell>
                              <TableCell align="left">
                                {row.Suffix}
                              </TableCell>
                              <TableCell align="left">
                                {row.CivilStatus}
                              </TableCell>
                              <TableCell align="left">
                                {row.DateOfBirth}
                              </TableCell>
                              <TableCell align="left">
                                {row.RegistrationNumber}
                              </TableCell>
                              <TableCell align="left">
                                {row.PrecinctNumber}
                              </TableCell>
                              <TableCell align="left">
                                {row.ValidUntil}
                              </TableCell>
                              <TableCell align="left">
                                {row.Nationality}
                              </TableCell>
                              <TableCell align="left">
                                {row.Address}
                              </TableCell>
                              <TableCell align="left">
                                {<img src={row.Photo} className='table-photo' alt='user-pic' />}
                              </TableCell>
                              <TableCell align="left">
                                {<img src={row.SigniturePhoto} className='table-photo' alt='signature' />}
                              </TableCell>
                              <TableCell align="left">
                                <Stack spacing={2} direction="row">
                                  <EditIcon
                                    style={{
                                      fontSize: "20px",
                                      color: "blue",
                                      cursor: "pointer",
                                    }}
                                    className="cursor-pointer"
                                  // onClick={() => editUser(row.id)}
                                  />
                                  <DeleteIcon
                                    style={{
                                      fontSize: "20px",
                                      color: "darkred",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      deleteUser(row.ID);
                                    }}
                                  />
                                </Stack>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ListOfIds
