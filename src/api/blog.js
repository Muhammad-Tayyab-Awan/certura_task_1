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

async function get_my_blogs() {
  try {
    let response = await fetch(`${api_url}/api/blog/`, {
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

async function create_blog(blogData) {
  try {
    let response = await fetch(`${api_url}/api/blog/create`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
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

async function delete_all() {
  try {
    let response = await fetch(`${api_url}/api/blog`, {
      credentials: "include",
      method: "DELETE",
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

const blogAPI = {
  get_all_blogs,
  get_blog_by_id,
  get_my_blogs,
  create_blog,
  delete_all,
};

export default blogAPI;
