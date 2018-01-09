import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from "material-ui/ExpansionPanel"
import format from 'date-fns/format'
import InfiniteScroll from "react-infinite-scroller" // https://github.com/CassetteRocks/react-infinite-scroller
import { Email, Loading } from "@components/core"
import { Layout } from "@components/structural"
import transactions from "./transactions.gql"
import "./history.scss"

const currentUser = `saeris`

class History extends Component {
  state = {
    expanded: null
  }

  handleChange = panel => (event, expanded) => {
    this.setState({ expanded: expanded ? panel : false })
  }

  getName = ({ type, name, fullName }) => {
    switch (type) {
      case `Bank`: return name
      case `Business`: return name
      default: return fullName
    }
  }

  renderPayment = ({ payment: { id, to, from, amount, currency, type, category, status, purpose, sent } }) => {
    const { expanded } = this.state
    const otherUser = to.username === currentUser ? from : to
    return (
      <ExpansionPanel key={id} styleName="payment" expanded={expanded === id} onChange={this.handleChange(id)}>
        <ExpansionPanelSummary styleName={`row basics ${expanded === id ? `active` : ``}`}>
          <div styleName="date">
            <span styleName="month">{format(sent, `MMM`)}</span>
            <span styleName="day">{format(sent, `Do`)}</span>
          </div>
          <div styleName="description">
            <div styleName="top row">
              <span styleName="username">{this.getName(otherUser)}</span>
              <span styleName={`amount ${to.username === currentUser ? `positive` : ``}`}>
                {to.username === currentUser ? `+` : `-`}
                {amount.toLocaleString(`en-US`, { style: `currency`, currencyDisplay: `symbol`, currency })}
              </span>
            </div>
            <div styleName="bottom row">
              <span styleName="type">{type}</span>
              <span styleName="category">{category}</span>
            </div>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails styleName="row details">
          <div styleName="column">
            {type && (
              <div styleName="info">
                <strong>Payment Type</strong>
                <span>{type}</span>
              </div>
            )}
            {category && (
              <div styleName="info">
                <strong>Category</strong>
                <span>{category}</span>
              </div>
            )}
            {purpose && (
              <div styleName="info">
                <strong>Message</strong>
                <span>{purpose}</span>
              </div>
            )}
          </div>
          <div styleName="column">
            <div styleName="info">
              <strong>{to.username === currentUser ? `Paid By` : `Paid To`}</strong>
              <span>{otherUser.type}</span>
              <span>{this.getName(otherUser)}</span>
              <span>{otherUser.email && (
                <Email address={otherUser.email} obfuscate>
                  {otherUser.email}
                </Email>
              )}</span>
            </div>
            <div styleName="info">
              <strong>Transaction ID</strong>
              <span>{id}</span>
            </div>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }

  render({ loading, user, loadMore }) {
    const payments = user?.transactions.edges
    //const total = user?.transactionsCount
    if (payments && payments.length) {
      const hasMore = user.transactions.pageInfo.hasNextPage
      return (
        <Layout id="history">
          <section styleName="completed">
            <h3>Completed</h3>
            <InfiniteScroll
              className="transactions"
              initialLoad={!loading}
              loadMore={loadMore}
              threshold={250}
              hasMore={hasMore && !loading}
              loader={<Loading />}
            >
              {payments.map(payment => this.renderPayment(payment))}
            </InfiniteScroll>
          </section>
        </Layout>
      )
    }
    return <Layout id="history"><Loading /></Layout>
  }
}

export default graphql(transactions, {
  options: props => ({
    variables: { username: currentUser, first: 5 },
    fetchPolicy: `cache-and-network`
  }),
  props: ({ data: { loading, user, fetchMore } }, ownProps) => ({
    loading,
    user,
    loadMore: () => fetchMore({
      transactions,
      variables: {
        username: currentUser,
        first: 5,
        after: user.transactions.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.user.transactions.edges
        const pageInfo = fetchMoreResult.user.transactions.pageInfo
        if (newEdges.length) {
          return {
            user: {
              ...previousResult.user,
              transactions: {
                __typename: previousResult.user.transactions.__typename,
                edges: [...previousResult.user.transactions.edges, ...newEdges],
                pageInfo
              }
            }
          }
        }
        return previousResult
      }
    })
  })
})(History)
