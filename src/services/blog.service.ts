import axiosInstance from "@/src/lib/axiosInstance";

const BLOG_API_BASE_URL = "/api/";

export const getBlogs = async () => {
  const res = await axiosInstance.get("/blog", { baseURL: BLOG_API_BASE_URL });
  return res.data;
};

export const getBlogById = async (id: string) => {
  const res = await axiosInstance.get(`/blog`, { baseURL: BLOG_API_BASE_URL, params: { id } });
  return res.data;
};

export const createBlog = async (payload: { title: string; excerpt: string; content: string }) => {
  const res = await axiosInstance.post("/blog", payload, { baseURL: BLOG_API_BASE_URL });
  return res.data;
};

export const updateBlog = async (id: string, payload: { title: string; excerpt: string; content: string }) => {
  const res = await axiosInstance.put("/blog", { id, ...payload }, { baseURL: BLOG_API_BASE_URL });
  return res.data;
};

export const deleteBlog = async (id: string) => {
  const res = await axiosInstance.delete(`/blog`, { baseURL: BLOG_API_BASE_URL, params: { id } });
  return res.data;
};
