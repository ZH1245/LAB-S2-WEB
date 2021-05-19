$(() => {
  $("#CreateProduct").click(createProduct);
  $("#CanselCreate").click(CanselCreate);
  $("#getONE").click(getoneProduct);
  loadProducts();
});

loadProducts = () => {
  var items = $(".items");
  items.empty();
  $.ajax({
    url: "https://usman-recipes.herokuapp.com/api/products",
    method: "GET",
    success: (response) => {
      for (i = 0; i < response.length; i++) {
        let products = document.createElement("div");
        let btn_DEL = document.createElement("button");
        let btn_edit = document.createElement("button");
        let para = document.createElement("p");
        para.innerHTML = `<p>Price: $${response[i].price}</br>Department: <em>${response[i].department}</em></br>Description: ${response[i].description}</p>`;

        btn_DEL.className = "btn btn-danger";
        btn_DEL.id = "btn_DEL";
        btn_DEL.innerHTML = "Delete";
        btn_DEL.onclick = () => deleteProduct($(products).attr("id"));
        btn_edit.className = "btn btn-warning";
        btn_edit.id = "btn_edit";
        btn_edit.innerHTML = "Edit";
        btn_edit.onclick = () => editProduct;

        products.id = response[i]._id;
        products.className = "products";

        products.innerHTML = `<h3>${response[i].name}</h3>`;
        products.append(btn_DEL);
        products.appendChild(btn_edit);
        products.append(para);
        items.append(products);
      }
    },
    error: (error) => {
      alert(error.message);
    },
  });
};
editProduct = () => {
  var btn = $(this);
  var parentDiv = btn.closest(".product");
  let id = parentDiv.attr("data-id");
  $.get(
    "https://usman-recipes.herokuapp.com/api/products/" + id,
    function (response) {
      $("#updateID").val(response._id);
      $("#updateName").val(response.name);
      $("#updatePrice").val(response.price);
      $("#updateColor").val(response.color);
      $("#updateDepartment").val(response.department);
      $("#updateDescription").val(response.description);
      $("#updateProduct").modal("show");
    }
  );
};
createProduct = () => {
  console.log("INSIDE Create");
  const name = $("#namefield").val();
  const price = $("#pricefield").val();
  const color = $("#colorfield").val();
  const department = $("#deptfield").val();
  const description = $("#descfield").val();

  if (name === "" || price === "" || department === "" || description === "") {
    alert("Please Do not leave any field Empty");
  } else {
    console.log(name, price, color, department, description);
    $.ajax({
      url: "https://usman-recipes.herokuapp.com/api/products",
      method: "POST",
      data: { name, price, color, department, description },
      error: function (error) {
        if (error.log == undefined) {
          alert("INTERNET DOWN. Please Check your Internet Connection");
        } else {
          alert(error.log);
        }
      },
      success: function (response) {
        console.log("INSIDE SEND");
        $("#namefield").val("");
        $("#pricefield").val("");
        $("#colorfield").val("");
        $("#deptfield").val("");
        $("#descfield").val("");
        $("#collapseCreate").collapse("toggle");
        alert("Sending POST req. Please Check page for your product!");
        loadProducts();
      },
    });
  }
};
getoneProduct = () => {
  var idField = $("#getbyid").val();
  $(".byid").empty();
  console.log(idField);
  $.ajax({
    url: "https://usman-recipes.herokuapp.com/api/products/" + idField,
    method: "GET",
    success: (response) => {
      console.log(response);
      let products = document.createElement("div");
      let para = document.createElement("p");
      para.innerHTML = `<p>Price: $${response.price}</br>Department: <em>${response.department}</em></br>Description: ${response.description}</p>`;
      products.id = response._id;
      products.className = "product";

      products.innerHTML = `<h3>${response.name}</h3>`;

      products.append(para);
      $(".byid").append(products);
    },
    error: (error) => {
      alert(error.log);
    },
  });
};
deleteProduct = (e) => {
  console.log("INSIDE DEL", e);
  $.ajax({
    url: "https://usman-recipes.herokuapp.com/api/products/" + e,
    method: "DELETE",
    error: function (response) {
      if (response.log == undefined) {
        alert("INTERNET DOWN. Please Check your Internet Connection");
      } else {
        alert(response.log);
      }
    },
    success: function (response) {
      console.log(response);
      alert("Delete was Successful");
      loadProducts();
    },
  });
};
