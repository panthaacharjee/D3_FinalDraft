import { ThemeProvider } from "@material-ui/core/styles";
import { useEffect, useState, useCallback } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useTheme from "./hooks/useTheme";
import useBonds, { IAllBondData } from "./hooks/Bonds";
import { ASSETS } from "./constants";
import { useAddress, useWeb3Context } from "./hooks/web3Context";
import useSegmentAnalytics from "./hooks/useSegmentAnalytics";
import { segmentUA } from "./helpers/userAnalyticHelpers";
import { shouldTriggerSafetyCheck } from "./helpers";

import { calcBondDetails } from "./slices/BondSlice";
import { loadAppDetails } from "./slices/AppSlice";
import { getAssetDetails } from "./slices/AssetSlice";
import { loadAccountDetails, calculateUserBondDetails } from "./slices/AccountSlice";
import { info } from "./slices/MessagesSlice";

import { Stake, ChooseBond,IndexPage, Bond, TreasuryDashboard, PoolTogether, AirDrop, Calculator } from "./views"
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import TopBar from "./components/TopBar/TopBar.jsx";
import NavDrawer from "./components/Sidebar/NavDrawer.jsx";
import Messages from "./components/Messages/Messages";
import NotFound from "./views/404/NotFound";
import ChangeNetwork from "./views/ChangeNetwork/ChangeNetwork";
import { dark as darkTheme } from "./themes/dark.js";
import "./style.scss";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";
import { initializeNetwork } from "./slices/NetworkSlice";
import { useAppSelector } from "./hooks";

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

const drawerWidth = 280;
const transitionDuration = 969;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    height: "100%",
    overflow: "auto",
    marginLeft: drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

function App() {
  useSegmentAnalytics();
  useGoogleAnalytics();
  const location = useLocation();
  const dispatch = useDispatch();
  const [theme, toggleTheme, mounted] = useTheme();
  const currentPath = location.pathname + location.hash + location.search;
  const classes = useStyles();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallerScreen = useMediaQuery("(max-width: 980px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const { connect, hasCachedProvider, provider, connected, chainChanged, onChainChangeComplete } = useWeb3Context();
  const address = useAddress();

  const [walletChecked, setWalletChecked] = useState(false);
  const networkId = useAppSelector(state => state.network.networkId);

  // TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
  const { bonds } = useBonds(networkId);
  console.log("bonds--->>",bonds)
  async function loadDetails(whichDetails: string) {
   
    let loadProvider = provider;

    if (whichDetails === "app") {
      loadApp(loadProvider);
    }

    if (whichDetails === "network") {
      initNetwork(loadProvider);
    }

    // don't run unless provider is a Wallet...
    if (whichDetails === "account" && address && connected) {
      loadAccount(loadProvider);
    }
  }

  const initNetwork = useCallback(loadProvider => {
    dispatch(initializeNetwork({ provider: loadProvider }));
    
  }, []);

  const loadApp = useCallback(
    loadProvider => {
      dispatch(loadAppDetails({ networkID: networkId, provider: loadProvider }));
      // NOTE (appleseed) - tech debt - better network filtering for active bonds
      if (networkId === 56 || networkId === 97) {
        bonds.map(bond => {
          dispatch(calcBondDetails({ bond, value: "", provider: loadProvider, networkID: networkId }));
        });
        ASSETS.map(asset => {
          dispatch(getAssetDetails({asset}));
        })
      }
    },
    [networkId],
  );

  const loadAccount = useCallback(
    loadProvider => {
      dispatch(loadAccountDetails({ networkID: networkId, address, provider: loadProvider }));
      // dispatch(getMigrationAllowances({ address, provider: loadProvider, networkID: networkId }));
      bonds.map(bond => {
        // NOTE: get any Claimable bonds, they may not be bondable
        if (bond.getClaimability(networkId)) {
          dispatch(calculateUserBondDetails({ address, bond, provider: loadProvider, networkID: networkId }));
        }
      });
    },
    [networkId, address],
  );

  // The next 3 useEffects handle initializing API Loads AFTER wallet is checked
  //
  // this useEffect checks Wallet Connection & then sets State for reload...
  // ... we don't try to fire Api Calls on initial load because web3Context is not set yet
  // ... if we don't wait we'll ALWAYS fire API calls via JsonRpc because provider has not
  // ... been reloaded within App.
  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true);
        segmentUA({
          type: "connect",
          provider: provider,
          context: currentPath,
        });
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
    }
    if (shouldTriggerSafetyCheck()) {
      dispatch(info("Safety Check: Always verify you're on dapp.d3protocol.io!"));
    }
  }, []);

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (walletChecked) {
      loadDetails("network").then(() => {
        if (networkId !== -1) {
          loadDetails("account");
          loadDetails("app");
        }
      });
      onChainChangeComplete();
    }
  }, [walletChecked, chainChanged, networkId]);

  // this useEffect picks up any time a user Connects via the button
  useEffect(() => {
    // don't load ANY details until wallet is Connected
    if (connected && networkId !== -1) {
      loadDetails("account");
    }
  }, [connected, networkId]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

 

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* {isAppLoading && <LoadingSplash />} */}
      <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"} ${theme}`}>
        <Messages />
        <TopBar theme={theme} toggleTheme={toggleTheme} handleDrawerToggle={handleDrawerToggle} />
        <nav className={classes.drawer}>
          {/* {isSmallerScreen ? ( */}
            <NavDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
          {/* ) : (
             <Sidebar />
          )} */}
        </nav>

        <div className={`${classes.content} ${classes.contentShift}`}>
          <Switch>
            <Route exact path="/dashboard">
              <TreasuryDashboard />
            </Route>

            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>

            {/* <Route path="/stake">
              <Stake />
            </Route> */}

            <Route path="/calculator">
              <Route exact path={`/calculator`}>
                <Calculator />
              </Route>
            </Route>

            <Route path="/dividend">
              <Route exact path={`/dividend`}>
                <AirDrop />
              </Route>
            </Route>

            <Route path="/33-together">
              <PoolTogether />
            </Route>

            {/* <Route path="/mints">
              {(bonds as IAllBondData[]).map(bond => {
                return (
                  <Route exact key={bond.name} path={`/mints/${bond.name}`}>
                    <Bond bond={bond} />
                  </Route>
                );
              })}
              <ChooseBond />
            </Route> */}
            <Route path="/index">
              <IndexPage/>
            </Route>
            <Route path="/network">
              <ChangeNetwork />
            </Route>

            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
