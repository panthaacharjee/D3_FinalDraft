import { Typography, Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

interface StakeRowProps {
  title: string;
  indented?: boolean;
  id?: string;
  balance: string;
  isAppLoading?: boolean;
}

const StakeRow = (props: StakeRowProps) => {
  return (
    <Grid container>
      <Grid
        item
        xs={6}
        style={{ display: "flex", justifyContent: "flex-start" }}
      >
        <Typography style={{ fontSize: "12px", color: "#909090" }}>
          {props.title}
        </Typography>
      </Grid>
      <Grid item xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Typography style={{ fontSize: "12px", color: "white" }}>
          {props.isAppLoading ? (
            <Skeleton width="80px" />
          ) : (
            <>{props.balance}</>
          )}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default StakeRow;
