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
