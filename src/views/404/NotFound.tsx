import OlympusLogo from "../../assets/Olympus Logo.svg";
import "./notfound.scss";
import { Trans } from "@lingui/macro";

export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="https://d3protocol.io" target="_blank">
          <img className="branding-header-icon" src={OlympusLogo} alt="DefiDao" />
        </a>

        <h4>
          <Trans>Page not found</Trans>
        </h4>
      </div>
    </div>
  );
}
