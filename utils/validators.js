const slug = require(`slug`),
 { customAlphabet } =  require('nanoid');

const toExport = {

    defaultSort: {
        createdAt: -1,
        status: 1
    },

    defaultStringConfig: {
        type: String,
        default: ``,
        trim: true
    },

    defaultBooleanConfig: {
        type: Boolean,
        default: false
    },

    fieldsToExclude: {
        createdAt: false,
        updatedAt: false,
        __v: false
    },

    getSlug(providedString = ``, charCount = 6) {
        return slug(String(providedString)) + `-` + customAlphabet("ASDFGHJKL", charCount)();
        /**
         * At rate of 500 IDs/hour; ~1 hour needed, in order to have a 1% probability of at least one collision.
         * Checked at: https://zelark.github.io/nano-id-cc/
         */
    },
  

};


module.exports = toExport;