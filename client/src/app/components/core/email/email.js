import { Link } from "@components/core"

const toSearchString = (searchParams = {}) =>
  Object.keys(searchParams)
    .map(key => `${key}=${encodeURIComponent(searchParams[key])}`)
    .join(`&`)

const createMailtoLink = (email, headers) => `mailto:${email}${headers ? `?${toSearchString(headers)}` : ``}`

export default class Email extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    address: PropTypes.string.isRequired,
    headers: PropTypes.object,
    obfuscate: PropTypes.bool
  }

  defaultProps = {
    obfuscate: false
  }

  render({ obfuscate }) {
    return obfuscate ? this.renderObfuscatedLink() : this.renderLink()
  }

  renderLink() {
    const { address, headers, children, ...others } = this.props
    return (
      <Link href={createMailtoLink(address, headers)} {...others}>
        {children}
      </Link>
    )
  }

  renderObfuscatedLink() {
    const { children, ...others } = this.props
    return (
      <Link onClick={this.handleClick.bind(this)} href="mailto:obfuscated" {...others}>
        {children}
      </Link>
    )
  }

  handleClick(event) {
    event.preventDefault()
    const { address, headers } = this.props
    window.location.href = createMailtoLink(address, headers)
  }
}
