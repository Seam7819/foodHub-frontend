import { NextResponse } from "next/server";
import { users } from "@/src/lib/mockData";

let posts = [
  {
    id: "1",
    title: "Welcome to Cartora",
    excerpt: "Learn how Cartora helps providers connect with customers and grow their services.",
    content: "Cartora is a modern marketplace platform that helps providers share products, stories, and updates with customers.",
    author: "Cartora Team",
    authorId: "user-1",
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const post = posts.find((post) => post.id === id);
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }
    return NextResponse.json({ data: post });
  }

  return NextResponse.json({ data: posts });
}

const getUserIdFromRequest = (request: Request) => {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  return token ? token.replace(/^mock-token-/, "") : null;
};

export async function POST(request: Request) {
  const body = await request.json();
  const { title, excerpt, content } = body;

  if (!title || !excerpt || !content) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const userId = getUserIdFromRequest(request);
  const user = userId ? users.find((entry) => entry.id === userId) : null;

  const post = {
    id: crypto.randomUUID(),
    title,
    excerpt,
    content,
    author: user ? user.name : "FoodHub Admin",
    authorId: user ? user.id : "admin-1",
    createdAt: new Date().toISOString(),
  };

  posts.unshift(post);
  return NextResponse.json({ data: post });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, title, excerpt, content } = body;

  if (!id || !title || !excerpt || !content) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const userId = getUserIdFromRequest(request);
  if (!userId || posts[index].authorId !== userId) {
    return NextResponse.json({ error: "You cannot update this blog post." }, { status: 403 });
  }

  posts[index] = { ...posts[index], title, excerpt, content };
  return NextResponse.json({ data: posts[index] });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Blog ID is required." }, { status: 400 });
  }

  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Missing authorization token." }, { status: 401 });
  }

  if (posts[index].authorId !== userId) {
    return NextResponse.json({ error: "You cannot delete this blog post." }, { status: 403 });
  }

  posts = posts.filter((post) => post.id !== id);
  return NextResponse.json({ success: true });
}
