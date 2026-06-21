import { NextResponse } from "next/server";

let posts = [
  {
    id: "1",
    title: "Welcome to OrgNest",
    excerpt: "Learn how OrgNest helps organizations manage teams, services, and projects.",
    content: "OrgNest is an intelligent organization management platform that keeps teams, leaders, and stakeholders aligned.",
    author: "OrgNest Team",
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({ data: posts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, excerpt, content } = body;

  if (!title || !excerpt || !content) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const post = {
    id: crypto.randomUUID(),
    title,
    excerpt,
    content,
    author: "FoodHub Admin",
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

  posts[index] = { ...posts[index], title, excerpt, content };
  return NextResponse.json({ data: posts[index] });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Blog ID is required." }, { status: 400 });
  }

  posts = posts.filter((post) => post.id !== id);
  return NextResponse.json({ success: true });
}
