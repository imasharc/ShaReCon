import { Box } from "@mui/material";
import { brown, grey } from "@mui/material/colors";
import { styled } from "@mui/system";

const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1.5rem 1.5rem 0.75rem 1.5rem",
  backgroundColor: grey,
  color: "darkgrey",
  borderColor: brown,
  borderRadius: "0.75rem",
}));

export default WidgetWrapper;