import {
  Grid,
} from "@mui/material";

import TemplateCard from "./TemplateCard";

interface Props {
  onSelectTemplate?: (
    template: any
  ) => void;

  selectedOnly?: boolean;

  selectedTemplate?: any;
}

const templates = [
  {
    id: 1,
    name:
      "DScribe Certificate of Achievement",
    image:
      "/certificate-template.png",
    placeholders: 3,
  },
  {
    id: 2,
    name:
      "Internship Certificate",
    image:
      "/certificate-template.png",
    placeholders: 3,
  },
  {
    id: 3,
    name:
      "Employee Certificate",
    image:
      "/certificate-template.png",
    placeholders: 3,
  },
];

const TemplateGallery = ({
  onSelectTemplate,
  selectedOnly,
  selectedTemplate,
}: Props) => {
  const displayTemplates =
    selectedOnly
      ? [selectedTemplate]
      : templates;

  return (
    <Grid
      container
      spacing={3}
    >
      {displayTemplates.map(
        (template) => (
          <Grid
            key={template.id}
            size={{
              xs: 12,
              sm: selectedOnly
                ? 12
                : 6,
              md: selectedOnly
                ? 12
                : 4,
            }}
          >
            <TemplateCard
              template={
                template
              }
              onSelect={
                onSelectTemplate
              }
            />
          </Grid>
        )
      )}
    </Grid>
  );
};

export default TemplateGallery;