import Client from "../../api";
import type {
  CreatePastePayload,
  CreatePasteResponse,
  GetPasteResponse,
  HealthResponse,
} from "../../features/types/types";

export const checkConnection = async (): Promise<HealthResponse> => {
  const res = await Client.paste.check();
  return res.data as HealthResponse;
};

export const getPaste = async (id: string): Promise<GetPasteResponse> => {
  const res = await Client.paste.getById(id);
  return res.data as GetPasteResponse
};

export const createPaste = async (
  data: CreatePastePayload
): Promise<CreatePasteResponse> => {
  const res = await Client.paste.post(data);
  return res.data as CreatePasteResponse
};
