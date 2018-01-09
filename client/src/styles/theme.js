import { createMuiTheme } from "material-ui/styles"
import { indigo } from 'material-ui/colors'
import "./fonts"
import "./global.scss"

// Here we can define global theme settings for Mui components
export const theme = createMuiTheme({
  pallete : {
    primary: indigo
  },
  typography: {
    htmlFontSize: 16
  }
})
