import { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePathForNetwork } from "../../hooks/usePathForNetwork";
import { useHistory } from "react-router";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { t, Trans } from "@lingui/macro";
import NewReleases from "@material-ui/icons/NewReleases";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { trim } from "../../helpers";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import "./stake.scss";
import { useWeb3Context } from "../../hooks/web3Context";
import { isPendingTxn, txnButtonText } from "../../slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";
import { useAppSelector } from "../../hooks";
import { ExpandMore } from "@material-ui/icons";
import StakeRow from "./StakeRow";
import Metric from "../../components/Metric/Metric";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Stake() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { provider, address, connect } = useWeb3Context();
  const networkId = useAppSelector((state) => state.network.networkId);
  usePathForNetwork({ pathName: "stake", networkID: networkId, history });

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const isAppLoading = useAppSelector((state) => state.app.loading);
  const currentIndex = useAppSelector((state) => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useAppSelector((state) => {
    return state.app.fiveDayRate;
  });
  const ohmBalance = useAppSelector((state) => {
    return state.account.balances.ohm;
  });

  const sohmBalance = useAppSelector((state) => {
    return state.account.balances && state.account.balances.sohm;
  });

  const stakeAllowance = useAppSelector((state) => {
    return (state.account.staking && state.account.staking.ohmStake) || 0;
  });
  const unstakeAllowance = useAppSelector((state) => {
    return (state.account.staking && state.account.staking.ohmUnstake) || 0;
  });
  const stakingRebase = useAppSelector((state) => {
    return state.app.stakingRebase || 0;
  });
  const stakingAPY = useAppSelector((state) => {
    return state.app.stakingAPY || 0;
  });
  const stakingTVL = useAppSelector((state) => {
    return state.app.stakingTVL || 0;
  });
  const nextblock = useAppSelector((state) => {
    return state.app.nextBlock || 0;
  });
  let marketPrice = useAppSelector((state) => {
    return state.app.marketPrice || 0;
  });
  marketPrice = Number(trim(marketPrice, 3));
  const pendingTransactions = useAppSelector((state) => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(Number(ohmBalance));
    } else {
      setQuantity(Number(sohmBalance));
    }
  };

  const onSeekApproval = async (token: string) => {
    await dispatch(
      changeApproval({ address, token, provider, networkID: networkId })
    );
  };

  const onChangeStake = async (action: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0) {
      // eslint-disable-next-line no-alert
      return dispatch(error(t`Please enter a value!`));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity.toString(), "gwei");
    if (
      action === "stake" &&
      gweiValue.gt(ethers.utils.parseUnits(ohmBalance, "gwei"))
    ) {
      return dispatch(error(t`You cannot stake more than your D3 balance.`));
    }

    if (
      action === "unstake" &&
      gweiValue.gt(ethers.utils.parseUnits(sohmBalance, "gwei"))
    ) {
      return dispatch(error(t`You cannot unstake more than your sD3 balance.`));
    }

    await dispatch(
      changeStake({
        address,
        action,
        value: quantity.toString(),
        provider,
        networkID: networkId,
      })
    );
  };

  const hasAllowance = useCallback(
    (token) => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sohm") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance]
  );

  const isAllowanceDataLoading =
    (stakeAllowance == null && view === 0) ||
    (unstakeAllowance == null && view === 1);

  let modalButton = [];

  modalButton.push(
    <Button
      variant="contained"
      color="primary"
      className="connect-button"
      onClick={connect}
      key={1}
    >
      <Trans>Connect Wallet</Trans>
    </Button>
  );

  const changeView = (_event: React.ChangeEvent<{}>, newView: number) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [sohmBalance]
      .filter(Boolean)
      .map((balance) => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4)
  );
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);

  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim(
    (Number(stakingRebasePercentage) / 100) * trimmedBalance,
    4
  );

  const formattedTrimmedStakingAPY = new Intl.NumberFormat("en-US").format(
    Number(trimmedStakingAPY)
  );
  const formattedStakingTVL = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(stakingTVL);
  const formattedCurrentIndex = trim(Number(currentIndex) / Math.pow(10, 9), 2);

  return (
    <>
      {address ? (
        <Grid
          container
          direction="row"
          spacing={2}
          style={{ padding: "0 7% 7%", width: "100%" }}
          justifyContent="center"
        >
          <Grid
            item
            sm={12}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: "1px solid #262626",
            }}
          >
            <Typography
              style={{
                marginBottom: "8px",
                fontSize: "14px",
                textAlign: "center",
                padding: "3%",
                color: "#FFD639",
              }}
            >
              Stake with D3
            </Typography>
          </Grid>

          <Grid
            container
            spacing={3}
            item
            xs={12}
            style={{
              padding: "10% 1%",
              borderBottom: "1px solid #262626",
              width: "100%",
            }}
          >
            <Grid item xs={12}>
              <Typography style={{ marginBottom: "3%", fontSize: "16px" }}>
                Single Stake [3.3.3.3]
              </Typography>
              <Typography style={{ color: "#929292", fontSize: "14px" }}>
                Next Emission Block Number: {nextblock}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography
                style={{
                  marginBottom: "3%",
                  color: "#929292",
                  fontSize: "14px",
                }}
              >
                Current Index
              </Typography>
              <Typography style={{ fontSize: "16px" }}>
                {formattedCurrentIndex}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={3} item xs={12} style={{ padding: "11%" }}>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Metric
                style={{ textAlign: "center" }}
                className="stake-apy"
                label={t`APY`}
                metric={`${formattedTrimmedStakingAPY}%`}
                isLoading={stakingAPY ? false : true}
              />
            </Grid>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Metric
                style={{ textAlign: "center" }}
                className="stake-tvl"
                label={t`TVL`}
                metric={formattedStakingTVL}
                isLoading={stakingTVL ? false : true}
              />
            </Grid>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Metric
                style={{ textAlign: "center" }}
                className="stake-index"
                label={t`DEFI Price`}
                metric={`$${trim(marketPrice, 3)}`}
                isLoading={currentIndex ? false : true}
              />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            item
            xs={12}
            style={{ padding: "5%" }}
            justifyContent="center"
          >
            <Grid item>
              <Typography style={{ fontSize: "12px", color: "#929292" }}>
                <Trans>Connect your wallet to stake DEFI</Trans>
              </Typography>
            </Grid>
            <Grid item>
              <div className="wallet-menu" id="wallet-menu">
                {modalButton}
              </div>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          direction="row"
          spacing={2}
          style={{ padding: "0 7% 7%", width: "100%" }}
          justifyContent="center"
        >
          <Grid
            container
            item
            sm={12}
            style={{
              height: "10%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: "1px solid #262626",
              cursor: "pointer",
            }}
          >
            <Grid
              item
              xs={6}
              onClick={() => setView(0)}
              style={
                view === 0
                  ? { borderBottom: "2px solid #FFD639", padding: "3%" }
                  : {
                      padding: "3%",
                    }
              }
            >
              <Typography
                style={{
                  marginBottom: "8px",
                  fontSize: "14px",
                  textAlign: "center",
                  color: view === 0 ? "white" : "#868686",
                }}
              >
                Stake
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              onClick={() => setView(1)}
              style={
                view === 1
                  ? { borderBottom: "2px solid #FFD639", padding: "3%" }
                  : {
                      padding: "3%",
                    }
              }
            >
              <Typography
                style={{
                  marginBottom: "8px",
                  fontSize: "14px",
                  textAlign: "center",
                  color: view === 1 ? "white" : "#868686",
                }}
              >
                Unstake
              </Typography>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={3}
            item
            xs={12}
            style={{
              padding: "6% 0",
              borderBottom: "1px solid #262626",
              width: "100%",
            }}
          >
            <Grid item xs={12}>
              <Typography style={{ marginBottom: "3%", fontSize: "16px" }}>
                Single Stake [3.3.3.3]
              </Typography>
              <Typography style={{ color: "#929292", fontSize: "14px" }}>
                Next Emission Block Number: {nextblock}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography
                style={{
                  marginBottom: "3%",
                  color: "#929292",
                  fontSize: "14px",
                }}
              >
                Current Index
              </Typography>
              <Typography style={{ fontSize: "16px" }}>
                {formattedCurrentIndex}
              </Typography>
            </Grid>
          </Grid>

          <Grid
            container
            item
            xs={12}
            style={{ padding: "8% 0", borderBottom: "1px solid #262626" }}
            justifyContent="space-evenly"
          >
            <Grid
              item
              xs={4}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Metric
                style={{ textAlign: "center" }}
                className="stake-apy"
                label={t`APY`}
                metric={`${formattedTrimmedStakingAPY}%`}
                isLoading={stakingAPY ? false : true}
              />
            </Grid>
            <Grid
              item
              xs={4}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Metric
                style={{ textAlign: "center" }}
                className="stake-tvl"
                label={t`TVL`}
                metric={formattedStakingTVL}
                isLoading={stakingTVL ? false : true}
              />
            </Grid>
            <Grid
              item
              xs={4}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Metric
                style={{ textAlign: "center" }}
                className="stake-index"
                label={t`DEFI Price`}
                metric={`$${trim(marketPrice, 3)}`}
                isLoading={currentIndex ? false : true}
              />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            item
            xs={12}
            style={{ padding: "5% 0", borderBottom: "1px solid #262626" }}
          >
            <Grid item xs={12}>
              <StakeRow
                title={t`Unstaked Balance`}
                id="user-balance"
                balance={`${trim(Number(ohmBalance), 4)} DEFI`}
                {...{ isAppLoading }}
              />
            </Grid>
            <Grid item xs={12} style={{ borderBottom: "1px solid #262626" }}>
              <StakeRow
                title={t`Staked Balance`}
                id="user-staked-balance"
                balance={`${trimmedBalance} sDEFI`}
                {...{ isAppLoading }}
              />
            </Grid>
            <Grid item xs={12}>
              <StakeRow
                title={t`Next Reward Amount`}
                balance={`${nextRewardValue} sDEFI`}
                {...{ isAppLoading }}
              />
            </Grid>
            <Grid item xs={12}>
              <StakeRow
                title={t`Next Reward Yield`}
                balance={`${stakingRebasePercentage}%`}
                {...{ isAppLoading }}
              />
            </Grid>
            <Grid item xs={12}>
              <StakeRow
                title={t`ROI (5-Day Rate)`}
                balance={`${trim(Number(fiveDayRate) * 100, 4)}%`}
                {...{ isAppLoading }}
              />
            </Grid>
          </Grid>


          {/* <Grid item xs={12}>
            {address && !isAllowanceDataLoading ? (
              <></>
            ) : (
              <FormControl
                className="ohm-input"
                variant="outlined"
                color="primary"
              >
                <InputLabel htmlFor="amount-input"></InputLabel>
                <OutlinedInput
                  id="amount-input"
                  type="number"
                  placeholder="Enter an amount"
                  className="stake-input"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  labelWidth={0}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button variant="text" onClick={setMax} color="inherit">
                        Max
                      </Button>
                    </InputAdornment>
                  }
                />
              </FormControl>
            )}
          </Grid> */}


          <Grid item xs={12}>
            {view === 0 ? (
              isAllowanceDataLoading ? (
                <Skeleton />
              ) : address && hasAllowance("ohm") ? (
                <Button
                  className="stake-button"
                  variant="contained"
                  color="primary"
                  disabled={isPendingTxn(pendingTransactions, "staking")}
                  onClick={() => {
                    onChangeStake("stake");
                  }}
                >
                  {txnButtonText(pendingTransactions, "staking", t`Stake DEFI`)}
                </Button>
              ) : (
                <Button
                  className="stake-button"
                  variant="contained"
                  color="primary"
                  disabled={isPendingTxn(
                    pendingTransactions,
                    "approve_staking"
                  )}
                  onClick={() => {
                    onSeekApproval("ohm");
                  }}
                >
                  {txnButtonText(
                    pendingTransactions,
                    "approve_staking",
                    t`Approve`
                  )}
                </Button>
              )
            ) : isAllowanceDataLoading ? (
              <Skeleton />
            ) : address && hasAllowance("sohm") ? (
              <Button
                className="stake-button"
                variant="contained"
                color="primary"
                disabled={isPendingTxn(pendingTransactions, "unstaking")}
                onClick={() => {
                  onChangeStake("unstake");
                }}
              >
                {txnButtonText(
                  pendingTransactions,
                  "unstaking",
                  t`Unstake sDEFI`
                )}
              </Button>
            ) : (
              <Button
                className="stake-button"
                variant="contained"
                color="primary"
                disabled={isPendingTxn(
                  pendingTransactions,
                  "approve_unstaking"
                )}
                onClick={() => {
                  onSeekApproval("sohm");
                }}
              >
                {txnButtonText(
                  pendingTransactions,
                  "approve_unstaking",
                  t`Approve`
                )}
              </Button>
            )}
          </Grid>

          <Grid item xs={12}>
            {!address && !isAllowanceDataLoading ? (
              (!hasAllowance("ohm") && view === 0) ||
              (!hasAllowance("sohm") && view === 1) ? (
                <Box className="help-text">
                  <Typography
                    variant="body1"
                    className="stake-note"
                    color="textSecondary"
                  >
                    {view === 0 ? (
                      <Typography
                        style={{ fontSize: "12px", color: "#929292" }}
                      >
                        <Trans>First time staking</Trans> <b>DEFI</b>?
                        <br />
                        <Trans>
                          Please approve D3 Protocol to use your
                        </Trans>{" "}
                        <b>DEFI</b> <Trans>for staking</Trans>.
                      </Typography>
                    ) : (
                      <Typography
                        style={{ fontSize: "12px", color: "#929292" }}
                      >
                        <Trans>First time unstaking</Trans> <b>sDEFI</b>
                        ?
                        <br />
                        <Trans>
                          Please approve D3 Protocol to use your
                        </Trans>{" "}
                        <b>sDEFI</b> <Trans>for unstaking</Trans>.
                      </Typography>
                    )}
                  </Typography>
                </Box>
              ) : (
                <></>
              )
            ) : (
              <Skeleton width="100%" />
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default Stake;
