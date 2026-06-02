import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";

interface Props {
  template: any;
  onSelect?: (
    template: any
  ) => void;
}

const TemplateCard = ({
  template,
  onSelect,
}: Props) => {
  return (
    <Card
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        border:
          "1px solid #e5e7eb",
        boxShadow: "none",
        backgroundColor:
          "#fff",

        "&:hover": {
          boxShadow:
            "0px 10px 25px rgba(0,0,0,0.08)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="420"
        image={
          template.image
        }
        alt={
          template.name
        }
      />

      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
          }}
        >
          {template.name}
        </Typography>

        <Typography
          sx={{
            color:
              "#6b7280",
            mb: 2,
          }}
        >
          {
            template.placeholders
          }{" "}
          placeholders
        </Typography>

        {onSelect && (
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor:
                "#e68600",

              "&:hover": {
                backgroundColor:
                  "#cc7700",
              },
            }}
            onClick={() =>
              onSelect(
                template
              )
            }
          >
            Select Template
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateCard;