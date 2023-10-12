const fs = require("fs");

function readfiles(path) {
  try {
    const file_Descriptor = fs.openSync("./data/task1/images.json", "r");
    const data = JSON.parse(fs.readFileSync(path).toString("utf-8"));
    fs.closeSync(file_Descriptor);
    return data;
  } catch (err) {
    console.error("error reading file");
    return;
  }
}

function manipulateCustomers(customers) {
  try {
    customers.forEach((customer) => {
      customer.phone_number = btoa(customer.phone_number);
    });
    return customers.map((customer) => {
      return {
        id: customer.id,
        name: customer.name,
        phone_number: customer.phone_number,
        country: customer.country,
        email: customer.email,
      };
    });
  } catch (err) {
    console.error(err);
  }
}

function sortReviews(reviews) {
  try {
    let revs = reviews.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    return revs;
  } catch (err) {
    console.error(err);
  }
}

function destructureImages(reviews, images) {
  reviews.forEach((review) => {
    let imagedata = review.images.map((image) =>
      images.find((img) => img.id === image)
    );
    review.images = imagedata;
  });
  return reviews;
}

function destructureCustomers(reviews, customers) {
  reviews.forEach((review) => {
    let customer = customers.find(
      (customer) => customer.id === review.customer_id
    );
    review.customer = customer;
  });
  return reviews;
}
function filterReviewFields(reviews) {
  let filteredFields = reviews.map((review) => {
    return {
      product_id: review.product_id,
      id: review.id,
      message: review.message,
      created_at: review.created_at,
      rating: review.rating,
      customer: review.customer,
      images: review.images,
    };
  });
  return filteredFields;
}
function mergeAllData(reviews, products) {
  let finalResult = [];
  let tempObj = {};
  products.forEach((product) => {
    let filteredReviews = reviews.filter(
      (review) => review.product_id === product.id
    );
    tempObj.id = product.id;
    tempObj.name = product.name;
    tempObj.reviews = filteredReviews;
    finalResult.push(tempObj);
    tempObj = {};
  });
  finalResult.forEach((result) => {
    result.reviews.forEach((review) => delete review.product_id);
  });
  return finalResult;
}
function searchProduct(results, product_id) {
  let output = results.find((result) => {
    return result.id === product_id;
  });
  return output;
}
function manipulate(id) {
  const products = readfiles("./data/task1/products.json").products;
  const customers = readfiles("./data/task1/customers.json").customers;
  const images = readfiles("./data/task1/images.json").images;
  const reviews = readfiles("./data/task1/reviews.json").reviews;
  if (typeof id === "number" && id > 0) {
    let ifPriductExists = products.find((product) => product.id === id);
    if (ifPriductExists) {
      let newCustomers = manipulateCustomers(customers);
      let sortedReviews = sortReviews(reviews);
      let newReviews = destructureImages(sortedReviews, images);
      let reviewsAndCustomers = destructureCustomers(newReviews, newCustomers);
      let filteredReviews = filterReviewFields(reviewsAndCustomers);
      let mergedResult = mergeAllData(filteredReviews, products);
      let output = searchProduct(mergedResult, id);

      return output;
    } else {
      console.log("product doesnot exists!");
    }
  } else {
    console.log("Invalid product");
  }
}

(() => {
  console.log(JSON.stringify(manipulate(1)));
})();
