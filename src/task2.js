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

function manipulate(item_id, expiry_date) {
  if (item_id > 0 && typeof item_id === "number") {
    let productsData = readfiles(
      "./data/task2/update_item_products.json"
    ).products;
    var flag = false;

    var searchedItem = {};
    var searchedProduct = {};
    productsData.forEach((product) => {
      let result = product.items.find((item) => item.item_id === item_id);
      if (result) {
        searchedItem = result;
        searchedProduct = product;
        flag = true;
        return;
      }
    });
    if (flag == false) {
      console.log("item not found");
      //error from above
      return;
    } else {
      let newDate = new Date(expiry_date);
      searchedItem.expiry_date = newDate.toISOString();
      let tempArray = [];
      tempArray.push(searchedItem);
      searchedProduct.items = tempArray;
      return searchedProduct;
    }
  } else {
    console.log("invalid item_id");
    //error from above
    return;
  }
}

(() => {
  let date = new Date("3-2-2022");
  console.log(manipulate(142, date));
  // console.log("OLDdATE", date);
})();
