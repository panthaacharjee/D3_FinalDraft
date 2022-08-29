import { useSelector } from "react-redux";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  SvgIcon,
  Zoom,
} from "@material-ui/core";
import { t, Trans } from "@lingui/macro";
import { AssetTableData, AssetDataCard } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { formatCurrency, trim } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import useAssets from "src/hooks/Asset";
import { IAllAssetData } from "src/hooks/Asset";
import { Asset } from "../../lib/Asset";
import { useHistory } from "react-router";
import { usePathForNetwork } from "../../hooks/usePathForNetwork";
import "./indexPage.scss";
import { Skeleton } from "@material-ui/lab";
// import isEmpty from "lodash/isEmpty";
import { allBondsMap } from "../../helpers/AllBonds";
import { useAppSelector } from "../../hooks";
import { IUserBondDetails } from "../../slices/AccountSlice";
import { useState, useEffect } from "react";
import { ReactComponent as Background } from "../../assets/page-bg.svg";

function IndexPage() {
  const networkId = useAppSelector((state) => state.network.networkId);
  const history = useHistory();
  const { bonds } = useBonds(networkId);
  const { assets, total } = useAssets();

  const treasuryBalance: number | undefined = useAppSelector((state) => {
    if (state.bonding.loading == false) {
      let tokenBalances = 0;
      for (const bond in allBondsMap) {
        if (state.bonding[bond] && state.bonding[bond].purchased) {
          tokenBalances += state.bonding[bond].purchased;
        }
      }
      return tokenBalances;
    }
  });
  usePathForNetwork({ pathName: "bonds", networkID: networkId, history });
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const isAppLoading: boolean = useAppSelector((state) => state.app.loading);
  const isAccountLoading: boolean = useAppSelector(
    (state) => state.account.loading
  );
  const accountBonds: IUserBondDetails[] = useAppSelector((state) => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });

  const marketPrice: number | undefined = useAppSelector((state) => {
    return state.app.marketPrice;
  });

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
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "85vh", zIndex: 100 }}
      >
        <Paper
          style={{
            width: "60vw",
            borderRadius: "12px",
            padding: "1%",
            backgroundColor: "#1C1C1C",
          }}
        >
          {/* <Grid
            container
            item
            xs={12}
            style={{ margin: "10px 0px 20px" }}
            justifyContent="center"
          >
            <Grid item xs={3} className={`ohm-price`}>
              <Box textAlign="center">
                <Typography style={{ fontSize: "14px", color: "#868686", marginBottom:"10px"}}>
                  <Trans>DEFI Price</Trans>
                </Typography>
                <Typography
                  style={{
                    fontSize: "22px",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isAppLoading || isNaN(Number(marketPrice)) ? (
                    <Skeleton width="180px" />
                  ) : (
                    formatCurrency(Number(marketPrice), 2)
                  )}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={3}>
              <Box textAlign="center">
                <Typography style={{ fontSize: "14px", color: "#868686",  marginBottom:"10px" }}>
                  <Trans>Index Balance</Trans>
                </Typography>
                <Box>
                  <Typography
                    style={{
                      fontSize: "22px",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {isAppLoading || isNaN(Number(total)) ? (
                      <Skeleton
                        width="180px"
                        data-testid="treasury-balance-loading"
                      />
                    ) : (
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(Number(total))
                    )}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={3}>
              <Box textAlign="center">
                <Typography style={{ fontSize: "14px", color: "#868686",  marginBottom:"10px" }}>
                  <Trans>AUM</Trans>
                </Typography>
                <Box>
                  <Typography
                    style={{
                      fontSize: "22px",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {isAppLoading || isNaN(Number(treasuryBalance)) ? (
                      <Skeleton
                        width="180px"
                        data-testid="treasury-balance-loading"
                      />
                    ) : (
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(Number(total + Number(treasuryBalance)))
                    )}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid> */}

          {!isSmallScreen && (
            <Grid container item>
              <TableContainer>
                <Table aria-label="Available bonds">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right"></TableCell>
                      <TableCell align="left" style={{ fontSize: "14px" }}>
                        <Trans>ASSETS</Trans>
                      </TableCell>
                      <TableCell align="center" style={{ fontSize: "14px" }}>
                        <Trans>FLOAT PRICE</Trans>
                      </TableCell>
                      {/* <TableCell align="center" style={{ fontSize: "14px" }}>
                        <Trans>Amount</Trans>
                      </TableCell> */}
                      <TableCell align="center" style={{ fontSize: "14px" }}>
                        <Trans>Balance</Trans>
                      </TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assets.map((asset) => {
                      if (asset.name) {
                        return (
                          <AssetTableData
                            key={asset.name}
                            asset={asset}
                            style={{ fontSize: "14px" }}
                          />
                        );
                      }
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Paper>

        {isSmallScreen && (
          <Box className="ohm-card-container">
            <Grid container item spacing={2}>
              <>
                {assets.map((asset) => {
                  if (asset.name) {
                    return (
                      <Grid item xs={12} key={asset.name}>
                        <AssetDataCard key={asset.name} asset={asset} />
                      </Grid>
                    );
                  }
                })}
              </>
            </Grid>
          </Box>
        )}
      </Grid>
    </>
  );
}

export default IndexPage;
