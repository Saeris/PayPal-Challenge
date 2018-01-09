import { Layout } from "@components/structural"
import { NavLink } from "react-router-dom"
import "./home.scss"

export const Home = () => (
  <Layout id="home">
    <section styleName="navigation">
      <NavLink styleName="btn" to="/send">
        <span className="icon icon-medium icon-send-money" />
        Send Money
      </NavLink>
      <NavLink styleName="btn" to="/history">
        <span className="icon icon-medium icon-wallet" />
        Transaction History
      </NavLink>
    </section>
  </Layout>
)
