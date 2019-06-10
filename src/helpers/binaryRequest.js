/** @function req - Makes a new XMLHttpRequest with supplied responseType
 * @param {string} url - url of the request
 * @param {string} responseType - the type of responceData you need, "text", "blob" etc [responseType="text"]
 * @return {Promise} Promise - that resolves on successful response
 * */
export function req(url, responseType = "text") {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onerror = reject;
    xhr.ontimeout = reject;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status > 199 && xhr.status < 300) {
        resolve(xhr.response);
      } else if (xhr.readyState === 4) {
        reject(xhr.status);
      }
    };
    xhr.open("GET", url);
    xhr.responseType = responseType;
    xhr.send();
  });
}
