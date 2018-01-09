import { branch, renderComponent } from "recompose"

export const onSuccess = (component, propName = `data`) =>
  branch(props => props[propName] && props[propName].success, renderComponent(component))
