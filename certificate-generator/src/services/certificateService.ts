import api from "./api";

export const generateCertificate = async (
  data: any
) => {
  const response = await api.post(
    "/certificates/generate",
    data
  );

  return response.data;
};