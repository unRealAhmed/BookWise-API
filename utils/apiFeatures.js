module.exports = class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = JSON.parse(JSON.stringify(queryString));
    this.excludedFields = ['page', 'sort', 'limit', 'fields', 'search']; // Include 'search' in excludedFields
  }

  // Filter the query based on query parameters
  filter() {
    const queryObj = { ...this.queryString };
    // Additional filters for brand, category, color, size, and price range
    const additionalFilters = ['name', 'category', 'gender', 'author', 'title'];

    additionalFilters.forEach(filterKey => {
      if (queryObj[filterKey]) {
        queryObj[filterKey] = { $regex: queryObj[filterKey], $options: 'i' };
      }
    });

    const filteredQuery = Object.keys(queryObj)
      .filter(key => !this.excludedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = queryObj[key];
        return obj;
      }, {});

    let queryStr = JSON.stringify(filteredQuery);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // Sort the query based on the sort parameter
  sort() {
    if (this.queryString.sort) {
      const { sort } = this.queryString;
      let sortFields;

      // Add custom sorting options
      switch (sort) {
        case 'latest':
          sortFields = '-createdAt';
          break;
        case 'oldest':
          sortFields = 'createdAt';
          break;
        case 'a-z':
          sortFields = 'title';
          break;
        case 'z-a':
          sortFields = '-title';
          break;
        default:
          // Default sorting by createdAt
          sortFields = 'createdAt';
      }

      this.query.sort(sortFields);
    } else {
      // Default sorting by createdAt if no sort parameter is provided
      this.query.sort('createdAt');
    }

    return this;
  }

  // Paginate the results based on the page and limit parameters
  paginate() {
    if (this.queryString.page) {
      const page = parseInt(this.queryString.page, 10) || 1;
      const limit = parseInt(this.queryString.limit, 10) || 100;
      const skip = (page - 1) * limit;
      this.query.skip(skip).limit(limit);
    }
    return this;
  }

  // Select specific fields to include in the query results
  selectFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('title author description category');
    }
    return this;
  }
};