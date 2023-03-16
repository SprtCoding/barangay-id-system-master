import React, { useState, useEffect, useRef } from "react";
import SideNavBar from "../../navbar/SideNavBar";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import LogoutIcon from "@mui/icons-material/Logout";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import LaunchIcon from "@mui/icons-material/Launch";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignature } from "@fortawesome/free-solid-svg-icons";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import blguLogo from "../../assets/blgulogo.png";
import html2canvas from "html2canvas";
import { Clear, Save } from "@mui/icons-material";
import SignaturePad from "react-signature-canvas";

function ListOfIds() {
  //modal
  const [showModal, setShowModal] = useState(false);

  const idCardRef = useRef(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [records, setRecords] = useState([]);
  const [openSignatureModal, setOpenSignatureModal] = useState(false);
  const [signID, setSignID] = useState();
  const [isPrintedID, setIsPrintedID] = useState();

  const { updateUserDataSign, updateUserDataIsPrinted } = UserAuth();

  const [isPrinted, setIsPrinted] = useState(false);

  const sigCanvas = useRef();
  const [sign, setSign] = useState("");
  const saveSign = () => {
    setSign(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
    setOpenSignatureModal(false);
    try {
      updateUserDataSign(signID, sign, "Not Printed");
    } catch (e) {
      MySwal.fire({
        title: <p>Error!</p>,
        text: e.message,
        icon: "error",
      });
    }
  };

  const clear = () => {
    sigCanvas.current.clear();
  };

  const handlePrint = (id) => {
    setIsPrintedID(id);
    getDataPrint(id);
    setShowModal(true);
  };

  const handleSignaturePad = (id) => {
    setSignID(id)
    setOpenSignatureModal(true)
  }

  const getDataPrint = async (id) => {
    const db = getDatabase();
    const idRef = ref(db, "barangayResidentID/" + id);
    onValue(idRef, (snapshot) => {
      const data = snapshot.val();
      setRecords(data);
      console.log(data);
    });
  };

  useEffect(() => {
    window.onafterprint = () => {
      if (isPrinted) {
        Swal.fire({
          title: "Printing",
          text: "Printing is done.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire("Saving Data", "Data save successfully.", "success");
            window.location.reload();
          }
        });
      } else {
        Swal.fire({
          title: "Printing",
          text: "Printing was cancelled.",
          icon: "error",
        });
        window.location.reload();
      }
      setIsPrinted(false);
    };
  }, [isPrinted]);

  const handleDownloadID = () => {
    html2canvas(idCardRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.download = "id-card.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const handlePrintID = () => {
    try {
      updateUserDataIsPrinted(isPrintedID, "Printed");
    } catch (e) {
      MySwal.fire({
        title: <p>Error!</p>,
        text: e.message,
        icon: "error",
      });
    }
    html2canvas(idCardRef.current).then((canvas) => {
      const printContent = document.querySelector(`#id-side`).innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      // Use window.matchMedia to detect when the print dialog has been closed
      const mediaQueryList = window.matchMedia('print');
      mediaQueryList.addListener((mql) => {
        if (!mql.matches) {
          // The print dialog has been closed
          try {
            updateUserDataIsPrinted(isPrintedID, "Not Printed");
            setTimeout(handleAfterPrint, 5000);
          } catch (e) {
            MySwal.fire({
              title: <p>Error!</p>,
              text: e.message,
              icon: "error",
            });
          }
        }
      });
    });
  };

  // function onPrintCancel() {
  //   Swal.fire("Print", "Print cancel.", "warning");
  //   console.log(isPrintedID);
  //   // Your code to execute after the print operation is completed
  // }

  function handleAfterPrint() {
    if (document.hidden) {
      return;
    }
    setIsPrinted(true);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#ea4343",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        deleteApi(id);
      }
    });
  };

  const deleteApi = async (id) => {
    const db = getDatabase();
    await remove(ref(db, "barangayResidentID/" + id));
    Swal.fire("Deleted!", "Your file has been deleted.", "success");
    getData();
  };

  const getData = async () => {
    const db = getDatabase();
    const idRef = ref(db, "barangayResidentID/");
    onValue(idRef, (snapshot) => {
      let records = [];
      snapshot.forEach((childSnapshot) => {
        // let keyName = childSnapshot.key;
        let data = childSnapshot.val();
        records.push(data);
      });
      setRows(records);
    });
  };

  const filterData = (v) => {
    if (v) {
      setRows([v]);
    } else {
      getData();
    }
  };

  const { logout } = UserAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const handleNavbar = () => {
    setOpen(!open);
  };

  const MySwal = withReactContent(Swal);
  const handleLogout = async (e) => {
    try {
      await logout();
      navigate("/login");
      MySwal.fire({
        title: <p>Logout</p>,
        text: "Logout successful",
        icon: "success",
      });
    } catch (e) {
      MySwal.fire({
        title: <p>Error!</p>,
        text: e.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="flex">
      <SideNavBar open={open} />
      <main className="py-4 px-12 flex-1 overflow-auto">
        <div className="grid grid-cols-1 gap-2 mb-6 lg:grid-cols-1">
          <AppBar position="static" color="transparent">
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
              <IconButton
                onClick={handleLogout}
                color="primary"
                aria-label="logout"
                component="label"
              >
                <LogoutIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <div className="p-0">
            <div className="mt-10 sm:mt-0 w-full">
              <Paper
                sx={{ width: "100%", overflow: "hidden", marginTop: "20px" }}
              >
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
                      <TextField
                        {...params}
                        size="small"
                        label="Search People"
                      />
                    )}
                  />
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                  ></Typography>
                </Stack>
                <Box height={10} />
                <TableContainer sx={{ maxHeight: 450 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          key="left"
                          style={{ minWidth: "180px", fontWeight: "bold" }}
                        >
                          ID Type
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: "180px", fontWeight: "bold" }}
                        >
                          First Name
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: "180px", fontWeight: "bold" }}
                        >
                          Middle Name
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: "180px", fontWeight: "bold" }}
                        >
                          Surname
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: "180px", fontWeight: "bold" }}
                        >
                          Suffix
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: "180px", fontWeight: "bold" }}
                        >
                          Civil Status
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: "180px", fontWeight: "bold" }}
                        >
                          Date of Birth
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: "180px", fontWeight: "bold" }}
                        >
                          Registration Number
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: "180px", fontWeight: "bold" }}
                        >
                          Precinct Number
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: "180px", fontWeight: "bold" }}
                        >
                          Valid Until
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: "180px", fontWeight: "bold" }}
                        >
                          Nationality
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: "180px", fontWeight: "bold" }}
                        >
                          Address
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: "180px", fontWeight: "bold" }}
                        >
                          Photo
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: "180px", fontWeight: "bold" }}
                        >
                          Signature
                        </TableCell>
                        <TableCell
                          key="left"
                          style={{ minWidth: "180px", fontWeight: "bold" }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.ID}
                            >
                              <TableCell align="left">{row.IDType}</TableCell>
                              <TableCell align="left">
                                {row.FirstName}
                              </TableCell>
                              <TableCell align="left">
                                {row.MiddleName}
                              </TableCell>
                              <TableCell align="left">{row.Surname}</TableCell>
                              <TableCell align="left">{row.Suffix}</TableCell>
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
                              <TableCell align="left">{row.Address}</TableCell>
                              <TableCell align="left">
                                {
                                  <img
                                    src={row.Photo}
                                    className="table-photo"
                                    alt="user-pic"
                                  />
                                }
                              </TableCell>
                              <TableCell align="left">
                                {
                                  <img
                                    src={row.SigniturePhoto}
                                    className="table-photo"
                                    alt="signature"
                                  />
                                }
                              </TableCell>
                              <TableCell align="left">
                                <Stack spacing={2} direction="row">
                                  {row.isPrinted === "Printed" ? (
                                    <>
                                      <LaunchIcon
                                        style={{
                                          fontSize: "20px",
                                          color: "blue",
                                          cursor: "pointer",
                                        }}
                                        className="cursor-pointer"
                                      // onClick={() => editUser(row.id)}
                                      />
                                    </>
                                  ) : row.isPrinted === "Need Signature" ? (
                                    <>
                                      <FontAwesomeIcon
                                        icon={faSignature}
                                        style={{
                                          fontSize: "20px",
                                          color: "blue",
                                          cursor: "pointer",
                                        }}
                                        className="cursor-pointer"
                                        onClick={() => {
                                          handleSignaturePad(row.ID);
                                        }}
                                      />

                                    </>
                                  ) : (
                                    <>
                                      <PrintIcon
                                        style={{
                                          fontSize: "20px",
                                          color: "green",
                                          cursor: "pointer",
                                        }}
                                        className="cursor-pointer"
                                        onClick={() => {
                                          handlePrint(row.ID);
                                        }}
                                      />
                                    </>
                                  )}
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
            {openSignatureModal && (
              <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <h3 className="text-xl font-semibold">
                          Your Generated ID
                        </h3>
                        <button
                          className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                          onClick={() => setOpenSignatureModal(false)}
                        >
                          <span className="bg-transparent text-black-600 h-6 w-6 text-2xl block outline-none focus:outline-none">
                            ×
                          </span>
                        </button>
                      </div>
                      {/*body*/}
                      <div className="relative p-6 flex-auto">
                        <SignaturePad
                          ref={sigCanvas}
                          canvasProps={{
                            className: "sigCanvas",
                          }}
                          penColor="black"
                        />
                        <div className="grid grid-cols-2">
                          <IconButton
                            onClick={saveSign}
                            color="gray"
                            aria-label="save"
                            component="label"
                          >
                            <Save />
                          </IconButton>
                          <IconButton
                            onClick={clear}
                            color="gray"
                            aria-label="clear"
                            component="label"
                          >
                            <Clear />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {showModal ? (
              <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative w-auto my-6 mx-auto max-w-7xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <h3 className="text-xl font-semibold">
                          Your Generated ID
                        </h3>
                        <button
                          className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                          onClick={() => setShowModal(false)}
                        >
                          <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                            ×
                          </span>
                        </button>
                      </div>
                      {/*body*/}
                      <div className="relative p-6 flex-auto">
                        <div
                          className="grid grid-cols-2 p-0 gap-4"
                          ref={idCardRef}
                          id="id-side"
                        >
                          {/*id front*/}
                          <div className="grid grid-cols-1 p-0" id="id-front">
                            <div
                              className={`${records.IDType === "Green Card"
                                ? "id-card border"
                                : records.IDType === "Yellow Card"
                                  ? "id-card-yellow border"
                                  : records.IDType === "White Card"
                                    ? "id-card-white border"
                                    : "id-card border"
                                } grid grid-rows-8 gap-0 p-0`}
                            >
                              <div className="grid grid-cols-6 row-span-1 py-2">
                                <img
                                  className="blgu-logo col-span-1"
                                  src={blguLogo}
                                  alt=""
                                />
                                <div className="flex flex-col p-0 mt-1 col-span-5">
                                  <span
                                    className={`${records.IDType === "Green Card"
                                      ? "text-hdr"
                                      : records.IDType === "Yellow Card"
                                        ? "text-hdr-black"
                                        : records.IDType === "White Card"
                                          ? "text-hdr-black"
                                          : "text-hdr"
                                      }`}
                                  >
                                    Republic of the Philippines
                                  </span>
                                  <span
                                    className={`${records.IDType === "Green Card"
                                      ? "text-hdr"
                                      : records.IDType === "Yellow Card"
                                        ? "text-hdr-black"
                                        : records.IDType === "White Card"
                                          ? "text-hdr-black"
                                          : "text-hdr"
                                      }`}
                                  >
                                    Province of Antique
                                  </span>
                                  <span
                                    className={`${records.IDType === "Green Card"
                                      ? "text-hdr"
                                      : records.IDType === "Yellow Card"
                                        ? "text-hdr-black"
                                        : records.IDType === "White Card"
                                          ? "text-hdr-black"
                                          : "text-hdr"
                                      }`}
                                  >
                                    Municipality of Caluya
                                  </span>
                                  <span
                                    className={`${records.IDType === "Green Card"
                                      ? "text-hdr"
                                      : records.IDType === "Yellow Card"
                                        ? "text-hdr-black"
                                        : records.IDType === "White Card"
                                          ? "text-hdr-black"
                                          : "text-hdr"
                                      }`}
                                  >
                                    BARANGAY SEMIRARA
                                  </span>
                                </div>
                              </div>
                              <h2 className="id-title row-span-2 mb-2">
                                Barangay Identification Card
                              </h2>
                              <div className="grid grid-cols-12 row-span-5 p-0 px-5 gap-2">
                                <div className="grid grid-rows-5 col-span-3 gap-2">
                                  <div className="id-pic row-span-2">
                                    <img
                                      src={records.Photo}
                                      alt=""
                                      className="id-pic-user"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-y-1 row-span-4 items-center">
                                    <img
                                      src={records.SigniturePhoto}
                                      alt=""
                                      className="sign-user"
                                    />
                                    <p className="label-id">Signature</p>
                                  </div>
                                </div>

                                <div className="flex flex-col p-0 px-2 gap-1 gap-y-0 col-span-9 ml-4">
                                  <div className="grid grid-cols-4 p-0">
                                    <p className="label-id">First Name</p>
                                    <p className="label-id">Middle Name</p>
                                    <p className="label-id">Surname</p>
                                    <p className="label-id">Suffix</p>
                                  </div>
                                  <div className="grid grid-cols-4 p-0">
                                    {/* <p className='label-id-data'>{fname + " " + mname + " " + sname + " " + suffix}</p> */}
                                    <p className="label-id-data">
                                      {records.FirstName}
                                    </p>
                                    <p className="label-id-data">
                                      {records.MiddleName}
                                    </p>
                                    <p className="label-id-data">
                                      {records.Surname}
                                    </p>
                                    <p className="label-id-data">
                                      {records.Suffix}
                                    </p>
                                  </div>
                                  {/* <p className='label-id'>{fname + ' ' + mname + ' ' + sname + ' ' + suffix}</p> */}
                                  {/* 2nd */}
                                  <div className="flex flex-col p-0 gap-1 gap-y-0">
                                    <div className="grid grid-cols-3 p-0">
                                      <p className="label-id">Date of Birth</p>
                                      <p className="label-id">Civil Status</p>
                                      <p className="label-id">Nationality</p>
                                    </div>
                                    <div className="grid grid-cols-3 p-0">
                                      <p className="label-id-data">
                                        {records.DateOfBirth}
                                      </p>
                                      <p className="label-id-data">
                                        {records.CivilStatus}
                                      </p>
                                      <p className="label-id-data">
                                        {records.Nationality}
                                      </p>
                                    </div>
                                  </div>
                                  {/* 3rd */}
                                  <div className="flex flex-col p-0 gap-0 gap-y-0">
                                    <div className="grid grid-cols-5 p-0">
                                      <p className="label-id col-span-2">
                                        Registration Number
                                      </p>
                                      <p className="label-id col-span-2">
                                        Precinct Number
                                      </p>
                                      <p className="label-id col-span-1">
                                        Valid Until
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-5 p-0">
                                      <p className="label-id-data col-span-2">
                                        {records.RegistrationNumber}
                                      </p>
                                      <p className="label-id-data col-span-2">
                                        {records.PrecinctNumber}
                                      </p>
                                      <p className="label-id-data col-span-1">
                                        {records.ValidUntil}
                                      </p>
                                    </div>
                                  </div>
                                  {/* 4rd */}
                                  <div className="flex flex-col p-0 gap-1 gap-y-0">
                                    <p className="label-id">Address</p>
                                    <p className="label-id-data col-span-2">
                                      {records.Address}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/*id back*/}
                          <div className="grid grid-cols-1 p-0" id="id-back">
                            <div
                              className={`${records.IDType === "Green Card"
                                ? "id-card-back border"
                                : records.IDType === "Yellow Card"
                                  ? "id-card-back-yellow border"
                                  : records.IDType === "White Card"
                                    ? "id-card-back-white border"
                                    : "id-card-back border"
                                } grid grid-rows-8 gap-0 p-0`}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {/*footer*/}
                      <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => {
                            setShowModal(false);
                          }}
                        >
                          Close
                        </button>
                        <button
                          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={handleDownloadID}
                        >
                          Download
                        </button>
                        <button
                          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={handlePrintID}
                        >
                          Print
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
              </>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ListOfIds;
