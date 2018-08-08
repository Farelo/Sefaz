/**
 * Remove elementos nulos contidos dentro do objeto
 * @param {Object} obj
 */
const removeEmpty = obj => Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);

module.exports = removeEmpty;
