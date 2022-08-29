import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as ProIcon } from "../../assets/icons/pro.svg";
import VoteIcon from "../../assets/images/vote.png";
import ChartIcon from "../../assets/images/chart.png";
import { SvgIcon } from "@material-ui/core";
import { Trans } from "@lingui/macro";

const externalUrls = [
  /*{
    title: <Trans>Vote</Trans>,
    url: "https://vote.d3protocol.io/",
    icon: <img width="20px" style={{ marginRight: "13px" }} src={VoteIcon} alt="" />,
  },*/
  {
    title: <Trans>Docs</Trans>,
    url: "https://docs.d3protocol.io/",
    icon: <SvgIcon color="primary" component={DocsIcon} />,
  },
  {
    title: <Trans>Charts</Trans>,
    url: "https://dexscreener.com/bsc/0xf9A3b7A967084630c5a3100f88ef981e3BBb1DAa",
    icon: <img width="20px" style={{ marginRight: "13px" }} src={ChartIcon} alt="" />,
  },
  /*{
    title: <Trans>NEW</Trans>,
    url: "https://docs.olympusdao.finance/",
    icon: <SvgIcon color="primary" viewBox="0 0 25 26" component={ProIcon} />,
  },*/
];

export default externalUrls;
