import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";

import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";

const Header = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "84px",
          px: 4,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "16px",
            backgroundColor: "#e68600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
          }}
        >
          <MilitaryTechIcon
            sx={{
              color: "#fff",
              fontSize: 32,
            }}
          />
        </Box>

        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Certificate Studio
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
            }}
          >
            Upload templates, fill details, generate certificates
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;