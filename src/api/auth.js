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

async function login_status() {
  try {
    let response = await fetch(`${api_url}/api/auth/login-status`, {
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

const authAPI = { login, login_status };

export default authAPI;
