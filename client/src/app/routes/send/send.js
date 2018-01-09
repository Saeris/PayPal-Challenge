import { compose } from "recompose"
import { reduxForm, formValueSelector } from "redux-form" // https://github.com/erikras/redux-form
import { NavLink } from "react-router-dom"
import FontAwesomeIcon from '@fortawesome/react-fontawesome' // https://github.com/FortAwesome/react-fontawesome
import { faSpinner } from '@fortawesome/fontawesome-free-solid'
import { onError, whileLoading, onSuccess, withMutationState } from "@components/compositional"
import { Layout } from "@components/structural"
import { SendMoneyForm } from "./sendMoneyForm"
import sendMoney from "./sendMoney.gql"
import "./send.scss"

const getName = ({ type, name, fullName }) => {
  switch (type) {
    case `Bank`: return name
    case `Business`: return name
    default: return fullName
  }
}

const makeAnotherPayment = (set, reset) => {
  set({ loading: false, error: null, success: null })
  reset()
}

const Loading = () => (
  <section>
    <div styleName="state loading">
      <span className="icon" size="5x">
        <FontAwesomeIcon icon={faSpinner} spin size="4x" />
      </span>
      <span>{`Processing payment request...`}</span>
    </div>
  </section>
)

const Success = ({ mutation: { success, set }, reset }) => {
  const { to, amount, currency } = success
  const sentAmount = amount.toLocaleString(`en-US`, { style: `currency`, currencyDisplay: `symbol`, currency }) || ``
  return (
    <section>
      <div styleName="state success">
        <span className="icon icon-medium icon-checkmark-small" />
        <span>{`Success!`}</span>
        <span>{`You have sent ${sentAmount} ${currency || ``} to ${getName(to)}!`}</span>
        <NavLink onClick={() => makeAnotherPayment(set, reset)} to="/send">Make Another Payment</NavLink>
        <NavLink to="/history">View Transaction History</NavLink>
      </div>
    </section>
  )
}

const Failure = ({ mutation: { set }, reset }) => (
  <section>
    <div styleName="state failure">
      <span className="icon icon-medium icon-critical-small" />
      <span>{`Whoops! An error has occurred on our end!`}</span>
      <NavLink onClick={() => makeAnotherPayment(set, reset)} to="/send">Make Another Payment</NavLink>
      <NavLink to="/history">View Transaction History</NavLink>
    </div>
  </section>
)

const selector = formValueSelector(`sendMoney`)

const Form = compose(
  reduxForm({
    form: `sendMoney`,
    initialValues: {
      currency: `USD`,
      type: `Transfer`
    }
  }),
  connect(state => {
    const currency = selector(state, `currency`)
    return { currency }
  }),
  withMutationState(),
  graphql(sendMoney, {
    props: ({ mutate, ownProps: { mutation } }) => ({
      submit: async ({ to, ...rest }) => {
        try {
          mutation.set({ loading: true })
          const { data: { sendPayment } } = await mutate({
            variables: {
              input: {
                to: { where: `Email`, equals: to },
                from: { where: `Username`, equals: `saeris` },
                category: `MoneyTransfers`,
                type: `Transfer`,
                ...rest
              }
            }
          })
          // simulate some loading time because this returns almost instantly
          await new Promise(resolve => setTimeout(resolve, 3000))
          mutation.set({ loading: false, error: null, success: sendPayment })
        } catch (error) {
          mutation.set({ loading: false, error, success: false })
        }
      }
    })
  }),
  whileLoading(Loading, `mutation`),
  onSuccess(Success, `mutation`),
  onError(Failure, `mutation`)
)(SendMoneyForm)


export const Send = () => (
  <Layout id="send">
    <Form />
  </Layout>
)
