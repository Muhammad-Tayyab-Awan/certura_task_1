/* eslint-disable no-unused-vars */
const api_url = import.meta.env.VITE_API_URL;

async function get_all_blogs() {
  try {
    let response = await fetch(`${api_url}/api/blog/all`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.clear();
    response = await response.json();
    return response;
  } catch (err) {
    return {
      resStatus: false,
      error: "Server not responding",
      message: "Server not responding please try later",
    };
  }
}

async function get_blog_by_id(blogId) {
  try {
    let response = await fetch(`${api_url}/api/blog/${blogId}`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.clear();
    response = await response.json();
    return response;
  } catch (err) {
    return {
      resStatus: false,
      error: "Server not responding",
      message: "Server not responding please try later",
    };
  }
}

const blogAPI = { get_all_blogs, get_blog_by_id };

export default blogAPI;
