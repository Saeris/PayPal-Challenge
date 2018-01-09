import { createElement } from 'preact'
import hoistNonReactStatic from 'hoist-non-react-statics'

const getDisplayName = WrappedComponent => WrappedComponent.displayName || WrappedComponent.name || `Component`

// Forked/Extended from: https://github.com/lhz516/react-apollo-mutation-state
// added success state
export const withMutationState = (name = `mutation`) => SourceComponent => {
  class MutationState extends Component {
    state = { loading: false, error: null, success: null }

    set = (param = { error: this.state.error }) => {
      const { loading, error, success } = param
      if (typeof loading !== `boolean`) {
        throw new Error(`You must provide 'loading' in ${name}.set function. For example: ${name}.set({ loading: true })`)
      }
      this.setState({ loading, error, success })
    };

    get loading() { return this.state.loading }

    get error() { return this.state.error }

    get success() { return this.state.success }

    render() {
      if (this.props[name]) throw new Error(`Duplicated props named '${name}'`)

      const mutation = { set: this.set, loading: this.loading, error: this.error, success: this.success }

      return createElement(SourceComponent, Object.assign({}, this.props, { [name]: mutation }))
    }
  }

  MutationState.displayName = `MutateState(${getDisplayName(SourceComponent)})`
  hoistNonReactStatic(MutationState, SourceComponent)
  return MutationState
}
