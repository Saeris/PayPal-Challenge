import { withStyles } from "material-ui/styles"
import { CircularProgress } from "material-ui/Progress"
import indigo from 'material-ui/colors/indigo'

const styles = theme => ({
  progress: {
    margin: `${theme.spacing.unit * 2}px`
  }
})

const Loading = ({ classes }) => (
  <CircularProgress className={classes.progress} size={50} style={{ color: indigo[500] }} />
)

export default withStyles(styles)(Loading)
