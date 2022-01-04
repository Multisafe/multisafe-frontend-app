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
  const networkId = localStorage.getItem("NETWORK_ID");

  const authHeader = token
    ? { Authorization: `Bearer ${token}` }
    : { "x-api-key": process.env.REACT_APP_COINSHIFT_API_KEY };

  const requestUrl = new URL(url);
  requestUrl.searchParams.set("networkId", networkId);

  const finalOptions = {
    ...options,
    headers: {
      "content-type": "application/json",
      ...authHeader,
      ...options.headers,
    },
  };
  return fetch(requestUrl.toString(), finalOptions).then(checkStatus).then(parseJSON);
}
