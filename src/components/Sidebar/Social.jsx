import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as Medium } from "../../assets/icons/medium.svg";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { ReactComponent as Telegram } from "../../assets/icons/telegram.svg";
import { ReactComponent as Discord } from "../../assets/icons/discord.svg";
import FarmIcon from "../../assets/images/farm.png";

export default function Social() {
  return (
    <div className="social-row">
      <Link href="https://twitter.com/d3protocol" target="_blank">
        <SvgIcon color="primary" component={Twitter} />
      </Link>

      <Link href="https://t.me/d3protocol" target="_blank">
        <SvgIcon color="primary" component={Telegram} />
      </Link>

      <Link href="https://discord.gg/d3protocol" target="_blank">
        <SvgIcon color="primary" component={Discord} />
      </Link>

      <Link href="https://medium.com/@d3protocol" target="_blank">
        <SvgIcon color="primary" component={Medium} />
      </Link>
    </div>
  );
}
