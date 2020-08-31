import { Component, Input } from '@angular/core';
import { ProductService } from '../product.service';
import { Cart } from '../cart/Cart';
import { Product } from '../product';


@Component({
    templateUrl: 'product-list.component.html',
    styleUrls: ['product-list.component.css']
})
export class ProductListComponent {
    rate: number;
    pageTitle = 'mCart';
    imageWidth = 80;
    imageHeight = 120;
    imageMargin = 12;
    showImage = false;
    listFilter: string;
    manufacturers = [{ 'id': 'Samsung', 'checked': false },
    { 'id': 'Microsoft', 'checked': false },
    { 'id': 'Apple', 'checked': false },
    { 'id': 'Micromax', 'checked': false }
    ];
    os = [{ 'id': 'Android', 'checked': false },
    { 'id': 'Windows', 'checked': false },

    { 'id': 'iOS', 'checked': false }];
    price_range = [{ 'id': '3000-5000', 'checked': false },
    { 'id': '13000-15000', 'checked': false },
    { 'id': '19000-35000', 'checked': false },
    { 'id': '40000-70000', 'checked': false }];
    errorMessage: string;
    products: any = [];
    selectedItems: any = 0;
    cart: Cart;
    total = 0;
    orderId = 0;
    selectedManufacturers: string[] = [];
    selectedOStypes: string[];
    selectedPrice: string[];
    checkedManufacturers: any[];
    checkedOS: any[];
    checkedPrice: any[];
    sub: any;
    i = 0;
    sortoption = '';
    chkmanosprice: any = [];

    constructor(private _productService: ProductService) {
        document.getElementById('login').style.display = '';
        document.getElementById('login').innerHTML = 'Logout';
        sessionStorage.setItem('loginTitle', 'Logout');
        this.orderId++;
        document.getElementById('welcome').style.display = '';
    //    this._productService.username = sessionStorage.getItem("username");
    //    document.getElementById("welcome").innerHTML = "Welcome " + sessionStorage.getItem("username");
       document.getElementById('welcome').style.color = '#ff0080';
      //  document.getElementById("welcome").style.position = "relative";
     //   document.getElementById("welcome").style.top = "15px";
        this._productService.getProducts()
            .subscribe(
            products => {
                this._productService.products = products;
                this.products = this._productService.products;
            },
            error => this.errorMessage = <any>error);

        if (_productService.selectedProducts.length > 0) {
            this.selectedItems = Number(sessionStorage.getItem('selectedItems'));
            this.total = Number(sessionStorage.getItem('grandTotal'));
        }
    }

    filter(name: any) {
        console.log(name)
        let checkedProducts: any[];
        let chkman: any = [];
        let chkmanos: any = [];
        this.chkmanosprice = [];
        const index = 0;
        checkedProducts = this._productService.products;
        console.log("checked Products",checkedProducts)
        console.log("Name Checked before",name.checked)
        name.checked = (name.checked) ? false : true;
        console.log("Name Checked after",name.checked)

        //Manufacturers , OS , Price have been defined above 
        //product.checked checks if a user has selected something to filter and value must be true to map the id
        this.checkedManufacturers = this.manufacturers.filter(product => product.checked).map(product => product.id);
        console.log("Checked Manu",this.checkedManufacturers)

        this.checkedOS = this.os.filter(product => product.checked).map(product => product.id);
        console.log("Checked Os",this.checkedOS)

        this.checkedPrice = this.price_range.filter(product => product.checked).map(product => product.id);
        console.log("Checked Price",this.checkedPrice)

        if (this.checkedManufacturers.length > 0) {
            for (let i = 0; i < this.checkedManufacturers.length; i++) {
                for (let j = 0; j < checkedProducts.length; j++) {
                    if (checkedProducts[j].manufacturer.toLowerCase() === this.checkedManufacturers[i].toLowerCase()) {
                        chkman.push(checkedProducts[j]);
                    }
                }
            }
        } else {
            // checked products has all products listed in tablets or mobiles
            chkman = checkedProducts;
            console.log("Else Chkman",chkman)
        }
        if (this.checkedOS.length > 0) {
            for (let i = 0; i < this.checkedOS.length; i++) {
                for (let j = 0; j < chkman.length; j++) {
                    if (chkman[j].ostype.toLowerCase() === this.checkedOS[i].toLowerCase()) {
                        chkmanos.push(chkman[j]);
                    }
                }
            }
        } else {
            //if no OS type is selected then chkmanos = All the checked products as given in above else condition
            chkmanos = chkman;
            console.log("Else Chkmanos",chkmanos)
        }
        if (this.checkedPrice.length > 0) {
            for (let i = 0; i < this.checkedPrice.length; i++) {
                for (let j = 0; j < chkmanos.length; j++) {
                    if (this.checkedPrice[i] === '3000-5000') {
                        if (chkmanos[j].price >= 3000 && chkmanos[j].price <= 5000) {
                            this.chkmanosprice.push(chkmanos[j]);
                        }
                    }
                    if (this.checkedPrice[i] === '13000-15000') {
                        if (chkmanos[j].price > 13000 && chkmanos[j].price <= 15000) {
                            this.chkmanosprice.push(chkmanos[j]);
                        }
                    }
                    if (this.checkedPrice[i] === '19000-35000') {
                        if (chkmanos[j].price > 19000 && chkmanos[j].price <= 35000) {
                            this.chkmanosprice.push(chkmanos[j]);
                        }
                    }
                    if (this.checkedPrice[i] === '40000-70000') {
                        if (chkmanos[j].price > 40000 && chkmanos[j].price <= 70000) {
                            this.chkmanosprice.push(chkmanos[j]);
                        }
                    }
                }
            }
        } else {
             //if no price rang is selected then chkmanos = All the checked products as given in above else condition
            this.chkmanosprice = chkmanos;
            console.log("Else Chkmanosprice",this.chkmanosprice)
        }

        this.products = [];
        this.products = this.chkmanosprice;
        console.log("Final Product after Filter ",this.products)
    }

    addCart(id: number) {
        console.log("Add Cart Id: ",id)
        this.cart = new Cart();
        this.selectedItems += 1;

        // fetching selected product details
        const product = this._productService.products.filter((currProduct: any) => currProduct.productId === id)[0];
        console.log("Found product",product)
        this.total += product.price;
        sessionStorage.setItem('selectedItems', this.selectedItems);

        // sp denotes if same product is added in cart again by clicking on add to cart option
        const sp = this._productService.selectedProducts.filter((currProduct: any) => currProduct.productId === id)[0];
        console.log("Sp before If condition",sp)
        if (sp) {
            console.log("Sp",sp)
            const index = this._productService.selectedProducts.findIndex((currProduct: any) => currProduct.productId === id);
            this._productService.selectedProducts[index].quantity += 1;
            this._productService.selectedProducts[index].totalPrice += product.price;
        } else {
            this.cart.orderId = 'ORD_' + this.orderId;
            this.cart.productId = id;
            this.cart.userId = sessionStorage.getItem('username');
            this.cart.productName = product.productName;
            this.cart.price = product.price;
            this.cart.quantity = 1;
            this.cart.dateOfPurchase = new Date().toString();
            this.cart.totalPrice = product.price * this.cart.quantity;
            this._productService.selectedProducts.push(this.cart);

            //On click of Add cart option selected product get stored using session storage
            console.log("Set the selected Product") 
            sessionStorage.setItem('selectedProducts', JSON.stringify(this._productService.selectedProducts));
            this.orderId++;
        }
    }

    searchtext() {
        console.log("Enter the manufacturer name in lower case to search")
        // you get all products if search option does not get a input value 
        this.products = this._productService.products;
        if (this.listFilter.length > 0) {
            this.products = this.products.filter((product: Product) =>
                product.manufacturer.toLowerCase().indexOf(this.listFilter) !== -1);
        }
    }

    tabselect(producttype: string) {
        this.products = [];
        this._productService.producttype = producttype;

        this._productService.getProducts().subscribe(
            products => {
                this._productService.products = products;
                this.products = this._productService.products;
            },
            error => this.errorMessage = <any>error);
    }

    onChange(value: string) {
        this.sortoption = value;
    }
}

