/* eslint-disable no-unused-vars */
const api_url = import.meta.env.VITE_API_URL;

async function login(credentials) {
  try {
    const JsonCredentials = JSON.stringify({ ...credentials });
    let response = await fetch(`${api_url}/api/auth/login`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JsonCredentials,
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

const authAPI = { login };

export default authAPI;
