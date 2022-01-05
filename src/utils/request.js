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

export const defaultRequest = (url, options) => {
  const token = localStorage.getItem("token");

  const authHeader = token
    ? { Authorization: `Bearer ${token}` }
    : { "x-api-key": process.env.REACT_APP_COINSHIFT_API_KEY };

  const finalOptions = {
    ...options,
    headers: {
      "content-type": "application/json",
      ...authHeader,
      ...options.headers,
    },
  };
  return fetch(url, finalOptions).then(checkStatus).then(parseJSON);
};

export const request = (url, options) => {
  const networkId = localStorage.getItem("NETWORK_ID");

  const requestUrl = new URL(url);
  requestUrl.searchParams.set("networkId", networkId);

  return defaultRequest(requestUrl.toString(), options);
}
