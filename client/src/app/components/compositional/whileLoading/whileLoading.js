import { branch, renderComponent } from "recompose"

export const whileLoading = (component, propName = `data`) =>
  branch(props => props[propName] && props[propName].loading, renderComponent(component))
