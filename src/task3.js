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

function validate_Object(obj) {
  if (typeof obj === "object") {
    let keys = Object.keys(obj);
    if (keys) {
      if (keys.length === 2) {
        if (keys[0] === "item_id" && keys[1] === "expiry_date") {
          let date = new Date(obj[keys[1]]).toISOString();
          if (typeof obj[keys[0]] === "number" && typeof date === "string") {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}
function validate_product_id(product_id) {
  if (product_id > 0 && typeof product_id === "number") {
    return true;
  } else {
    return false;
  }
}

function checkIfProductExists(product_Id, products) {
  let product = products.find((product) => product.id === product_Id);
  if (product) {
    return product;
  }
  return null;
}
function checkItemIdExists(product, item_id) {
  let itemCheck = product.items.find((item) => item.item_id === item_id);
  return itemCheck;
}
function sortData(data) {
  data.items.sort((a, b) => a.item_id - b.item_id);
}
function manipulate(product_id, item) {
  let validation = validate_Object(item);
  if (validation === true) {
    let idCheck = validate_product_id(product_id);
    if (idCheck === true) {
      const products = readfiles("./data/task3/products.json").products;
      let productCheck = checkIfProductExists(product_id, products);
      if (productCheck) {
        let itemCheck = checkItemIdExists(productCheck, item.item_id);
        if (!itemCheck) {
          let todaysDate = new Date();
          let expiry_date = new Date(item.expiry_date);
          if (todaysDate > expiry_date) {
            console.log("Expiry date should be in future");
            return;
          } else {
            productCheck.items_left = productCheck.items_left + 1;
            item.expiry_date = expiry_date.toISOString();
            productCheck.items.push(item);
            sortData(productCheck);
            return productCheck;
          }
        } else {
          console.log("Items already exists!");
          return;
        }
      } else {
        console.log("hello world");
        //product constant error
      }
    } else {
      console.log("invalid product_id");
      //product constant error;
      return;
    }
  } else {
    console.error("not valid object");
    //item object constant error;
  }
}

(() => {
  let data = manipulate(1, {
    item_id: 111,
    expiry_date: "12-3-2024",
  });
  console.log(data);
})();
