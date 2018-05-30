import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Options from "./components/Options";
import Selected from "./components/Selected";
import Slider from "./components/Slider";
import ProductDisplay from "./components/ProductDisplay";
import Header from "./components/Header";
import Footer from "./components/Footer";

class App extends Component {
  state = {
    selectedType: {
      blush: false,
      bronzer: false,
      eyebrow: false,
      eyeliner: false,
      eyeshadow: false,
      foundation: false,
      lip_liner: false,
      lipstick: false,
      mascara: false,
      nail_polish: false
    },
    products: {
      blush: [],
      bronzer: [],
      eyebrow: [],
      eyeliner: [],
      eyeshadow: [],
      foundation: [],
      lip_liner: [],
      lipstick: [],
      mascara: [],
      nail_polish: []
    },
    minmax: {
      blush: { min: 0, max: 0, avg: 0 },
      bronzer: { min: 0, max: 0, avg: 0 },
      eyebrow: { min: 0, max: 0, avg: 0 },
      eyeliner: { min: 0, max: 0, avg: 0 },
      eyeshadow: { min: 0, max: 0, avg: 0 },
      foundation: { min: 0, max: 0, avg: 0 },
      lip_liner: { min: 0, max: 0, avg: 0 },
      lipstick: { min: 0, max: 0, avg: 0 },
      mascara: { min: 0, max: 0, avg: 0 },
      nail_polish: { min: 0, max: 0, avg: 0 }
    },
    rates: { CAD: 1, GBP: 1, USD: 1 },
    budget: {
      min: null,
      max: null,
      range: null,
      minThree: [],
      maxThree: [],
      loader: false
    },
    randomProducts: [],
    locked: {
      product1: {
        locked: false,
        id: 0,
        type: ""
      },
      product2: {
        locked: false,
        id: 0,
        type: ""
      },
      product3: {
        locked: false,
        id: 0,
        type: ""
      }
    },
    lockedProducts: {
      product1: {},
      product2: {},
      product3: {}
    }
  };

  sliderRef = React.createRef();

  componentDidMount() {
    axios({
      method: "GET",
      url:
        "http://data.fixer.io/api/latest?access_key=828f6dfc4a7815f24e3c45fbf819b227",
      responseType: "json"
    })
      .then(res => {
        const rates = { ...this.state.rates };
        // rates compared to EUR - fetching rates first to work with CAD
        rates.GBP = res.data.rates.CAD / res.data.rates.GBP;
        rates.USD = res.data.rates.CAD / res.data.rates.USD;
        this.setState({ rates });
      })
      .then(() => {
        for (let product in this.state.products) {
          this.getProductData(product);
        }
      });
  }

  getProductData = product => {
    axios({
      method: "GET",
      url: `https://makeup-api.herokuapp.com/api/v1/products.json?product_type=${product}`,
      responseType: "json"
    })
      .then(res => {
        // this section fetches product data and uses the rates info to convert to CAD in cents
        const products = { ...this.state.products };
        products[product] = res.data
          //make sure price is not 0
          .filter(product => parseInt(product.price) > 0)
          .map(product => {
            product.currency === null && (product.currency = "CAD");
            product.price = parseInt(
              Number(product.price) * this.state.rates[product.currency] * 100,
              0
            );
            return product;
          });
        this.setState({ products });
      })
      .then(() => {
        // finding min, max, and average for each category
        const minmax = { ...this.state.minmax };
        const productPriceArr = this.state.products[product].map(product =>
          Number(product.price)
        );
        minmax[product].min = Math.min(...productPriceArr);
        minmax[product].max = Math.max(...productPriceArr);
        minmax[product].avg = parseInt(
          productPriceArr.reduce((a, b) => a + b, 0) / productPriceArr.length
        );

        this.setState({ minmax }, this.checkThree());
      })
      .catch(err => {
        //api has
        this.props.history.push(`/your-gift/920/247/885`);
        console.log(err);
      });
  };

  toggleSelect = key => {
    const selectedType = { ...this.state.selectedType };
    selectedType[key] = !selectedType[key];
    this.setState({ selectedType }, this.checkThree);
    //if three items are selected set budget
    const budget = { ...this.state.budget };

    budget.range = parseInt((budget.min + budget.max) / 2);

    this.setState({ budget });
  };

  checkThree = () => {
    // console.log("running CheckThree");
    Object.values(this.state.selectedType).reduce(
      (accumulator, currentValue, currentIndex, array) =>
        accumulator + currentValue
    ) === 3
      ? this.checkTypesLoaded()
      : this.setBudgetRange(null);
  };

  checkTypesLoaded = () => {
    // console.log("running checktypesLoaded");
    const arraySelected = Object.keys(this.state.selectedType).filter(
      key => this.state.selectedType[key]
    );

    // if data is available
    if (arraySelected.every(type => this.state.products[type].length > 0)) {
      console.log("data available");
      const budget = { ...this.state.budget };
      budget.loader = false;
      this.setState({ budget });
      this.setBudget();
    } else {
      console.log("data loading...");
      const budget = { ...this.state.budget };
      budget.loader = true;
      this.setState({ budget });
    }
  };

  setBudget = () => {
    const budget = { ...this.state.budget };
    budget.minThree = [];
    budget.maxThree = [];
    const minmax = { ...this.state.minmax };
    const arraySelected = Object.keys(this.state.selectedType).filter(
      key => this.state.selectedType[key]
    );
    // console.log(arraySelected);
    arraySelected.forEach(type => {
      budget.minThree.push(this.state.minmax[type].min);
      budget.maxThree.push(this.state.minmax[type].max);
    });
    // update min, max based on minThree and maxThree
    budget.min = budget.minThree.reduce((acc, val) => acc + val);
    budget.max = budget.maxThree.reduce((acc, val) => acc + val);
    //set avarage
    budget.range = parseInt((budget.min + budget.max) / 2);
    //and display slider
    this.setState({ budget }, this.setNewItems());
  };
  //setNewItems callback required to change items on slider change but needs to go indeirectly through seNewItemsAftersetBudgetRange
  setBudgetRange = value => {
    const budget = { ...this.state.budget };
    budget.range = value;
    this.setState({ budget }, this.setNewItemsAftersetBudgetRange());
  };
  //without this function setNewItems is run even when all selectedTypes are false causing error
  setNewItemsAftersetBudgetRange = () => {
    Object.values(this.state.selectedType).reduce(
      (accumulator, currentValue, currentIndex, array) =>
        accumulator + currentValue
    ) !== 0 && this.setNewItems();
  };

  setNewItems = () => {
    let range = this.state.budget.range;
    //returns an array of type names
    const selectedTypeArrays = Object.keys(this.state.selectedType).filter(
      key => this.state.selectedType[key]
    );
    // console.log("selected type array", selectedTypeArrays);
    //returns an array of objects for each type that contains id as the key and price as the value
    const idPriceArrays = selectedTypeArrays.map(type => {
      return this.state.products[type].map(product => {
        return { [product.id]: product.price };
      });
    });
    let randomProducts = [];
    //calls getRandomProducts untill it finds three products that are below the range
    while (range) {
      range = parseInt(range);
      randomProducts = this.getRandomProducts(idPriceArrays);
      // console.log(randomProducts);
      let randomTotal = 0;
      //sums the price of random products
      randomTotal = randomProducts
        .map(object => parseInt(Object.values(object)))
        .reduce((acc, cur) => acc + cur);
      // console.log(randomTotal, "budget", range);

      // randomTotal <= range
      //   ? console.log("within budget")
      //   : console.log("out of budget");
      //stops searching if it finds a product within range
      if (range == this.state.budget.min) {
        console.log("min budget");
        break;
      }
      if (randomTotal <= range) {
        // console.log(randomProducts);
        // get array of ids
        const ids = randomProducts.map(object => Object.keys(object)[0]);

        const products = [];

        ids.forEach(id =>
          Object.values(this.state.products).forEach(type =>
            type.forEach(
              product => product.id === parseInt(id) && products.push(product)
            )
          )
        );
        // console.log(products);
        this.setState({ randomProducts: products });
        break;
      }
    }
  };

  getRandomProducts = idPriceArrays => {
    const randomProducts = idPriceArrays.map(
      array => array[Math.floor(Math.random() * array.length)]
    );
    return randomProducts;
  };

  generateDisplay = locked => {
    // Triggered when generate button is clicked in ProductDisplay
    // Locked product state passed from ProductDisplay
    // console.log(locked);
    this.setState({ locked }, this.checkThree());
  };

  render() {
    return (
      <div className="App">
        <Header />
        <section className="select">
          <div className="wrap type clearfix">
            <Options
              toggleSelect={this.toggleSelect}
              selectedType={this.state.selectedType}
            />
            <Selected
              toggleSelect={this.toggleSelect}
              selectedType={this.state.selectedType}
            />
          </div>
          <div className="slider wrap">
            {this.state.budget.range !== null && (
              <Slider
                budget={this.state.budget}
                setBudget={this.setBudgetRange}
                ref={this.sliderRef}
              />
            )}
          </div>
        </section>
        <section className="display wrap">
          {Object.values(this.state.selectedType).reduce(
            (accumulator, currentValue, currentIndex, array) =>
              accumulator + currentValue
          ) === 3 && (
            <ProductDisplay
              product1={
                !this.state.locked.product1.locked
                  ? this.state.randomProducts[0]
                  : this.state.locked.product1.type
              }
              product2={
                !this.state.locked.product2.locked
                  ? this.state.randomProducts[1]
                  : this.state.locked.product2.type
              }
              product3={
                !this.state.locked.product3.locked
                  ? this.state.randomProducts[2]
                  : this.state.locked.product3.type
              }
              generate={this.generateDisplay}
            />
          )}
        </section>
        <Footer />
      </div>
    );
  }
}

export default App;
