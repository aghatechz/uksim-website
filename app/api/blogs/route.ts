import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const blogsFilePath = path.join(process.cwd(), "data", "blogs.json");

function readBlogs() {
  try {
    if (!fs.existsSync(blogsFilePath)) {
      return [];
    }
    const data = fs.readFileSync(blogsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading blogs.json:", error);
    return [];
  }
}

function writeBlogs(blogs: any[]) {
  try {
    const dir = path.dirname(blogsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing blogs.json:", error);
    return false;
  }
}

// GET all blogs
export async function GET() {
  const blogs = readBlogs();
  return NextResponse.json({ success: true, blogs });
}

// POST create new blog
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, excerpt, content, coverImage, category, author, readTime, keywords, featured } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and Content are required." },
        { status: 400 }
      );
    }

    const blogs = readBlogs();

    // Auto-generate slug from title if not provided
    const baseSlug = (body.slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (blogs.some((b: any) => b.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newBlog = {
      id: `post-${Date.now()}`,
      slug,
      title,
      excerpt: excerpt || title,
      content,
      coverImage: coverImage || "/reviews/WhatsApp Image 2026-08-01 at 10.00.17 AM.jpeg",
      category: category || "SIM Guide",
      author: author || "UK SIM Team",
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      readTime: readTime || "5 min read",
      featured: Boolean(featured),
      keywords: Array.isArray(keywords)
        ? keywords
        : (keywords || "").split(",").map((k: string) => k.trim()).filter(Boolean),
    };

    blogs.unshift(newBlog);
    const saved = writeBlogs(blogs);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to save blog to disk." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, blog: newBlog });
  } catch (error: any) {
    console.error("API /api/blogs POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
