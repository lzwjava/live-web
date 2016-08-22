exports.filterError = (component, res) => {
  if (res.data.status != "success") {
    console.log('error:' + res.data.error)
    component.$dispatch('show-msg', 'error', res.data.error)
    return false;
  } else {
    return true;
  }
};

exports.escape = (html) => {
  html = html || '';
  return html
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
};

exports.httpErrorFn = (component) => {
  return function (res) {
    component.$dispatch('show-msg', 'error', res.statusText)
  }
};

exports.show = (component, type, text, duration) => {
  component.$dispatch('show-msg', type, text)
};
