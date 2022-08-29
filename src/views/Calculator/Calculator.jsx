import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  FilledInput,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
  SvgIcon,
  makeStyles,
  Select,
  MenuItem,
  Slider,
} from "@material-ui/core";
import { ReactComponent as Background } from "../../assets/page-bg.svg";
import InfoTooltip from "../../components/InfoTooltip/InfoTooltip.jsx";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import {
  getOhmTokenImage,
  getTokenImage,
  trim,
  formatCurrency,
} from "../../helpers";
import { changeApproval, changeWrap } from "../../slices/WrapThunk";
import { switchNetwork } from "../../slices/NetworkSlice";
import { useWeb3Context } from "../../hooks/web3Context";
import {
  isPendingTxn,
  txnButtonText,
  txnButtonTextMultiType,
} from "../../slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { NETWORKS } from "../../constants";
import { ethers } from "ethers";
// import "../Stake/stake.scss";
import "./wrap.scss";

const useStyles = makeStyles((theme) => ({
  textHighlight: {
    color: theme.palette.highlight,
  },
}));

function Calculator() {
  const dispatch = useDispatch();
  const { provider, address, connect } = useWeb3Context();
  const networkId = useSelector((state) => state.network.networkId);
  const networkName = useSelector((state) => state.network.networkName);

  const [zoomed, setZoomed] = useState(false);
  const [assetFrom, setAssetFrom] = useState("sOHM");
  const [assetTo, setAssetTo] = useState("gOHM");
  const [quantity, setQuantity] = useState("");

  const classes = useStyles();

  const isAppLoading = useSelector((state) => state.app.loading);
  const isAccountLoading = useSelector((state) => state.account.loading);
  const currentIndex = useSelector((state) => {
    return state.app.currentIndex;
  });

  const currnetD3Price = useSelector((state) => {
    return state.app.marketPrice;
  });
  const sD3Balance = useSelector((state) => {
    return state.account.balances && state.account.balances.sohm;
  });
  const stakingAPY = useSelector((state) => {
    return state.app.stakingAPY;
  });
  const stakingRebase = useSelector((state) => {
    return state.app.stakingRebase;
  });
  // const convertedQuantity = 0;
  const convertedQuantity = useMemo(() => {
    if (assetFrom === "sOHM") {
      return quantity / currentIndex;
    } else if (assetTo === "sOHM") {
      return quantity * currentIndex;
    } else {
      return quantity;
    }
  }, [quantity]);
  // currentAction === "Unwrap" ? (quantity * wsOhmPrice) / sOhmPrice : (quantity * sOhmPrice) / wsOhmPrice;

  let modalButton = [];

  modalButton.push(
    <Button
      variant="contained"
      color="primary"
      className="connect-button"
      onClick={connect}
      key={1}
    >
      Connect Wallet
    </Button>
  );
  const [defiAmount, setDefiAmount] = useState(1);
  const [rewardYield, setRewardYield] = useState(trim(stakingAPY, 4) * 100);
  const [purchasePrice, setPurchasePrice] = useState(currnetD3Price);
  const [futureMarketPrice, setFutureMarketPrice] = useState(currnetD3Price);
  const [days, setDays] = useState(30);
  const [rewardsEstimation, setRewardsEstimation] = useState("0");
  const [potentialReturn, setPotentialReturn] = useState("0");

  const calcInitialInvestment = () => {
    const defi = Number(defiAmount) || 0;
    const price = parseFloat(purchasePrice) || 0;
    const amount = defi * price;
    return trim(amount, 2);
  };

  const [initialInvestment, setInitialInvestment] = useState(
    calcInitialInvestment()
  );

  useEffect(() => {
    const newInitialInvestment = calcInitialInvestment();
    setInitialInvestment(newInitialInvestment);
  }, [defiAmount, purchasePrice]);

  const calcNewBalance = () => {
    console.log(Math.pow(1 + stakingRebase, days * 3) - 1);
    return (Math.pow(1 + stakingRebase, days * 3) - 1) * defiAmount;
  };

  useEffect(() => {
    const newBalance = calcNewBalance();
    setRewardsEstimation(trim(newBalance, 3));
    const newPotentialReturn =
      (newBalance + defiAmount) * (parseFloat(futureMarketPrice) || 0);
    setPotentialReturn(trim(newPotentialReturn, 3));
  }, [days, rewardYield, futureMarketPrice, defiAmount]);

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

      <div id="calculator-view">
            <Paper className={`ohm-card`} style={{zIndex:"11111", display:'flex', justifyContent:"space-between", textAlign:"center", marginTop:"20px", background:"none", border:"none"}}>
                  <Grid item xs={12} md={4} style={{background:"#1C1C1C", padding:"20px 10px", borderRadius:"10px", marginRight:"20px"}}>
                    <Typography variant="h6">Current DEFi Price</Typography>
                    <Typography variant="h3">
                      ${trim(currnetD3Price, 2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4} style={{background:"#1C1C1C", padding:"20px 10px", borderRadius:"10px",  marginRight:"20px"}}>
                    <Typography variant="h6">Current Reward Yield</Typography>
                    <Typography variant="h3">
                      {trim(stakingAPY, 1) * 100} %
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4} style={{background:"#1C1C1C", padding:"20px 10px", borderRadius:"10px",}}>
                    <Typography variant="h6">Your Balance</Typography>
                    <Typography variant="h4">
                      {trim(sD3Balance, 2)} sDEFi
                    </Typography>
                  </Grid>
            </Paper> 

        <Paper className={`ohm-card`} style={{background:"#1C1C1C", border:"none"}}>
          <Grid container spacing={8} direction="column">
            <Grid item className="calculator-headers">
              <div className="card-header" style={{alignItems:"center"}}>
                <Typography variant="h5" style={{textAlign:"center", fontFamily: 'Outfit', fontWeight:"400", fontSize:"18px", marginTop:"10px"}}>Calculator</Typography>

                {/* <Typography>Estimate your returns</Typography> */}
              </div>
            </Grid>
           
            <Grid item>
              <div>
                <Grid container style={{display:"flex", justifyContent:"space-between"}}>
                  <Grid item xs={12} sm={5} style={{marginRight:"30px"}}>
                    
                  <Grid item xs={12} sm={12}>
                    <div className="slider-box">
                      <Typography className="secondaryText">{`${days} day${
                        days > 1 ? "s" : ""
                      }`}</Typography>
                      <Slider
                        aria-label="Temperature"
                        orientation="horizontal"
                        style={{
                          color: "#feb626",
                          backgroundColor: "transparent",
                        }}
                        min={1}
                        max={365}
                        size="big"
                        value={days}
                        onChange={(e, newValue) => setDays(newValue)}
                      />
                    </div>
                  </Grid> 
                    <Grid item xs={12} style={{ marginBottom: "46px", marginTop:"30px" }}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-amount">
                          sDEFI Amount
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-amount"
                          type="number"
                          value={trim(defiAmount, 2)}
                          onChange={(e) => setDefiAmount(e.target.value)}
                          endAdornment={
                            <InputAdornment position="end">
                              <div className="secondaryText">sDEFI</div>
                            </InputAdornment>
                          }
                          label="sJADE Amount"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{ marginBottom: "46px" }}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-yield">
                          Reward Yield (%)
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-yield"
                          type="text"
                          value={trim(rewardYield, 2)}
                          onChange={(e) => setRewardYield(e.target.value)}
                          endAdornment={
                            <InputAdornment position="end">
                              <div className="secondaryText">%</div>
                            </InputAdornment>
                          }
                          label="Reward Yield (%)"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{ marginBottom: "46px" }}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-purchase-price">
                          DEFI Purchase Price ($)
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-purchase-price"
                          type="text"
                          value={trim(purchasePrice, 2)}
                          onChange={(e) => setPurchasePrice(e.target.value)}
                          startAdornment={
                            <InputAdornment position="start">
                              <div className="secondaryText">$</div>
                            </InputAdornment>
                          }
                          label="DEFi Purchase Price ($)"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-market-price">
                          Future DEFi Market Price ($)
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-market-price"
                          type="text"
                          value={trim(futureMarketPrice, 2)}
                          onChange={(e) => setFutureMarketPrice(e.target.value)}
                          startAdornment={
                            <InputAdornment position="start">
                              <div className="secondaryText">$</div>
                            </InputAdornment>
                          }
                          label="Future DEFI Market Price ($)"
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                 
                  <Grid item xs={12} sm={5} className="calculator-value-box">
                    
                    <Grid item className="calculator-value">
                      <Typography variant="h6" className="secondaryText">
                        Your Initial Investment
                      </Typography>
                      <Typography variant="h3">${initialInvestment}</Typography>
                    </Grid>
                    <Grid item className="calculator-value">
                      <Typography variant="h6" className="secondaryText">
                        Current Value
                      </Typography>
                      <Typography variant="h3">
                        ${trim(sD3Balance * currnetD3Price, 2)}
                      </Typography>
                    </Grid>
                    <Grid item className="calculator-value">
                      <Typography variant="h6" className="secondaryText">
                        DEFi Rewards Estimate
                      </Typography>
                      <Typography variant="h3">
                        {trim(rewardsEstimation, 2)} DEFI
                      </Typography>
                    </Grid>
                    <Grid item className="calculator-value">
                      <Typography variant="h6" className="secondaryText">
                        Potential Future Value
                      </Typography>
                      <Typography variant="h3">
                        ${trim(potentialReturn, 2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </>
  );
}

export default Calculator;


