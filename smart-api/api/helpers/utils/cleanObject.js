/**
 * Remove elementos nulos contidos dentro do objeto
 * @param {Object} obj
 */
function removeEmpty(obj) {
  Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
  return obj;
}

module.exports = removeEmpty;
