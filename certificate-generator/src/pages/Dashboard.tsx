import { useState } from "react";

import {
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import Header from "../components/common/Header";
import TemplateGallery from "../components/templates/TemplateGallery";
import TemplateUpload from "../components/templates/TemplateUpload";

const Dashboard = () => {
  const [uploadOpen, setUploadOpen] =
    useState(false);

  return (
    <>
      <Header />

      <Box
        sx={{
          width: "100%",
          padding: "32px",
          backgroundColor: "#fafafa",
          minHeight: "100vh",
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: "#111827",
          }}
        >
          Template Gallery
        </Typography>

        <Typography
          sx={{
            color: "#6b7280",
            mb: 4,
            fontSize: "18px",
          }}
        >
          Choose a template to fill in details and generate a certificate.
        </Typography>

        {/* Search + Upload */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            placeholder="Search templates..."
            sx={{
              "& .MuiOutlinedInput-root":
                {
                  borderRadius:
                    "16px",
                  backgroundColor:
                    "#fff",
                  height: "58px",
                },
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              setUploadOpen(true)
            }
            sx={{
              minWidth: "240px",
              borderRadius:
                "16px",
              backgroundColor:
                "#e68600",
              textTransform:
                "none",
              fontSize: "18px",
              fontWeight: 600,

              "&:hover": {
                backgroundColor:
                  "#cc7700",
              },
            }}
          >
            Upload Template
          </Button>
        </Box>

        {/* Cards */}
        <TemplateGallery />

        <TemplateUpload
          open={uploadOpen}
          onClose={() =>
            setUploadOpen(false)
          }
        />
      </Box>
    </>
  );
};

export default Dashboard;