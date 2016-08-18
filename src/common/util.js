exports.filterError = (component, res) => {
  if (res.data.code != 0) {
    console.log('error:' + res.data.error);
    // var nav = component.$root.$children[0];
    // nav.show('error', res.data.error);
    return false;
  } else {
    return true;
  }
};
