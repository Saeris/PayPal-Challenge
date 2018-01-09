import { branch, renderComponent } from "recompose"

export const onError = (component, propName = `data`) =>
  branch(props => props[propName] && props[propName].error, renderComponent(component))
