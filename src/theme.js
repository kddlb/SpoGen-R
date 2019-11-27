import { createMuiTheme } from '@material-ui/core/styles';
import { deepPurple, orange } from '@material-ui/core/colors';

const RuxTheme = createMuiTheme({
  palette: {
    primary: deepPurple,
    secondary: {
      main: orange.A400,
    },
  },
})

export default RuxTheme;