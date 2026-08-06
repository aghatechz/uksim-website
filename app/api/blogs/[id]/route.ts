import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const blogsFilePath = path.join(process.cwd(), "data", "blogs.json");

function readBlogs() {
  try {
    if (!fs.existsSync(blogsFilePath)) return [];
    const data = fs.readFileSync(blogsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeBlogs(blogs: any[]) {
  try {
    fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2), "utf8");
    return true;
  } catch (error) {
    return false;
  }
}

// DELETE a blog post by ID or Slug
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let blogs = readBlogs();

    const initialLen = blogs.length;
    blogs = blogs.filter((b: any) => b.id !== id && b.slug !== id);

    if (blogs.length === initialLen) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    writeBlogs(blogs);
    return NextResponse.json({ success: true, message: "Blog post deleted successfully." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
