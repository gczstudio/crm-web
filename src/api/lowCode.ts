import request from "@/utils/request";
import { backend } from "@/config";

export const addLayout = (data: any) =>
  request({
    url: backend.mockService + "/layout/addLayout",
    method: "post",
    data,
  });
