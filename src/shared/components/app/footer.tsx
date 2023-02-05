import { Component } from "inferno";
import { NavLink } from "inferno-router";
import { GetSiteResponse } from "lemmy-js-client";
import { i18n } from "../../i18next";
import { UserService } from "../../services";

interface FooterProps {
  site: GetSiteResponse;
}

export class Footer extends Component<FooterProps, any> {
  constructor(props: any, context: any) {
    super(props, context);
  }

  render() {
    return (
      <nav className="container-lg navbar navbar-expand-md navbar-light navbar-bg p-3">
        <div className="navbar-collapse">
          <ul className="navbar-nav ml-auto">
            {this.canAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/modlog">
                  {i18n.t("modlog")}
                </NavLink>
              <li className="nav-item">
                <NavLink className="nav-link" to="/modlog">
                  {i18n.t("modlog")}
                </NavLink>
              </li>
            )}
            {this.props.site.site_view.local_site.legal_information && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/legal">
                  {i18n.t("legal_information")}
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}
