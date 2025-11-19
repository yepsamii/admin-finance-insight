import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { postsApi } from "../services/blogApi";
import PostDetail from "../components/PostDetail";

const PostPage = () => {
  const { slug } = useParams();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => postsApi.getPostBySlug(slug),
    enabled: !!slug,
    onError: (err) => {
      console.error("Error loading post:", err);
      toast.error(`Failed to load post: ${err.message || "Unknown error"}`);
    },
  });

  // Show toast when slug is missing
  useEffect(() => {
    if (!slug) {
      toast.error("Invalid post URL: No slug provided");
    }
  }, [slug]);

  // Show toast for network/API errors
  useEffect(() => {
    if (error) {
      const errorMessage = error.message || "Unknown error occurred";
      if (errorMessage.includes("Network") || errorMessage.includes("fetch")) {
        toast.error("Network error: Please check your internet connection");
      } else if (errorMessage.includes("404")) {
        toast.error("Post not found");
      } else {
        toast.error(`Error loading post: ${errorMessage}`);
      }
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Post
          </h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post?.title || "Post Not Found"} - My Personal Blog</title>
        <meta
          name="description"
          content={post?.description || "Post not found"}
        />
      </Helmet>

      <PostDetail post={post} />
    </>
  );
};

export default PostPage;
