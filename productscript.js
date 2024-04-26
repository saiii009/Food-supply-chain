const web3 = new Web3("http://localhost:7545");
console.log("HELLO")
var contract = new web3.eth.Contract(abi, address);
var quantity 
var cname 
var caddress
const ipfs = window.KuboRpcClient.create({ host: 'localhost', port: 5001,   headers: {
    authorization: 'k51qzi5uqu5dkcnd6q9n9gtbjxs0qvazp5n0ix7xrogssz27svm24c5bmo98vg'
  } })
console.log(ipfs)
console.log(web3, contract)
$(document).ready(function () {

	contract.methods.getTotalProduct().call().then(function (totalProduct) {
		console.log("totalProduct : " + totalProduct);
		$("#_products_table").html(totalProduct);

		for (var i = 1; i <= totalProduct; i++) {
			contract.methods.getProductById(i).call().then(function (productDetails) {
				console.log(productDetails);
				var row = "<tr><th>" + productDetails[0] + "</th><td>" + productDetails[3] + "</td><td>" + productDetails[1] + "</td><td>" + productDetails[2] + "</td><td><button type=\"button\" class=\"btn btn-secondary btn-sm\" onclick=\"productOrderClick(" + productDetails[0] + ")\">Order</button></td></tr>";
				$("#_product_table").find('tbody').append(row);
			});
		}
	});


	web3.eth.getAccounts().then(function (accounts) {
		var account = accounts[0];

		// Fetching total number of order.
		contract.methods.getTotalOrder(account).call().then(function (totalOrder) {
			console.log("totalOrder : " + totalOrder);
			$("#_track").html(totalOrder);
		});

		// Fetching all products.
		contract.methods.getTotalOrder().call().then(function (totalOrder) {
			console.log("totalOrder (global) : " + totalOrder);

			for (var index = 1; index <= totalOrder; index++) {
				contract.methods.fetchNextOrderById(account, index).call().then(function (orderDetails) {
					console.log(orderDetails);
					if (orderDetails[6]) {
						var row = "<tr><th scope=\"row\">" + orderDetails[0] + "</th><td>" + orderDetails[5] + "</td><td>" + orderDetails[4] + "</td></tr>";
						$("#_order_table").find('tbody').append(row);
					}
				});
			}
		});


	});

	// Placing order.
	$("#_orderbtn").click(function (e) {
		web3.eth.getAccounts().then(function (accounts) {
			var account = accounts[0];
			var pid = $("#_pid").val();
			quantity = $("#_quantity").val();
			cname = $("#_cname").val();
			caddress = $("#_caddress").val();
			console.log("place order : " + pid + quantity + cname + caddress);
			console.log("EVENT", e)
			return contract.methods.placeOrder(cname, caddress, pid, quantity).send({ from: account , gas: 3000000});
		}).then(async function (trx) {
			console.log(trx);
			if (trx.status) {
				console.log("BEFORE")
				let res  = await ipfs.add(`${quantity}`)
				console.log("AFTER")

				console.log(res)
				// $.ajax({
				// 	url: "http://localhost:10000/placeOrder",
				// 	method: "POST",
				// 	data: {"quantity": quantity, "cust_address":caddress}
				// }).then(res=>{console.log(res)}).fail(err => console.log(err))
				alert("Order is placed!");
				$("#_pid").val("");
				$("#_quantity").val("");
				$("#_cname").val("");
				$("#_caddress").val("");
				// location.reload();
			}

		});
	});


});

// Order button action.
function productOrderClick(productId) {
	console.log("order click : " + productId);
	$("#_pid").val(productId);
}