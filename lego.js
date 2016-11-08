'use strict';

// Метод, который будет выполнять операции над коллекцией один за другим
module.exports.query = function (collection, ...queries) {
  return queries.reduce((lastResult, querie) => {
    return querie(lastResult);
  }, collection);
};

// Оператор reverse, который переворачивает коллекцию
module.exports.reverse = function () {
    return function (collection) {
        var changedCollection = collection.reverse();

        // Возращаем изменённую коллекцию
        return changedCollection;
    };
};

// Оператор limit, который выбирает первые N записей
module.exports.limit = function (n) {
    return (collection) => {
      let limitedCollection = [...collection];
      limitedCollection.length = n;
      return limitedCollection
    }
};

// Вам необходимо реализовать остальные операторы:
// select, filterIn, filterEqual, sortBy, format, limit
module.exports.select = (...fields) => {
  return (collection) => {
    return collection.map(contact => {
      let contactWithSelectedFields = {};
      for (let field in contact) {
        if ( fields.includes(field) ) contactWithSelectedFields[field] = contact[field];
      }
      return contactWithSelectedFields;
    });
  };
}

module.exports.filterIn = (field, values) => {
  return (collection) => {
    return collection.filter(contact => {
      return values.includes(contact[field]);
    });
  }
}

module.exports.sortBy = (field, sortType) => {
  return (collection) => {
    if (field !== 'age') return 'this method supports only filtering by age';
    return collection.sort((prevContact, nextContact) => {
      return sortType === 'asc' ?
        prevContact[field] - nextContact[field] :
        nextContact[field] - prevContact[field]
    })
  }
}

module.exports.format = (field, formatRule) => {
  return (collection) => {
    return collection.map(contact => {
      contact[field] = formatRule(contact[field]);
      return contact;
    })
  }
}

// Будет круто, если реализуете операторы:
// or и and

module.exports.and = (...filterQueries) => {
  return (collection) => {
    return filterQueries.reduce((lastResult, query) => {
      return query(lastResult);
    }, collection);
  }
}

module.exports.or = (...filterVersions) => {
  return (collection) => {
    let results = [];
    filterVersions.forEach(filterVersion => {
      results.push(filterVersion(collection));
    });
    return results;
  }
}
