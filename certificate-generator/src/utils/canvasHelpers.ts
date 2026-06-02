export const drawCertificate = (
  canvas: HTMLCanvasElement,
  imageUrl: string,
  data: any
) => {
  const ctx =
    canvas.getContext("2d");

  if (!ctx) return;

  const image = new Image();

  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);

    ctx.font = "bold 36px serif";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";

    ctx.fillText(
      data.recipientName || "",
      image.width / 2,
      250
    );

    ctx.font = "22px serif";

    ctx.fillText(
      data.fromDate || "",
      250,
      500
    );

    ctx.fillText(
      data.toDate || "",
      600,
      500
    );
  };

  image.src = imageUrl;
};