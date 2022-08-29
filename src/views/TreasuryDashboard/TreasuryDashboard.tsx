import { memo, useRef, useEffect, useState } from "react";
import "./treasury-dashboard.scss";
import { QueryClient, QueryClientProvider } from "react-query";
import { Paper, Grid, Box, useMediaQuery, Typography, } from "@material-ui/core";
import { useAppSelector } from "../../hooks";
import useBonds, { IAllBondData } from "../../hooks/Bonds";
import { trim } from "../../helpers";
import { allBondsMap } from "../../helpers/AllBonds";
import { useWeb3Context } from "../../hooks/web3Context";

import Bond from "../Bond/Bond";
import ChooseBond from "../ChooseBond/ChooseBond";
import Stake from "../Stake/Stake";
import {BsXCircle} from 'react-icons/bs'


//Image Import
import Img1 from '../../assets/NewImage/Frame 48095923.png'
import Img2 from '../../assets/NewImage/Frame 48095919.png'
import Img3 from '../../assets/NewImage/Frame 480959255.png'
import Img4 from '../../assets/NewImage/Frame 48095913.png'



const TreasuryDashboard = memo(() => {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");
  const marketPrice: number | undefined = useAppSelector((state) => {
    return state.app.marketPrice;
  });
  const stakingAPY = useAppSelector((state) => {
    return state.app.stakingAPY || 0;
  });
  const trimmedStakingAPY = trim(stakingAPY * 100, 2);
  const formattedTrimmedStakingAPY = new Intl.NumberFormat("en-US").format(
    Number(trimmedStakingAPY)
  );
  const stakingTVL: number | undefined = useAppSelector((state) => {
    return state.app.stakingTVL;
  });
  const burn: number | undefined = useAppSelector((state) => {
    return state.app.burn;
  });
  const stakingRebase: number | undefined = useAppSelector((state) => {
    return state.app.stakingRebase;
  });
  const marketCap: number | undefined = useAppSelector((state) => {
    return state.app.marketCap;
  });
  const totalSupply: number | undefined = useAppSelector((state) => {
    return state.app.totalSupply;
  });
  const runwawy: number | undefined = useAppSelector((state) => {
    return state.app.runway;
  });
  const rfv: number | undefined = useAppSelector((state) => {
    return state.app.rfv;
  });
  const emission: number | undefined = useAppSelector((state) => {
    return state.app.emission;
  });
  const nextBlock: number | undefined = useAppSelector((state) => {
    return state.app.nextBlock;
  });

  const treasuryBalance: number | undefined = useAppSelector((state) => {
    if (state.bonding.loading == false) {
      let tokenBalances = 0;
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          tokenBalances += state.bonding[bond].purchased;
        }
      }
      return tokenBalances;
    }
  });

  const [select, setSelect] = useState("Stake");

  const protocolStats = [
    {
      name: "Market Cap",
      value: `$ ${trim(marketCap, 0)}`,
    },
    {
      name: "TVL",
      value: `$ ${trim(stakingTVL, 0)}`,
    },
    {
      name: "Next Emission Block No.",
      value: trim(nextBlock, 0),
    },
    {
      name: "Total Supply",
      value: `${trim(totalSupply, 0)}v`,
    },
    {
      name: "Daily mint limit",
      value: 0,
    },
    {
      name: "Treasury Balance",
      value: `$ ${trim(treasuryBalance, 0)}`,
    },
    {
      name: "D3 Index Balance",
      value: `$ ${0}`,
    },
    {
      name: "Total Burn Tokens",
      value: trim(burn, 2),
    },
    {
      name: "AUM",
      value: `$ ${0}`,
    },
    {
      name: "Burning Rate",
      value: "0 %",
    },
  ];

  const networkId = useAppSelector((state) => state.network.networkId);
  const { bonds } = useBonds(networkId);

  const { provider, address, connect } = useWeb3Context();

  // currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
  //     currentBlock,
  //     fiveDayRate,
  //     stakingAPY,
  //     stakingTVL,
  //     stakingRebase,
  //     marketCap,
  //     marketPrice,
  //     circSupply,
  //     totalSupply,


  /* New Code */
  const [mint, setMint] = useState(true)
  const [popup, setPopup] = useState(true)

  return (
    <>
      <Box>
      <Grid
        container
        spacing={4}
        direction="column"
        style={{
          padding: "0 2%",
          width: "100%",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <Grid
          container
          spacing={4}
          item
          md={12}
          style={{ width: "100%", height: "auto" }}
        >
          <Grid item sm={3} xs={12}>
            <Paper
              elevation={0}
              style={{
                background: "#1C1C1C",
                borderRadius: "12px",
                height: "100%",
                padding: "7% 0",
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
                <Grid container direction="row" item sm={8} style={{alignItems:"center", justifyContent:"center"}}>
                  <Grid >
                    <img style={{marginRight:"15px"}} src={Img1}/>
                  </Grid>
                  <Grid>
                    <Grid
                      item
                      xs={12}
                      style={{ display: "flex", alignItems: "flex-start" }}
                    >
                      <Typography
                        style={{ marginBottom: "8px", color: "#929292" }}
                      >
                        APY
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography variant="h4" className="ohm-card-value">
                        {formattedTrimmedStakingAPY} %
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item sm={3} xs={12}>
            <Paper
              elevation={0}
              style={{
                background: "#1C1C1C",
                borderRadius: "12px",
                height: "100%",
                padding: "7% 0",

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
                <Grid container direction="row" item sm={8} style={{alignItems:"center", justifyContent:"center"}}>
                  <Grid >
                    <img style={{marginRight:"15px"}} src={Img2}/>
                  </Grid>
                  <Grid>
                    <Grid
                      item
                      xs={12}
                      style={{ display: "flex", alignItems: "flex-end" }}
                    >
                      <Typography
                        style={{ marginBottom: "8px", color: "#929292" }}
                      >
                        Backing per DEFI
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography variant="h4" className="ohm-card-value">
                        ${trim(rfv, 1)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item sm={3} xs={12}>
            <Paper
              elevation={0}
              style={{
                background: "#1C1C1C",
                borderRadius: "12px",
                height: "100%",
                padding: "7% 0",

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
                <Grid container direction="row" item sm={8} style={{alignItems:"center", justifyContent:"center"}}>
                  <Grid >
                    <img style={{marginRight:"15px"}} src={Img3}/>
                  </Grid>
                  <Grid >
                    <Grid
                      item
                      xs={12}
                      style={{ display: "flex", alignItems: "flex-end" }}
                    >
                      <Typography
                        style={{ marginBottom: "8px", color: "#929292" }}
                      >
                        Defi Price
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{ display: "flex", alignItems: "flex-start" }}
                    >
                      <Typography variant="h4" className="ohm-card-value">
                        ${trim(marketPrice, 1)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item sm={3} xs={12}>
            <Paper
              elevation={0}
              style={{
                background: "#1C1C1C",
                borderRadius: "12px",
                height: "100%",
                padding: "7% 0",

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
                <Grid container direction="row" item sm={8} style={{alignItems:"center", justifyContent:"center"}}>
                  <Grid >
                    <img style={{marginRight:"15px"}} src={Img4}/>
                  </Grid>
                  <Grid>
                    <Grid
                      item
                      xs={12}
                      style={{ display: "flex", alignItems: "flex-end" }}
                    >
                      <Typography
                        style={{ marginBottom: "8px", color: "#929292" }}
                      >
                        Runway
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{ display: "flex", alignItems: "flex-start" }}
                    >
                      <Typography variant="h4" className="ohm-card-value">
                        {trim(runwawy, 0)} Days
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={4}
          item
          sm={12}
          style={{ width: "100%", height: "auto" }}
        >
          <Grid item sm={3} style={{ height: "100%" }}>
            <Paper
              elevation={0}
              style={{
                background: "#1C1C1C",
                borderRadius: "12px",
                height: "100%",
                padding: "5% 0",
                minHeight: "600px",
              }}
            >
              <Grid
                container
                direction="row"
                style={{ width: "100%", height: "100%" }}
              >
                {/* Header */}
                <Grid
                  item
                  sm={12}
                  style={{
                    height: "10%",
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
                    Protocol Stats
                  </Typography>
                </Grid>

                {/* Data */}
                <Grid
                  container
                  direction="row"
                  item
                  sm={12}
                  style={{ height: "100%" }}
                  justifyContent="center"
                >
                  {protocolStats.map(({ name, value }) => (
                    <>
                      <Grid
                        container
                        spacing={4}
                        item
                        xs={12}
                        style={{ padding: "5%" }}
                      >
                        <Grid item xs={6}>
                          <Typography
                            style={{
                              fontSize: "14px",
                              color: "#929292",
                            }}
                          >
                            {name}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            style={{
                              fontSize: "14px",
                              textAlign: "right",
                            }}
                          >
                            {value}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  ))}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item sm={6} style={{ height: "100%" }}>
            <Paper
              elevation={0}
              style={{
                background: "#1C1C1C",
                borderRadius: "12px",
                height: "100%",
                padding: "3% 0",
                minHeight: "600px",
              }}
            >
              <Grid
                container
                direction="row"
                style={{ width: "100%", height: "100%" }}
              >
                {/* Header */}
                <Grid
                  container
                  item
                  sm={12}
                  style={{
                    height: "15%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid #262626",
                  }}
                >
                  <Grid
                    container
                    item
                    xs={6}
                    style={{
                      padding: "1% 0 3%",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Typography style={{ marginBottom: "8px" }}>
                        Treasure Balance
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Typography variant="h4" className="ohm-card-value">
                        ${trim(treasuryBalance, 0)}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container item xs={6}>
                    <Grid
                      item
                      xs={12}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Typography style={{ marginBottom: "8px" }}>
                        Defi Price
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Typography variant="h4" className="ohm-card-value">
                        ${trim(marketPrice, 1)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Data */}
                <Grid
                  item
                  sm={12}
                  style={{
                    height: "85%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ChooseBond  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item sm={3} style={{ height: "100%" }}>
            <Paper
              elevation={0}
              style={{
                background: "#1C1C1C",
                borderRadius: "12px",
                height: "100%",
                padding: "5% 0",
                minHeight: "600px",
              }}
            >
              <Grid
                container
                direction="row"
                style={{ width: "100%", height: "100%" }}
                justifyContent="center"
              >
                {/* Stake */}
                <Stake/>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      
    </Box>
      {
        popup? 
        <div className="mint_box">
        <Box className="mint_box_container">
             <Grid item  style={{display:"flex", justifyContent:"space-between", padding:"15px 15px", borderBottom:"1px solid #404040"}}>
                <Typography variant="h6">Mint (Defi - USD)</Typography>
                <Typography style={{fontSize:"18px", cursor:"pointer"}} onClick={()=>setPopup(!popup)}><BsXCircle/></Typography>
             </Grid>
             <Grid item style={{display:"flex", justifyContent:"space-around", padding:"45px"}} >
                <Grid item style={{textAlign:"center"}}>
                  <Typography style={{color: "#909090", fontSize:"14px", fontWeight:"400", fontFamily:"Outfit", lineHeight:"36px"}}>Mint Price</Typography>
                  <Typography style={{ fontSize:"24px", fontWeight:"400", fontFamily:"Outfit", lineHeight:"36px"}}>$ 12.212</Typography>
                </Grid>
                <Grid item style={{textAlign:"center"}}>
                <Typography style={{color: "#909090", fontSize:"14px", fontWeight:"400", fontFamily:"Outfit", lineHeight:"36px"}}>Market Price</Typography>
                  <Typography style={{ fontSize:"24px", fontWeight:"400", fontFamily:"Outfit", lineHeight:"36px"}}>$ 6.212</Typography>
                </Grid>
             </Grid>
             <Grid item style={{display:"flex", justifyContent:"space-around"}} >
                <button onClick={()=>setMint(true)} className={mint==true? "mint_btn":"mint_btn borderBottom_none"}>Mint</button>
                <button onClick={()=>setMint(false)} className={mint===false? "mint_btn ":"mint_btn borderBottom_none"}>Redeem</button>
             </Grid>
            {
              mint ?  <Grid item style={{marginTop:"20px"}}>
              <Grid item className="mint_balance">
                <Typography>Your Balance</Typography>
                <Typography>0.0 LP</Typography>
              </Grid>
              <Grid item className="mint_balance">
                <Typography>You will Get</Typography>
                <Typography>0 DEFI</Typography>
              </Grid>
              <Grid item className="mint_balance">
                <Typography>Daily Emission Limit</Typography>
                <Typography>128 Defi</Typography>
              </Grid>
              <Grid item className="mint_balance">
                <Typography>You will Get</Typography>
                <Typography>0 DEFI</Typography>
              </Grid>
              <Grid item style={{display:"flex", justifyContent:"center", padding:"10px 15px"}}>
                <button className="aprove_btn">Approve</button>
              </Grid>
              <Typography style={{fontSize:"10px", fontWeight:"400", textAlign:"center", padding:"10px 20px"}}>First time minting DEFI-BUSD LP? Please approve D3 Protocol to use<br/> your DEFI-BUSD LP for minting.</Typography>

            </Grid>
           :
              <Grid item style={{marginTop:"20px"}}>
              <Grid item className="mint_balance">
                <Typography>Pending Rewards</Typography>
                <Typography>0 Defi</Typography>
              </Grid>
              <Grid item className="mint_balance">
                <Typography>Claimable Rewards</Typography>
                <Typography>0.0 Defi</Typography>
              </Grid>
              <Grid item className="mint_balance">
                <Typography>Time until fully vested</Typography>
                <Typography>128 Defi</Typography>
              </Grid>
              <Grid item className="mint_balance">
                <Typography>ROI</Typography>
                <Typography>-48.54 %</Typography>
              </Grid>
              <Grid item className="mint_balance">
                <Typography>Debt Ratio</Typography>
                <Typography>0%</Typography>
              </Grid>
              <Grid item className="mint_balance">
                <Typography>Vesting term</Typography>
                <Typography>5 days</Typography>
              </Grid>
              <Grid item style={{display:"flex", justifyContent:"center", padding:"10px 15px"}}>
                <button className="redem_btn" style={{background:"none", border:"1px solid #feb626", color:"#feb626"}}>Claim</button>
                <button className="redem_btn" >Claim and auto stake</button>
              </Grid>

          </Grid>
            }
             
        </Box>
      </div>:
      ""
      }
    </>
  );
});

const queryClient = new QueryClient();

export default () => (
  <QueryClientProvider client={queryClient}>
    <TreasuryDashboard />
  </QueryClientProvider>
);


