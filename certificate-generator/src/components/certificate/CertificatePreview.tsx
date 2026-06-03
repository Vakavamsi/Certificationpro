import { useState, useEffect, useRef, Fragment } from "react";
import { Box, Typography } from "@mui/material";

interface Placeholder {
  id: string;
  label: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  alignment: 'left' | 'center' | 'right';
}

interface Template {
  id: number;
  name: string;
  image: string;
  placeholders: Placeholder[];
}

interface Props {
  template?: Template;
  formData?: Record<string, string>;
}

const CertificatePreview = ({
  template,
  formData = {},
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState<number>(1);

  const activePlaceholders = [
    {
      id: 'default-recipient',
      label: 'Recipient Name',
      x: 50,
      y: 41,
      fontSize: 56,
      color: '#8b4513',
      fontFamily: 'Georgia, "Times New Roman", serif',
      alignment: 'center' as const,
    },
    {
      id: 'default-start-date',
      label: 'Start Date',
      x: 50,
      y: 62,
      fontSize: 18,
      color: '#8b4513',
      fontFamily: 'Georgia, "Times New Roman", serif',
      alignment: 'center' as const,
    },
    {
      id: 'default-end-date',
      label: 'End Date',
      x: 50,
      y: 71,
      fontSize: 18,
      color: '#8b4513',
      fontFamily: 'Georgia, "Times New Roman", serif',
      alignment: 'center' as const,
    }
  ];

  const calculateScale = () => {
    const img = imageRef.current;
    if (img && img.naturalWidth) {
      const scaleFactor = img.clientWidth / img.naturalWidth;
      setScale(scaleFactor);
    }
  };

  useEffect(() => {
    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => {
      window.removeEventListener("resize", calculateScale);
    };
  }, [template]);

  if (!template) {
    return (
      <Box
        sx={{
          height: 550,
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "none",
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
            color: "#6b7280",
            fontWeight: 500,
          }}
        >
          Fill in the details on the left,
        </Typography>
        <Typography
          sx={{
            fontSize: 20,
            color: "#6b7280",
            fontWeight: 500,
          }}
        >
          then preview the certificate here.
        </Typography>
      </Box>
    );
  }

  const imageUrl = template.image.startsWith('/') 
    ? `${import.meta.env.VITE_BACKEND_URL}${template.image}`
    : template.image;

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "20px",
        p: 2,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div 
        ref={containerRef} 
        style={{ 
          position: "relative", 
          width: "100%", 
          borderRadius: "12px", 
          overflow: "hidden",
          border: "1px solid #f3f4f6"
        }}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt={template.name}
          onLoad={calculateScale}
          style={{
            width: "100%",
            display: "block",
          }}
        />

        {activePlaceholders.map((p) => {
          const value = formData[p.label] || p.label;
          return (
            <Fragment key={p.id}>
              <div
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  fontSize: `${p.fontSize * scale}px`,
                  color: p.color,
                  fontFamily: p.fontFamily,
                  textAlign: p.alignment,
                  transform: p.alignment === "center" 
                    ? "translate(-50%, -50%)" 
                    : p.alignment === "right" 
                    ? "translate(-100%, -50%)" 
                    : "translate(0%, -50%)",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                  pointerEvents: "none",
                  textShadow: "0px 1px 2px rgba(255,255,255,0.3)",
                  zIndex: 2
                }}
              >
                {value}
              </div>
            </Fragment>
          );
        })}
      </div>
    </Box>
  );
};

export default CertificatePreview;