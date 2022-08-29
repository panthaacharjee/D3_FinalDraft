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
  Zoom,
} from "@material-ui/core";
import { t, Trans } from "@lingui/macro";
import { BondDataCard, BondTableData } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { formatCurrency, trim } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import { useHistory } from "react-router";
import { usePathForNetwork } from "../../hooks/usePathForNetwork";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import ClaimBonds from "./ClaimBonds";
import isEmpty from "lodash/isEmpty";
import { allBondsMap } from "../../helpers/AllBonds";
import { useAppSelector } from "../../hooks";
import { IUserBondDetails } from "../../slices/AccountSlice";

function ChooseBond() {
  const networkId = useAppSelector((state) => state.network.networkId);
  const history = useHistory();
  const { bonds } = useBonds(networkId);
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

  return (
    <div id="choose-bond-view">
      {!isAccountLoading && !isEmpty(accountBonds) && (
        <ClaimBonds activeBonds={accountBonds} />
      )}
      {!isSmallScreen && (
        <Grid container item>
          <TableContainer>
            <Table aria-label="Available bonds">
              <TableHead>
                <TableRow>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    <Trans>Mint</Trans>
                  </TableCell>
                  <TableCell align="center">
                    <Trans>Emission</Trans>
                  </TableCell>
                  <TableCell align="center">
                    <Trans>Price</Trans>
                  </TableCell>

                  <TableCell align="center">
                    <Trans>Purchased</Trans>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bonds.map((bond) => {
                  // NOTE (appleseed): temporary for ONHOLD MIGRATION
                  // if (bond.getBondability(networkId)) {
                  if (
                    bond.getBondability(networkId) ||
                    bond.getLOLability(networkId)
                  ) {
                    return <BondTableData key={bond.name} bond={bond} />;
                  }
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}

      {isSmallScreen && (
        <Box className="ohm-card-container">
          <Grid container item spacing={2}>
            {bonds.map((bond) => {
              // NOTE (appleseed): temporary for ONHOLD MIGRATION
              // if (bond.getBondability(networkId)) {
              if (
                bond.getBondability(networkId) ||
                bond.getLOLability(networkId)
              ) {
                return (
                  <Grid item xs={12} key={bond.name}>
                    <BondDataCard key={bond.name} bond={bond} />
                  </Grid>
                );
              }
            })}
          </Grid>
        </Box>
      )}
    </div>
  );
}

export default ChooseBond;
