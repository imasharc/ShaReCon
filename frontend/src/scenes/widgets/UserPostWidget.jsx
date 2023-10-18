import { green, lightBlue } from "@mui/material/colors";
import WidgetWrapper from "../../components/WidgetWrapper"; // Adjust the import path accordingly

  import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
  } from "@mui/material";

const UserPostWidget = () => {
    return (
        <WidgetWrapper><InputBase
        placeholder="What's on your mind..."
        sx={{
            width: "100%",
            backgroundColor: lightBlue,
            borderRadius: "2rem",
            borderColor: green,
            padding: "1rem 2rem",
        }}/></WidgetWrapper>
        
    );
}

export default UserPostWidget;