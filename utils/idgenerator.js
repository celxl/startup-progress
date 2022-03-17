const nanoid = require('nanoid') ;

exports.genId = (prefix = "", size = 5) => {
    return `${prefix}-${nanoid.nanoid(size)}`;
}