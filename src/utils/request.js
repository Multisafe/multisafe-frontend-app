function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export default function request(url, options) {
  const token = localStorage.getItem("token");
  const authHeader = token
    ? { Authorization: `Bearer ${token}` }
    : { "x-api-key": "multisafe_apikey_b13ee9c2-4567-40d2-9ace-5cdce98c9e41" };

  const finalOptions = {
    ...options,
    headers: {
      "content-type": "application/json",
      ...authHeader,
      ...options.headers,
    },
  };
  return fetch(url, finalOptions).then(checkStatus).then(parseJSON);
}
