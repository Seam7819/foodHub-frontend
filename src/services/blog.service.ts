import axiosInstance from "@/src/lib/axiosInstance";

export const getBlogs = async () => {
  const res = await axiosInstance.get("/blog");
  return res.data;
};

export const getBlogById = async (id: string) => {
  const res = await axiosInstance.get(`/blog?id=${encodeURIComponent(id)}`);
  return res.data;
};

export const createBlog = async (payload: { title: string; excerpt: string; content: string }) => {
  const res = await axiosInstance.post("/blog", payload);
  return res.data;
};

export const updateBlog = async (id: string, payload: { title: string; excerpt: string; content: string }) => {
  const res = await axiosInstance.put("/blog", { id, ...payload });
  return res.data;
};

export const deleteBlog = async (id: string) => {
  const res = await axiosInstance.delete(`/blog?id=${encodeURIComponent(id)}`);
  return res.data;
};
