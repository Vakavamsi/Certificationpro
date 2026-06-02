import {
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";

const PlaceholderForm = () => {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
        }}
      >
        Certificate Details
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Recipient Name"
          fullWidth
        />

        <TextField
          label="From Date"
          type="date"
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          label="To Date"
          type="date"
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <Button
          variant="contained"
          fullWidth
        >
          Preview
        </Button>

        <Button
          variant="outlined"
          fullWidth
        >
          Download PNG
        </Button>

        <Button
          variant="contained"
          color="success"
          fullWidth
        >
          Share WhatsApp
        </Button>
      </Stack>
    </Paper>
  );
};

export default PlaceholderForm;