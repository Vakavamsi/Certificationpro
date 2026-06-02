import api from "./api";

export const getTemplates = async () => {
  const response = await api.get("/templates");
  return response.data;
};

export const uploadTemplate = async (
  formData: FormData
) => {
  const response = await api.post(
    "/templates/upload",
    formData
  );

  return response.data;
};

export const deleteTemplate = async (id: number) => {
  const response = await api.delete(`/templates/${id}`);
  return response.data;
};