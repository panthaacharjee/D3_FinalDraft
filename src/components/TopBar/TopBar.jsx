import {
  AppBar,
  Toolbar,
  Box,
  Button,
  SvgIcon,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactComponent as MenuIcon } from "../../assets/icons/hamburger.svg";
import ProtoColImage from "../../assets/images/D3pro.png";
import OhmMenu from "./OhmMenu.jsx";
import ThemeSwitcher from "./ThemeSwitch.jsx";
import LocaleSwitcher from "./LocaleSwitch.tsx";
import ConnectMenu from "./ConnectMenu.jsx";
import "./topbar.scss";
import NetworkMenu from "./NetworkMenu.jsx";
import { Trans } from "@lingui/macro";
import { ReactComponent as Medium } from "../../assets/icons/medium-line.svg";
import { ReactComponent as Twitter } from "../../assets/icons/twitter-line.svg";
import { ReactComponent as Telegram } from "../../assets/icons/telegram-line.svg";
import { ReactComponent as Discord } from "../../assets/icons/discord-line.svg";

const useStyles = makeStyles((theme) => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "10px",
    },
    background: "#121212",
    backdropFilter: "none",
    zIndex: 10,
    borderBottom: "1px solid #262626",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("981")]: {
      display: "none",
    },
  },
}));

function TopBar({ theme, toggleTheme, handleDrawerToggle }) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery("(max-width: 355px)");
  const isSmallScreen = useMediaQuery("(max-width: 980px)");
  const location = useLocation();

  return (
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar disableGutters className="dapp-topbar">
        {isSmallScreen ? (
          <>
            <Button
              id="hamburger"
              aria-label="open drawer"
              edge="start"
              size="large"
              variant="contained"
              color="secondary"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <SvgIcon component={MenuIcon} />
            </Button>

            <Box display="flex" style={{ padding: "0 3%" }}>
              {/* {!isVerySmallScreen && <OhmMenu />} */}

              {/* <NetworkMenu /> */}

              {!isVerySmallScreen && <OhmMenu />}

              <ConnectMenu theme={theme} />

              {/* <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} /> */}

              {/* <LocaleSwitcher theme={theme} /> */}
            </Box>
          </>
        ) : (
          <Grid container style={{ padding: "0 3%", width: "100%" }}>
            <Grid container item spacing={2} md={6}>
              {/* Logo */}
              <Grid
                item
                md={1}
                style={{
                  background: "transparent",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Link href="/">
                  <img
                    style={{ width: "40px", height: "auto" }}
                    src={ProtoColImage}
                    alt="D3 CCF"
                  />
                </Link>
              </Grid>

              {/* Navbar Overview Redirect */}
              <Grid item>
                <Link id="dash-nav" href="/#/dashboard">
                  <Typography
                    variant="h6"
                    style={
                      location.pathname === "/dashboard"
                        ? {
                            borderBottom: "2px solid #FFD639",
                          }
                        : {}
                    }
                  >
                    <Trans>Overview</Trans>
                  </Typography>
                </Link>
              </Grid>

              {/* Navbar D3 Index Redirect */}
              <Grid item>
                <Link id="index-nav" href="/#/index">
                  <Typography
                    variant="h6"
                    style={
                      location.pathname === "/index"
                        ? {
                            borderBottom: "2px solid #FFD639",
                          }
                        : {}
                    }
                  >
                    <Trans>D3 NFT</Trans>
                  </Typography>
                </Link>
              </Grid>

              {/* Navbar Dividend Redirect */}
              <Grid item>
                <Link id="airdrop-nav" href="/#/dividend">
                  <Typography
                    variant="h6"
                    style={
                      location.pathname === "/dividend"
                        ? {
                            borderBottom: "2px solid #FFD639",
                          }
                        : {}
                    }
                  >
                    <Trans>Dividend</Trans>
                  </Typography>
                </Link>
              </Grid>

              {/* Navbar Calculator Redirect */}
              <Grid item>
                <Link id="calculator-nav" href="/#/calculator">
                  <Typography
                    variant="h6"
                    style={
                      location.pathname === "/calculator"
                        ? {
                            borderBottom: "2px solid #FFD639",
                          }
                        : {}
                    }
                  >
                    <Trans>Calculator</Trans>
                  </Typography>
                </Link>
              </Grid>

              {/* Navbar Docs Redirect */}
              <Grid item>
                <Link href="https://docs.d3protocol.io/" target="_blank">
                  <Typography variant="h6">
                    <Trans>Docs</Trans>
                  </Typography>
                </Link>
              </Grid>
            </Grid>

            {/* Socials */}
            <Grid
              container
              item
              md={3}
              justifyContent="center"
              alignItems="center"
            >
              {/* Twitter */}
              <Grid item xs={2}>
                <Link
                  href="https://twitter.com/d3protocol"
                  target="_blank"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SvgIcon color="primary" component={Twitter} />
                </Link>
              </Grid>

              {/* Medium */}
              <Grid item xs={2}>
                <Link
                  href="https://medium.com/@d3protocol"
                  target="_blank"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SvgIcon color="primary" component={Medium} />
                </Link>
              </Grid>

              {/* Discord */}
              <Grid item xs={2}>
                <Link
                  href="https://discord.gg/d3protocol"
                  target="_blank"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: "8%",
                  }}
                >
                  <SvgIcon color="primary" component={Discord} />
                </Link>
              </Grid>

              {/* Telegram */}
              <Grid item xs={2}>
                <Link
                  href="https://t.me/d3protocol"
                  target="_blank"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SvgIcon color="primary" component={Telegram} />
                </Link>
              </Grid>
            </Grid>

            {/* Connect and Ohm */}
            <Grid container item md={3} justifyContent="flex-end">
              <Grid item>{!isVerySmallScreen && <OhmMenu />}</Grid>

              <Grid item>
                <ConnectMenu theme={theme} />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
