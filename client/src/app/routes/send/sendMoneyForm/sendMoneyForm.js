import { compose } from "recompose"
import { Field } from "redux-form"
import Button from "material-ui/Button"
import Radio, { RadioGroup } from "material-ui/Radio"
import Input, { InputLabel } from "material-ui/Input"
import Select from "material-ui/Select"
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from "material-ui/Form"
import accounting from "accounting"
import getCurrencies from "./getCurrencies.gql"
import "./sendMoneyForm.scss"

//oxr.set({ app_id: `1077b3f9c7b949999fba754fa70732c3` })
//oxr.latest()

const required = value => (value ? null : `Required`)
const number = value => (value && isNaN(Number(value)) ? `Amount must be a number.` : null)
const nonNegative = value => {
  const parsed = accounting.unformat(value)
  return (parsed | 0 == parsed && parsed > 0 ? null : `Amount cannot be negative.`) // eslint-disable-line
}
const email = value =>
  (value && !(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i).test(value) ? `Invalid email address` : null)

const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <FormControl error={touched && error}>
    <InputLabel htmlFor={input.name}>{label}</InputLabel>
    <Input autocomplete={false} id={input.name} {...input} {...custom} />
    <FormHelperText>{touched && error}</FormHelperText>
  </FormControl>
)

const renderSelect = ({ input, label, meta: { touched, error }, children, ...custom }) => (
  <FormControl>
    <FormLabel htmlFor={input.name}>{label}</FormLabel>
    <Select
      native
      id={input.name}
      {...input}
      onChange={(event, index, value) => input.onChange(value)}
      input={<Input id={input.name} error={error} />}
      children={children}
      {...custom}
    />
    <FormHelperText>{touched && error}</FormHelperText>
  </FormControl>
)

const renderRadio = ({ input, label, meta: { touched, error }, children, ...custom }) => (
  <FormControl component="fieldset">
    <FormLabel component="legend">{label}</FormLabel>
    <RadioGroup
      aria-label={input.name}
      id={input.name}
      {...input}
      onChange={(event, value) => input.onChange(value)}
      children={children}
      {...custom}
    />
    <FormHelperText>{touched && error}</FormHelperText>
  </FormControl>
)

const SendMoneyForm = ({ loading, results, handleSubmit, submit, error, pristine, reset, submitting, currency }) => (
  <form id="sendMoneyForm" onSubmit={handleSubmit(submit)}>
    <div styleName="inputRow email">
      <Field autofocus fullWidth name="to" label="Send to" component={renderTextField} validate={[required, email]} />
    </div>
    <div styleName="inputRow currency">
      <Field
        fullwidth
        name="amount"
        label="Amount"
        component={renderTextField}
        validate={[required, number, nonNegative]}
      />
      <Field autowidth name="currency" component={renderSelect} validate={[required]}>
        {!loading && results.currencies.map(({ code, name }) => <option value={code}>{code}</option>)}
      </Field>
    </div>
    <div styleName="inputRow">
      <Field multiLine rows={2} name="purpose" label="Message (optional)" component={renderTextField} />
    </div>
    <div styleName="inputRow type">
      <Field required name="type" label="What's this payment for?" component={renderRadio} validate={[required]}>
        <FormControlLabel value="Transfer" label="I'm sending money to family or friends" control={<Radio />} />
        <FormControlLabel value="Payment" label="I'm paying for goods or services" control={<Radio />} />
      </Field>
    </div>
    <div styleName="inputRow submit">
      <Button raised onClick={reset} disabled={pristine || submitting}>Clear</Button>
      <Button raised type="submit" color="primary" disabled={error || submitting || pristine}>Next</Button>
    </div>
  </form>
)

export default compose(
  graphql(getCurrencies, {
    props: ({ data: { loading, results } }, ownProps) => ({ loading, results })
  })
)(SendMoneyForm)
