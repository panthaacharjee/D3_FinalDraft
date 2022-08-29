import { useState } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import "./ohmmenu.scss";
import { Trans } from "@lingui/macro";
import Grid from "@material-ui/core/Grid";
import OhmImg from "../../assets/tokens/token_OHM.svg";
import SOhmImg from "../../assets/tokens/token_sOHM.svg";
import WsOhmImg from "../../assets/tokens/token_wsOHM.svg";
import token33tImg from "../../assets/tokens/token_33T.svg";
import { segmentUA } from "../../helpers/userAnalyticHelpers";
import { useSelector } from "react-redux";
import { useWeb3Context } from "../../hooks";

const addTokenToWallet = (tokenSymbol, tokenAddress, address) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    let tokenPath;
    let tokenDecimals = TOKEN_DECIMALS;
    switch (tokenSymbol) {
      case "OHM":
        tokenPath = OhmImg;
        break;
      case "33T":
        tokenPath = token33tImg;
        break;
      case "gOHM":
        tokenPath = WsOhmImg;
        tokenDecimals = 18;
        break;
      default:
        tokenPath = SOhmImg;
    }
    const imageURL = `${host}/${tokenPath}`;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: imageURL,
          },
        },
      });
      let uaData = {
        address: address,
        type: "Add Token",
        tokenName: tokenSymbol,
      };
      segmentUA(uaData);
    } catch (error) {
      console.log(error);
    }
  }
};

function OhmMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { address } = useWeb3Context();
  const networkId = useSelector(state => state.network.networkId);

  const sD3_ADDRESS = addresses[networkId] && addresses[networkId].sD3_ADDRESS;
  const D3_ADDRESS = addresses[networkId] && addresses[networkId].D3_ADDRESS;
  const PT_TOKEN_ADDRESS = addresses[networkId] && addresses[networkId].PT_TOKEN_ADDRESS;
  const GOHM_ADDRESS = addresses[networkId] && addresses[networkId].GOHM_ADDRESS;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = "ohm-popper";
  return (
    <Grid
      container
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="ohm-menu-button-hover"
    >
      <Button id="ohm-menu-button" size="large" variant="contained" color="secondary" title="DEFI" aria-describedby={id}>
        {/* <SvgIcon component={InfoIcon} color="primary" /> */}
        <Typography className="ohm-menu-button-text">Buy DEFI</Typography>
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="ohm-menu" elevation={1}>
                <Box component="div" className="buy-tokens">
                  <Link
                    href={`https://pancakeswap.finance/swap?outputCurrency=${D3_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography style={{ color: " #f4c10b " }} align="left">
                        <Trans>Buy on {new String("PancakeSwap")}</Trans>
                        <SvgIcon component={ArrowUpIcon} htmlColor="#f4c10b" />
                      </Typography>
                    </Button>
                  </Link>
                </Box>
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Grid>
  );
}

export default OhmMenu;
