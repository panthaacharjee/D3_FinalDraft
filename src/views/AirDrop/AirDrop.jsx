import {
  Box,
  Button,
  Fade,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
  Grid,
  SvgIcon,
} from "@material-ui/core";
import "./airdrop.scss";
import { useWeb3Context } from "../../hooks/web3Context";
import { useSelector, useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks";
import { onDividEnd } from "../../slices/BondSlice";
import {
  prettifySeconds,
  secondsUntilBlock,
  shorten,
  trim,
} from "../../helpers";
import { ReactComponent as Background } from "../../assets/page-bg.svg";

function AirDrop() {
  // const { address, connect } = useWeb3Context();
  // const history = useHistory();
  const { address, provider } = useWeb3Context();
  const dispatch = useDispatch();
  const networkId = useAppSelector((state) => state.network.networkId);
  const poolBalance = useAppSelector((state) => {
    return state.account.balances?.poolBalance || 0;
  });
  const totalBUSDClaimed = useAppSelector((state) => {
    return state.account.balances?.totalBUSDClaimed || 0;
  });
  const totalPayout = useAppSelector((state) => {
    return state.account.balances?.totalPayout || 0;
  });
  const pendingBUSD = useAppSelector((state) => {
    return state.account.balances?.pendingBUSD || 0;
  });
  const nextPayOut = useAppSelector((state) => {
    return state.account.balances?.nextPayOut || 0;
  });
  const rebasePool = useAppSelector((state) => {
    return state.account.balances?.rebasePool || 0;
  });
  const stakedDEFI = useAppSelector((state) => {
    return state.account.balances?.sohm || 0;
  });

  const currentBlock = useAppSelector((state) => {
    return state.app.currentBlock;
  });

  const vestingPeriod = (nextPayOut) => {
    const currentBlock_ = parseInt(currentBlock);
    const seconds = secondsUntilBlock(currentBlock_, nextPayOut);
    return prettifySeconds(seconds, "hr");
  };
  async function DividEnd() {
    // alert("OndividEnd")
    // TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
    await onDividEnd({
      address: address,
      networkID: networkId,
      provider,
      dispatch,
    });
  }

  return (
    <>
      {/* Background image */}
      <div
        style={{
          width: "150vw",
          height: "30vh",
          position: "absolute",
          top: "7%",
          left: 0,
        }}
      >
        <SvgIcon
          style={{ width: "auto", height: "100%" }}
          component={Background}
          width="100%"
          height="100%"
          viewBox="0 0 1440 187"
          fill="none"
        />
      </div>

      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "85vh", zIndex: 100, width: "60%" }}
      >
        Top Card
        <Grid item>
          <Paper
            elevation={0}
            style={{
              background: "#1C1C1C",
              borderRadius: "12px",
              height: "100%",
            }}
          >
            <Grid container justifyContent="center" alignItems="center">
              <Grid item xs={12} sm={8}>
                <Paper></Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      className="connect-button"
                      onClick={() => {
                        DividEnd();
                      }}
                    >
                      Claim Dividend
                    </Button>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Bottom Cards */}
        <Grid
          container
          item
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              style={{
                background: "#1C1C1C",
                borderRadius: "12px",
                height: "100%",
              }}
            >
              <Grid
                container
                direction="row"
                style={{ width: "100%", height: "100%" }}
              >
                {/* Logo */}
                <Grid item sm={4}></Grid>

                {/* Data */}
                <Grid container direction="row" item sm={8}>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", alignItems: "flex-end" }}
                  >
                    <Typography
                      style={{ marginBottom: "8px", color: "#929292" }}
                    >
                      Next Pool Release
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", alignItems: "flex-start" }}
                  >
                    <Typography variant="h4" className="ohm-card-value">
                      {vestingPeriod(rebasePool)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              style={{
                background: "#1C1C1C",
                borderRadius: "12px",
                height: "100%",
              }}
            >
              <Grid
                container
                direction="row"
                style={{ width: "100%", height: "100%" }}
              >
                {/* Logo */}
                <Grid item sm={4}></Grid>

                {/* Data */}
                <Grid container direction="row" item sm={8}>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", alignItems: "flex-end" }}
                  >
                    <Typography
                      style={{ marginBottom: "8px", color: "#929292" }}
                    >
                      Total Payouts
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", alignItems: "flex-start" }}
                  >
                    <Typography variant="h4" className="ohm-card-value">
                      $ {trim(totalPayout, 3)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              style={{
                background: "#1C1C1C",
                borderRadius: "12px",
                height: "100%",
              }}
            >
              <Grid
                container
                irection="row"
                style={{ width: "100%", height: "100%" }}
              >
                {/* Logo */}
                <Grid item sm={4}></Grid>

                {/* Data */}
                <Grid container direction="row" item sm={8}>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", alignItems: "flex-end" }}
                  >
                    <Typography
                      style={{ marginBottom: "8px", color: "#929292" }}
                    >
                      Dividend Growth
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", alignItems: "flex-start" }}
                  >
                    <Typography variant="h4" className="ohm-card-value">
                      0
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              style={{
                background: "#1C1C1C",
                borderRadius: "12px",
                height: "100%",
              }}
            >
              <Grid
                container
                irection="row"
                style={{ width: "100%", height: "100%" }}
              >
                {/* Logo */}
                <Grid item sm={4}></Grid>

                {/* Data */}
                <Grid container direction="row" item sm={8}>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", alignItems: "flex-end" }}
                  >
                    <Typography
                      style={{ marginBottom: "8px", color: "#929292" }}
                    >
                      Your Staked sDEFI
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", alignItems: "flex-start" }}
                  >
                    <Typography variant="h4" className="ohm-card-value">
                      {trim(stakedDEFI, 3)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              style={{
                background: "#1C1C1C",
                borderRadius: "12px",
                height: "100%",
              }}
            >
              <Grid
                container
                irection="row"
                style={{ width: "100%", height: "100%" }}
              >
                {/* Logo */}
                <Grid item sm={4}></Grid>

                {/* Data */}
                <Grid container direction="row" item sm={8}>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", alignItems: "flex-end" }}
                  >
                    <Typography
                      style={{ marginBottom: "8px", color: "#929292" }}
                    >
                      Next Payout
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", alignItems: "flex-start" }}
                  >
                    <Typography variant="h4" className="ohm-card-value">
                      {vestingPeriod(nextPayOut)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={0}
              style={{
                background: "#1C1C1C",
                borderRadius: "12px",
                height: "100%",
              }}
            >
              <Grid
                container
                direction="row"
                style={{ width: "100%", height: "100%" }}
              >
                {/* Logo */}
                <Grid item sm={4}></Grid>

                {/* Data */}
                <Grid container direction="row" item sm={8}>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", alignItems: "flex-end" }}
                  >
                    <Typography
                      style={{ marginBottom: "8px", color: "#929292" }}
                    >
                      Your Staked sDEFI
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", alignItems: "flex-start" }}
                  >
                    <Typography variant="h4" className="ohm-card-value">
                      ${trim(totalBUSDClaimed, 3)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      <div id="airdropContainer">
        <div id="airdrop-view">
          <Grid xs={12} md={12}>
            <div className="airdrop-card-view">
              <Paper className="ohm-card">
                <Box className="card-header">
                  <Typography variant="h5" style={{ color: " #f4c10b " }}>
                    {" "}
                    D3 Dividend [ 3.3.3.3]{" "}
                  </Typography>
                </Box>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-end"
                >
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                      className=""
                      style={{
                        paddingBottom: "25px",
                        paddingLeft: "30px",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6"> Pool Balance</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                      className=""
                      style={{
                        paddingBottom: "25px",
                        paddingRight: "30px",
                        alignItems: "center",
                      }}
                    >
                      <h2 style={{ textAlign: "end", margin: "auto" }}>
                        ${trim(poolBalance, 3)}
                      </h2>
                    </Box>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-end"
                >
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                      className=""
                      style={{
                        paddingBottom: "25px",
                        paddingLeft: "30px",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6"> Total Payouts:</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                      className=""
                      style={{
                        paddingBottom: "25px",
                        paddingRight: "30px",
                        alignItems: "center",
                      }}
                    >
                      <h2 style={{ textAlign: "end", margin: "auto" }}>
                        {" "}
                        ${trim(totalPayout, 3)}
                      </h2>
                    </Box>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-end"
                >
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                      className=""
                      style={{
                        paddingBottom: "25px",
                        paddingLeft: "30px",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6"> Your Staked sDEFI:</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                      className=""
                      style={{
                        paddingBottom: "25px",
                        paddingRight: "30px",
                        alignItems: "center",
                      }}
                    >
                      <h2 style={{ textAlign: "end", margin: "auto" }}>
                        {trim(stakedDEFI, 3)}
                      </h2>
                    </Box>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-end"
                >
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                      className=""
                      style={{
                        paddingBottom: "25px",
                        paddingLeft: "30px",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6"> Next Payout : </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                      className=""
                      style={{
                        paddingBottom: "25px",
                        paddingRight: "30px",
                        alignItems: "center",
                      }}
                    >
                      <h2 style={{ textAlign: "end", margin: "auto" }}>
                        {vestingPeriod(nextPayOut)}
                      </h2>
                    </Box>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-end"
                >
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                      className=""
                      style={{
                        paddingBottom: "25px",
                        paddingLeft: "30px",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6"> Next Pool Rebase : </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                      className=""
                      style={{
                        paddingBottom: "25px",
                        paddingRight: "30px",
                        alignItems: "center",
                      }}
                    >
                      <h2 style={{ textAlign: "end", margin: "auto" }}>
                        {vestingPeriod(rebasePool)}
                      </h2>
                    </Box>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-end"
                >
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                      className=""
                      style={{
                        paddingBottom: "25px",
                        paddingLeft: "30px",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {" "}
                        Total BUSD Claimed :{" "}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                      className=""
                      style={{
                        paddingBottom: "25px",
                        paddingRight: "30px",
                        alignItems: "center",
                      }}
                    >
                      <h2 style={{ textAlign: "end", margin: "auto" }}>
                        ${trim(totalBUSDClaimed, 3)}
                      </h2>
                    </Box>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-end"
                >
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                      className=""
                      style={{
                        paddingBottom: "25px",
                        paddingLeft: "30px",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {" "}
                        Unrealised Pending BUSD :
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                      className=""
                      style={{
                        paddingBottom: "25px",
                        paddingRight: "30px",
                        alignItems: "center",
                      }}
                    >
                      <h2 style={{ textAlign: "end", margin: "auto" }}>
                        ${trim(pendingBUSD, 3)}
                      </h2>
                    </Box>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    className="connect-button"
                    onClick={() => {
                      DividEnd();
                    }}
                  >
                    Claim Dividend
                  </Button>
                </Grid>
              </Paper>
            </div>
          </Grid>
        </div>
      </div>
    </>
  );
}

export default AirDrop;
