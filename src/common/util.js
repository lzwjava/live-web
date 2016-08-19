exports.filterError = (component, res) => {
  if (res.data.status != "success") {
    console.log('error:' + res.data.error)
    // var nav = component.$root.$children[0];
    // nav.show('error', res.data.error);
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
    //component.$root.$children[0].show('error', res.statusText);
    console.log(res.statusText)
  }
};
