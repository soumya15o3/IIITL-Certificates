import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import logo from '../Images/Logo.png';

//Decrypt Function (Utility Function)
import { decrypt } from "./decrypt";

// Internal Components
import VerifyBadge from "./VerifyBadge";
import { Error } from "./Error";
import { Loader } from "./Loader";

// Material UI Components
import {
  Button,
  Box,
  useMediaQuery,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  GridList,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CancelIcon from "@material-ui/icons/Cancel";
// import CheckCircleIcon from '@material-ui/icons/CheckCircle';

// Smart Contract essentials
import Web3 from "web3";
import HDWalletProvider from "truffle-hdwallet-provider";
import contract from "truffle-contract";
import Certification from "../contracts/Certification.json";
const CertificationInstance = contract(Certification);

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "30px",
    minHeight: "91.5vh",
    lineHeight: "1.5",
  },
  topGrid: {
    padding: "0px 0px 24px 0px",
     
  },
  certHeader: {
    backgroundColor: "white",
    background: "linear-gradient(109.96deg,#363e98,#8ac6ff),#fff",
    padding: "12px 24px 24px 24px",
    borderRadius: "10px 10px 0 0 ",
    fontWeight: "400",
    color: "white",
     
  },
  certHeader1: {
    fontSize : 35,
  },
  certHeader2: {
    fontSize : 22,
  },
  certTopSection: {
    backgroundColor: "white",
    padding: "20px 24px 8px 24px ",
  },
  // certver: {

  // },
  certMidSection: {
    backgroundColor: "white",
    padding: "24px",
    // borderTop: "1px solid #6066af",
    // borderBottom: "1px solid #6066af",
    textTransform : "uppercase",
    fontSize : "23px",
    lineHeight : 1.8,
    letterSpacing : 0.5,

  },
  certMid1: {
    // fontSize : "29px"
    color : "#363e98"
  },
  certBottomSection: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "0 0 10px 10px",
    fontSize : 18
  },
  paper: {
    marginTop: "30px",
    flexDirection: "column",
    alignItems: "center",
    padding: "0px",
    borderRadius: "10px",
  },
  verificationBox: {
    backgroundColor: (props) => (props.revoked ? "#dd7e7e" : "#7ed7dd"),
    borderRadius: "5px 0 0 5px",
    marginRight: "-24px",
    padding: "12px 8px",
    alignItems: "center",
  },
  verificationStatus: {
    fontSize: "22px",
    lineHeight: "20px",
    fontWeight: "600",
    color: "white",
  },
  verificationDialog: {
    backgroundColor: (props) => (props.revoked ? "#dd7e7e" : "#7ed7dd"),
    background: (props) =>
      props.revoked
        ? "linear-gradient(129deg, rgba(221,126,173,1) 0%, rgba(221,126,126,1) 75%)"
        : "linear-gradient(124deg, rgba(126,170,221,1) 0%, rgba(126,215,221,1) 76%)",
    color: "white",
  },
}));

function CertificateDisplay() {
  const certTemplate = {
    candidateName: "",
    rollNo: "", //soumyabaheti
    courseName: "",
    creationDate: null,
    instituteName: "",
    instituteAcronym: "",
    instituteLink: "",
    revoked: null,
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/FOSSASIA_Logo.svg/600px-FOSSASIA_Logo.svg.png",
  };
  const [certData, setCertData] = useState(certTemplate);
  const [loading, setLoading] = useState(true);
  const [certExists, setCertExists] = useState(null);
  let { id } = useParams();
  const classes = useStyles();

  let web3;
  const connectWeb3 = () => {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.REACT_APP_STAGE !== "testnet"
    ) {
      web3 = new Web3(
        new Web3.providers.HttpProvider(process.env.REACT_APP_LOCAL_ENDPOINT)
      );
    } else {
      web3 = new Web3(
        new HDWalletProvider(
          null,
          process.env.REACT_APP_INFURA_PROJECT_ENDPOINT
        )
      );
    }
    CertificationInstance.setProvider(web3.currentProvider);
    // hack for web3@1.0.0 support for localhost testrpc, see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
    if (typeof CertificationInstance.currentProvider.sendAsync !== "function") {
      CertificationInstance.currentProvider.sendAsync = function() {
        return CertificationInstance.currentProvider.send.apply(
          CertificationInstance.currentProvider,
          arguments
        );
      };
    }

    if (
      process.env.NODE_ENV === "development" &&
      process.env.REACT_APP_STAGE !== "testnet"
    ) {
      console.log("Current host: " + web3.currentProvider.host);
    } else {
      console.log(
        "Current host: " +
          web3.currentProvider.engine._providers[2].provider.host
      );
    }
  };

  const getCertificateData = (certificateId) => {
    CertificationInstance.setProvider(web3.currentProvider);
    return CertificationInstance.deployed()
      .then((ins) => ins.getData(certificateId))
      .catch((err) => {
        console.log(err);
        return Promise.reject("No certificate found with the input id");
      });
  };

  useEffect(async () => {
    console.log("REACT_APP_STAGE", process.env.REACT_APP_STAGE);
    console.log("NODE_ENV", process.env.NODE_ENV);
    console.log(
      "REACT_APP_INFURA_PROJECT_ENDPOINT",
      process.env.REACT_APP_INFURA_PROJECT_ENDPOINT
    );
    connectWeb3();
    getCertificateData(id)
      .then((data) => {
        console.log("Here's the retrieved certificate data of id", id);
        console.log(data);
        //soumyabaheti
        try {
          console.log("candidateName", data[0], decrypt(data[0], id));
          console.log("rollNo", data[1], decrypt(data[1], id));
          console.log("courseName", data[2]);
          console.log("creationDate", data[3], decrypt(data[3], id));
          console.log("instituteName", data[4]);
          console.log("instituteAcronym", data[5]);
          console.log("instituteLink", data[6]);
          console.log("revoked", data[7]);
//soumyabaheti
          setCertData((prev) => ({
            ...prev,
            candidateName: decrypt(data[0], id),
            rollNo: decrypt(data[1], id),
            courseName: data[2],
            creationDate: decrypt(data[3], id),
            instituteName: data[4],
            instituteAcronym: data[5],
            instituteLink: data[6],
            revoked: data[7],
          }));

          setCertExists(true);
          setLoading(false);
        } catch (err) {
          // TODO: Remove this try catch block.
          // Should not enter here at all. Catching just in case
          setCertExists(false); //remove
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Certificate of id", id, "does not exist");
        setCertExists(false);
        setLoading(false);
      });
  }, []);
  return (
    <>
      <Grid container className={classes.root} justifyContent="center">
        <Grid item xs={12} sm={8}>
          {loading && <Loader text="Connecting..." />}
          {!loading && !certExists && (
            <Error
              notFound
              message={`Certificate ${id} does not exists!`}
              label="Please make sure you have entered a valid certificate id that have been created"
              buttonText="Okay"
            />
          )}
          {!loading && certExists && (
            <>
              <Certificate
                id={id}
                candidateName={certData.candidateName}
                rollNo={certData.rollNo} //soumyabaheti
                courseName={certData.courseName}
                creationDate={certData.creationDate}
                instituteName={certData.instituteName}
                instituteAcronym={certData.instituteAcronym}
                instituteLink={certData.instituteLink}
                revoked={certData.revoked}
                logo={certData.logo}
              />
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default CertificateDisplay;

function SimpleDialog(props) {
  const classes = useStyles(props);
  const { onClose, open, selectedValue, revoked } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <div className={classes.verificationDialog}>
        {!revoked && (
          <>
            <DialogTitle id="simple-dialog-title">
              <Typography variant="h5">
                What are Verified Credentials?
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box>
                <b>Verified Credentials (VC)</b> are tamper-proof credentials
                that can be verified cryptographically.
              </Box>
              <Box m={2} />
              <Box>
                There are three essential components of verifiable credentials,
                and they are:
              </Box>
              <Box>✔️ It is machine verifiable</Box>
              <Box>✔️ It is secure and tamper-proof</Box>
              <Box>✔️ Has been issued by a competent authority.</Box>
            </DialogContent>
          </>
        )}

        {revoked && (
          <>
            <DialogTitle id="simple-dialog-title">
              <Typography variant="h5">
                What are Revoked Credentials?
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box>
                <b>Verified Credentials (VC)</b> are tamper-proof credentials
                that can be verified cryptographically.
              </Box>
              <Box m={2} />
              <Box>
                There are three essential components of verifiable credentials,
                and they are:
              </Box>
              <Box>➤ It is machine verifiable</Box>
              <Box>➤ It is secure and tamper-proof</Box>
              <Box>➤ Has been issued by a competent authority.</Box>
              <Box m={3} />
              <Box>
                <b>Revoked Credentials</b> are credentials that are no longer
                valid due to one or more of the following reasons:
              </Box>
              <Box>
                ❌ Candidate has been found to have dishonest conduct throughout
                his/her academic journey, and the credential has been revoked by
                the institute
              </Box>
              <Box>
                ❌ Credential has been issued incorrectly by the institute
              </Box>
            </DialogContent>
          </>
        )}
        <DialogActions>
          <Button
            onClick={handleClose}
            autoFocus
            style={{ color: revoked ? "#7ed7dd" : "#dd7e7e" }}
          >
            Close
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}

const VerificationStatus = (props) => {
  const classes = useStyles(props);
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up("md"));

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (value) => {
    setOpen(false);
  };
  return (
    <>
      <SimpleDialog open={open} onClose={handleClose} revoked={props.revoked} />
      <Box
        className={classes.verificationBox}
        display="flex"
        onClick={handleClickOpen}
      >
        {props.revoked ? <CancelIcon fontSize="large" /> : <VerifyBadge />}

        {sm && (
          <Box marginLeft="10px">
            <Box className={classes.verificationStatus}>
              {props.revoked ? "Revoked" :"Verified"}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

const DetailGroup = (props) => {
  return (
    <>
      <Box>
        <Box fontSize={16} fontWeight={500} color="#363b98">
          {props.label}
        </Box>
        <Box m={1} />
        <Box fontSize={18} fontWeight={600} color="#3a3a3a">
          {props.content}
        </Box>
        <Box m={3} />
      </Box>
    </>
  );
};

function Certificate({
  id,
  candidateName,
  rollNo,
  courseName,
  creationDate,
  instituteName,
  instituteAcronym,
  instituteLink,
  revoked,
}) {
  const classes = useStyles();
  const dateObject = new Date(creationDate);
  const day = dateObject.toLocaleString("en-US", { day: "numeric" });
  const month = dateObject.toLocaleString("en-US", { month: "long" });
  const year = dateObject.toLocaleString("en-US", { year: "numeric" });
  const dateString = `${day} ${month} ${year}`;
  const currentyear = `${year}`;
  return (
    <>
      <Paper className={classes.paper}>
        <Grid container>
        
            
          
          <Grid item xs = {12} className={classes.certHeader} align = "center">
          <Grid item xs={12} className={classes.topGrid}>
          <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Grid item xs = {6} align = "left">
              IIITL {dateString}
              </Grid>
              <Grid item xs = {6} align = "right">
              Enrollment No. {rollNo}
              </Grid>
            </Grid>
            </Grid>
            <Grid item xs = {12} className={classes.certHeader1}>
              Indian Institute of Information Technology, Lucknow
            </Grid>
            <Grid item xs = {12} className={classes.certHeader2}>An Institute of National Importance by the Act of Parliament of India</Grid>
          </Grid>

          <Grid item xs={12} className={classes.certTopSection}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
            <Grid item xs = {3} align = "right">
              </Grid>
              <Grid item xs = {4} align = "center">
                <img style={{ width: "35%", height: "35%" }} src = {logo} alt = "Logo"/>
              </Grid>
              <Grid item>
              </Grid>
              <Grid item xs = {2}>
                <VerificationStatus revoked={revoked} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={classes.certMidSection} align = "center">
            <Grid container>
              <Grid item xs = {12} lg = {12}>THE GOVERNING BODY</Grid>
              <Grid item xs = {12}>UPON THE RECOMMENDATION OF THE SENATE</Grid>
              <Grid item xs = {12}>HEREBY CONFERS UPON</Grid>
              <Grid item xs = {12} className={classes.certMid1}><b>{candidateName}</b></Grid>
              <Grid item xs = {12}>THE DEGREE OF </Grid>
              <Grid item xs = {12} className={classes.certMid1}><b>BACHELOR OF TECHNOLOGY</b></Grid>
              <Grid item xs = {12}>IN </Grid>
              <Grid item xs = {12} className={classes.certMid1}><b>{courseName}</b></Grid>
              <Grid item xs = {12}>ON HAVING SUCCESSFULLY COMPLETED</Grid>
              <Grid item xs = {12}>THE PRESCRIBED REQUIREMENTS</Grid>
              <Grid item xs = {12}>IN THE YEAR {currentyear}.</Grid>
              
              
              
              
              
              
              
              
              
              
              {/* <Grid item xs={12} lg={6}>
                <DetailGroup label="Course Name" content={courseName} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <DetailGroup label="Institute Name" content={instituteName} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <DetailGroup
                  label="Institute Acronym"
                  content={instituteAcronym}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <DetailGroup label="Institute Link" content={instituteLink} />
              </Grid> */}
            </Grid>
          </Grid>

          <Grid item sm={12} className={classes.certBottomSection}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Grid item xs = {6}>
              Chairman, Governing Body
              </Grid>
              <Grid item xs = {6} align = "right">
              Chairman, Senate
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
