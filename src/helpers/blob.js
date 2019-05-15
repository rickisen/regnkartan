export function urlToBlob(url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onerror = reject;
    xhr.ontimeout = reject
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response);
      }
    };
    xhr.open('GET', url);
    // Would love to use blob here, but it seams like jszip doen't like rn's blobs
    xhr.responseType = 'arraybuffer';
    xhr.send();
  })
}
