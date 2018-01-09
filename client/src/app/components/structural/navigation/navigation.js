import { NavLink } from "react-router-dom"
import routes from "@routes/routes"
import "./navigation.scss"

export const Navigation = () => (
  <nav styleName="navigation">
    <NavLink to="/" styleName="logo" title="Home" />
    <ul>
      {routes?.map(({ path, title, nav, icon }) => (
        nav && <li><NavLink to={path} activeClassName="active" title={title}>{title}</NavLink></li>
      ))}
    </ul>
  </nav>
)
