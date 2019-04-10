const getElementField = function(selector, field) {
  try {
    return this.querySelector(selector)[field];
  } catch (e) {
    throw new Error(
      `Can not get ${field} from selector *${selector}*. Web site might have change`
    );
  }
};

const getElementText = function(selector) {
  return this.getElementField(selector, 'innerText');
};

window.lvUtils = {
  formatDate: date => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US');
  },

  LCFM: (name = '', throwError = false) => {
    //LAST, FIRST MIDDLE

    name = name.trim().split(',');

    if (name.length !== 2) {
      if (throwError)
        throw new Error('NAME Format *LAST, FIRST MIDDLE* might have changed');
      else return;
    }

    let nameObj = {};

    nameObj.last = name.shift();

    if (name.length === 1) {
      let firstAndLast = name[0].trim().split(' ');
      nameObj.first = firstAndLast.shift();
      nameObj.middle = firstAndLast.join(' ');
    }

    return nameObj;
  },

  getName: (fullName = '') => {
    fullName = fullName.split(' ');

    let name = {
      first: null,
      middle: null,
      last: null
    };

    name.first = fullName.shift();

    if (fullName.length === 1) {
      name.last = fullName.shift();
    } else if (fullName.length > 1) {
      name.middle = fullName.shift();
      name.last = fullName.join(' ');
    }

    return name;
  },

  FML: (fullName = '', throwError = false) => {
    fullName = fullName.trim().split(' ');
    if (fullName.length === 1) {
      if (throwError)
        throw new Error('NAME Format *FIRST MIDDLE LAST* might have changed');
      else return;
    }

    let name = {};

    name.first = fullName.shift();

    if (fullName.length === 1) {
      name.last = fullName.shift();
    } else if (fullName.length > 1) {
      name.middle = fullName.shift();
      name.last = fullName.join(' ');
    }

    return name;
  },

  LFM: (fullName = '', throwError = false) => {
    //LAST FIRST MIDDLE

    fullName = fullName.trim().split(' ');

    if (fullName.length === 1) {
      if (throwError)
        throw new Error('NAME Format *FIRST MIDDLE LAST* might have changed');
      else return;
    }

    let name = {};

    name.last = fullName.shift();

    if (fullName.length === 1) {
      name.first = fullName.shift();
    } else if (fullName.length > 1) {
      name.first = fullName.shift();
      name.middle = fullName.join(' ');
    }

    return name;
  },

  DATE_FORMAT: /\d{0,2}\/\d{0,2}\/\d{4}/,

  validateFormat: (condition, field) => {
    if (condition)
      throw new Error(`Web site might have change its ${field} format`);
  },

  validateNoFormat: function(condition, field) {
    this.validateFormat(!condition, field);
  },

  replaceSpecialCharacter: (selector, character, replacement) => {
    document.querySelectorAll(selector).forEach(element => {
      element.innerHTML = element.innerHTML.replace(
        new RegExp(character, 'g'),
        replacement
      );
    });
  }
};

Element.prototype.getElementField = getElementField;
Document.prototype.getElementField = getElementField;
Element.prototype.getElementText = getElementText;
Document.prototype.getElementText = getElementText;
