import { Header } from "@components/structural/header"
import "./layout.scss"

export default class Layout extends Component {
  static propTypes = {
    id: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  render({ id, children }) {
    return (
      <div styleName={`layout`}>
        <Header />
        <main id={id}>{children}</main>
      </div>
    )
  }
}
