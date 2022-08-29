import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./Social";
import externalUrls from "./externalUrls";
import { ReactComponent as StakeIcon } from "../../assets/icons/stake.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond.svg";
import { ReactComponent as BuyIcon } from "../../assets/icons/buy.svg";
import { ReactComponent as CalculatorIcon } from "../../assets/icons/calculator.svg";
import { ReactComponent as AirdropIcon } from "../../assets/icons/airdrop.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard.svg";
import ProtoColImage from "../../assets/images/D3pro.png";
import { Trans } from "@lingui/macro";
import { trim, shorten } from "../../helpers";
import { useAddress } from "../../hooks/web3Context";
import useBonds from "../../hooks/Bonds";
import { Paper, Link, Box, Typography, SvgIcon, Divider } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";
import { useSelector } from "react-redux";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const networkId = useSelector(state => state.network.networkId);
  const { bonds } = useBonds(networkId);

  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }
    if (currentPath.indexOf("zap") >= 0 && page === "zap") {
      return true;
    }
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }
    if (currentPath.indexOf("calculator") >= 0 && page === "calculator") {
      return true;
    }
    if (currentPath.indexOf("dividend") >= 0 && page === "dividend") {
      return true;
    }
    if (currentPath.indexOf("wrap") >= 0 && page === "wrap") {
      return true;
    }
    if ((currentPath.indexOf("mints") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "mints") {
      return true;
    }
    if (currentPath.indexOf("33-together") >= 0 && page === "33-together") {
      return true;
    }
    if (currentPath.indexOf("33-together") >= 0 && page === "33-together") {
      return true;
    }
    return false;
  }, []);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="/">
              <img className="branding-header-protocol" src={ProtoColImage} alt="" />
            </Link>

            {address && (
              <div className="wallet-link">
                <Link href={`https://bscscan.com/address/${address}`} target="_blank">
                  {shorten(address)}
                </Link>
              </div>
            )}
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              {networkId === 56 || networkId === 97 ? (
                <>
                  <Link
                    component={NavLink}
                    id="dash-nav"
                    to="/dashboard"
                    isActive={(match, location) => {
                      return checkPage(match, location, "dashboard");
                    }}
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  >
                    <Typography variant="h6">
                      <SvgIcon color="primary" component={DashboardIcon} />
                      <Trans>Dashboard</Trans>
                    </Typography>
                  </Link>

                  <Link
                    id="buy-nav"
                    href={"https://pancakeswap.finance/swap?outputCurrency=0xB4c16Ed711c06b84e4312d5f09bcbD88E4F4d3b6"}
                    target="_blank"
                    className={`button-dapp-menu`}
                  >
                    <Typography variant="h6">
                      <SvgIcon color="primary" viewBox="0 0 90 90" component={BuyIcon} />
                      <Trans>Buy</Trans>
                    </Typography>
                  </Link>

                  <Link
                    component={NavLink}
                    id="stake-nav"
                    to="/stake"
                    isActive={(match, location) => {
                      return checkPage(match, location, "stake");
                    }}
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  >
                    <Typography variant="h6">
                      <SvgIcon color="primary" component={StakeIcon} />
                      <Trans>Stake</Trans>
                    </Typography>
                  </Link>

                  {/* <Link
                    component={NavLink}
                    id="wrap-nav"
                    to="/wrap"
                    isActive={(match, location) => {
                      return checkPage(match, location, "wrap");
                    }}
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  >
                    <Box display="flex" alignItems="center">
                      <SvgIcon component={WrapIcon} color="primary" viewBox="1 0 20 22" />
                      <Typography variant="h6">Wrap</Typography>
                    </Box>
                  </Link> */}

                  {/* <Link
                    href={"https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"}
                    target="_blank"
                  >
                    <Typography variant="h6">
                      <BridgeIcon />
                      <Trans>Bridge</Trans>
                      <SvgIcon style={{ marginLeft: "5px" }} component={ArrowUpIcon} />
                    </Typography>
                  </Link> */}

                  <Link
                    component={NavLink}
                    id="bond-nav"
                    to="/mints"
                    isActive={(match, location) => {
                      return checkPage(match, location, "mints");
                    }}
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  >
                    <Typography variant="h6">
                      <SvgIcon color="primary" component={BondIcon} />
                      <Trans>Mint</Trans>
                    </Typography>
                  </Link>

                  <div className="dapp-menu-data discounts">
                    <div className="bond-discounts">
                      <Typography variant="body2">
                        <Trans>Mint Discounts</Trans>
                      </Typography>
                      {bonds.map((bond, i) => {
                        // NOTE (appleseed): temporary for ONHOLD MIGRATION
                        // if (bond.getBondability(networkId)) {
                        if (bond.getBondability(networkId) || bond.getLOLability(networkId)) {
                          return (
                            <Link component={NavLink} to={`/mints/${bond.name}`} key={i} className={"bond"}>
                              {!bond.bondDiscount ? (
                                <Skeleton variant="text" width={"150px"} />
                              ) : (
                                <Typography variant="body2">
                                  {bond.displayName}

                                  <span className="bond-pair-roi">
                                    { `${bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%`}
                                    {/* {!bond.isBondable[networkId]
                                      ? "Sold Out"
                                      : `${bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%`} */}
                                  </span>
                                </Typography>
                              )}
                            </Link>
                          );
                        }
                      })}
                    </div>
                  </div>
                  <Link
                    component={NavLink}
                    id="index-nav"
                    to="/index"
                    isActive={(match, location) => {
                      return checkPage(match, location, "index");
                    }}
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  >
                    <Typography variant="h6">
                      <SvgIcon color="primary" component={CalculatorIcon} />
                      <Trans>D3 Index</Trans>
                    </Typography>
                  </Link>

                  <Link
                    component={NavLink}
                    id="airdrop-nav"
                    to="/dividend"
                    isActive={(match, location) => {
                      return checkPage(match, location, "dividend");
                    }}
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  >
                    <Typography variant="h6">
                      <SvgIcon color="primary" component={AirdropIcon} />
                      <Trans>Dividend</Trans>
                    </Typography>
                  </Link>
                  <Link
                    component={NavLink}
                    id="calculator-nav"
                    to="/calculator"
                    isActive={(match, location) => {
                      return checkPage(match, location, "calculator");
                    }}
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  >
                    <Typography variant="h6">
                      <SvgIcon color="primary" component={CalculatorIcon} />
                      <Trans>Calculator</Trans>
                    </Typography>
                  </Link>

                  {/* <Box className="menu-divider">
                    <Divider />
                  </Box> */}
                  {/* <Link
                    component={NavLink}
                    id="zap-nav"
                    to="/zap"
                    isActive={(match, location) => {
                      return checkPage(match, location, "zap");
                    }}
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  >
                    <Box display="flex" alignItems="center">
                      <SvgIcon component={ZapIcon} color="primary" />
                      <Typography variant="h6">OlyZaps</Typography>
                      <SvgIcon component={NewIcon} viewBox="21 -2 20 20" style={{ width: "80px" }} />
                    </Box>
                  </Link> */}

                  {/* <Link
                    component={NavLink}
                    id="33-together-nav"
                    to="/33-together"
                    isActive={(match, location) => {
                      return checkPage(match, location, "33-together");
                    }}
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  >
                    <Typography variant="h6">
                      <SvgIcon color="primary" component={PoolTogetherIcon} />
                      3,3 Together
                    </Typography>
                  </Link>
                  <Box className="menu-divider">
                    <Divider />
                  </Box> */}
                  <Box className="menu-divider"></Box>
                </>
              ) : (
                <>
                  {/* <Link
                    component={NavLink}
                    id="wrap-nav"
                    to="/wrap"
                    isActive={(match, location) => {
                      return checkPage(match, location, "wrap");
                    }}
                    className={`button-dapp-menu ${isActive ? "active" : ""}`}
                  >
                    <Box display="flex" alignItems="center">
                      <SvgIcon component={WrapIcon} color="primary" viewBox="1 0 20 22" />
                      <Typography variant="h6">Wrap</Typography>
                    </Box>
                  </Link> */}

                  {/* <Link
                    href={"https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"}
                    target="_blank"
                  >
                    <Typography variant="h6">
                      <BridgeIcon />
                      <Trans>Bridge</Trans>
                      <SvgIcon style={{ marginLeft: "5px" }} component={ArrowUpIcon} />
                    </Typography>
                  </Link> */}
                </>
              )}
            </div>
          </div>
        </div>
        <Box className="dapp-menu-bottom" display="flex" justifyContent="space-between" flexDirection="column">
          <div className="dapp-menu-external-links">
            {Object.keys(externalUrls).map((link, i) => {
              return (
                <Link key={i} href={`${externalUrls[link].url}`} target="_blank">
                  <Typography variant="h6">{externalUrls[link].icon}</Typography>
                  <Typography variant="h6">{externalUrls[link].title}</Typography>
                </Link>
              );
            })}
          </div>
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
