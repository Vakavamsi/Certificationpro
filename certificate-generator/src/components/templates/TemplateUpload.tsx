import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TemplateUpload = ({
  open,
  onClose,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Upload Template
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display:
              "flex",
            flexDirection:
              "column",
            gap: 2,
            mt: 2,
          }}
        >
          <TextField
            label="Template Name"
            fullWidth
          />

          <Button
            component="label"
            variant="outlined"
          >
            Select PNG/JPG

            <input
              hidden
              type="file"
              accept="image/*"
            />
          </Button>

          <Button
            variant="contained"
          >
            Upload
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateUpload;