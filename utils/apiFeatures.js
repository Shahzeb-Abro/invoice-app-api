export default class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query
    this.queryString = queryString; // req.query
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced operators (gte, gt, lte, lt, in)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|in)\b/g,
      (match) => `$${match}`
    );
    const parsed = JSON.parse(queryStr);

    // Convert comma-separated values for $in into arrays
    Object.keys(parsed).forEach((field) => {
      if (parsed[field]?.$in) {
        parsed[field].$in = parsed[field].$in.split(",");
      }
    });

    this.query = this.query.find(parsed);
    return this;
  }

  search() {
    if (this.queryString.search) {
      const regex = new RegExp(this.queryString.search, "i"); // case-insensitive

      // Dynamically detect string fields from schema
      const stringFields = Object.entries(this.query.model.schema.paths)
        .filter(([_, path]) => path.instance === "String")
        .map(([field]) => field);

      if (stringFields.length > 0) {
        const orCondition = {
          $or: stringFields.map((field) => ({ [field]: regex })),
        };

        // ✅ Merge search with existing query conditions
        this.query = this.query.find({
          ...this.query.getQuery(),
          ...orCondition,
        });
      }
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // ?sort=field1,-field2
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // default sort
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // ?fields=name,email
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
