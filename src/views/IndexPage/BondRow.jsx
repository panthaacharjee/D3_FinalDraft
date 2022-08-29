import BondLogo from "../../components/BondLogo";
import { DisplayBondPrice, DisplayBondDiscount } from "../Bond/Bond";
import {
  Box,
  Button,
  Link,
  Paper,
  Typography,
  TableRow,
  TableCell,
  SvgIcon,
  Slide,
} from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { NavLink } from "react-router-dom";
import "./indexPage.scss";
import { t, Trans } from "@lingui/macro";
import { Skeleton } from "@material-ui/lab";
import useBonds from "../../hooks/Bonds";
import { useSelector } from "react-redux";
import { trim } from "../../helpers";

export function AssetDataCard({ asset }) {
  const isBondLoading = !asset.assetPrice ?? true;

  return (
    <Slide direction="up" in={true}>
      <Paper id={`${asset.name}--bond`} className="bond-data-card ohm-card">
        <div className="bond-pair">
          <BondLogo bond={asset} />
        </div>
        <div className="data-row">
          <Typography>
            <Trans>Price</Trans>
          </Typography>
          <Typography className="bond-price">
            <>{isBondLoading ? <Skeleton width="50px" /> : asset.assetPrice}</>
          </Typography>
        </div>
        <div className="data-row">
          <Typography>
            <Trans>Amount</Trans>
          </Typography>
          <Typography>
            {isBondLoading ? (
              <Skeleton width="50px" />
            ) : (
              trim(asset.assetAmount, 3)
            )}
          </Typography>
        </div>

        <div className="data-row">
          <Typography>
            <Trans>Ballance</Trans>
          </Typography>
          <Typography>
            {isBondLoading ? (
              <Skeleton width="80px" />
            ) : (
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(asset.assetPrice * asset.assetAmount)
            )}
          </Typography>
        </div>
      </Paper>
    </Slide>
  );
}

export function AssetTableData({ asset, style }) {
  const isAssetLoading = !asset.assetPrice ?? true;
  return (
    <TableRow id={`${asset.name}--bond`}>
      <TableCell align="right">
        <BondLogo bond={asset} />
      </TableCell>
      <TableCell align="left" className="bond-name-cell">
        <div className="bond-name">
          <Typography style={style}>{asset.displayName}</Typography>
        </div>
      </TableCell>
      <TableCell align="center">
        <Typography style={style}>
          <>
            {isAssetLoading ? (
              <Skeleton width="50px" />
            ) : (
              trim(asset.assetPrice, 7)
            )}
          </>
        </Typography>
      </TableCell>
      {/* <TableCell align="center">
        <Typography style={style}>
          {isAssetLoading ? (
            <Skeleton width="50px" />
          ) : (
            trim(asset.assetAmount, 3)
          )}
        </Typography>
      </TableCell> */}
      <TableCell align="center">
        <Typography style={style}>
          {isAssetLoading ? (
            <Skeleton />
          ) : (
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            }).format(asset.assetPrice * asset.assetAmount)
          )}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
