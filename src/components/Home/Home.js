import React from 'react';
import Logo from '../../assets/coffeerobo.webp';
import axios from 'axios';
import './Home.css';
import API_URL from "../../config/config";

class Home extends React.Component{

  constructor(props) {
    super(props);
    this.state= { 
      type: "",
      size: "",
      address: "",
      account: "",
      found_loc:[],
      isOrder: false,
      isDone: false,
      errorMessage: "",
      orderID: "",
      comment: "Thank you for your order! \n Robot is currently making your coffee"
    };
  }
  componentDidMount() {
    axios.get(
      API_URL.GET_LOCATIONS
    ).then(response=> {
      console.log(response);
      this.setState({found_loc: response.data});
    }).catch(error=> {
      console.log("ERROR getLocation: "+error.message);
    });
  }

  handleLocationChange = (e) => {
    this.result = this.state.found_loc.find(
      (loc) => loc.address === e.target.value
    )?.account;

    this.setState({
      address: e.target.value,
      account: this.result
    });
  }
  handleTypeChange = (e) => {
    this.setState({
        type: e.target.value,
    })
  }
  handleSizeChange = (e) => {
    this.setState({
        size: e.target.value,
    })
  }

  handleOrder = (e) => {
    e.preventDefault();

    console.log("Order Start ...");
    axios.post(API_URL.POST_MAKE_COFFEE,
    {
      "businessId": this.state.account,
      "coffeeSize": this.state.size,
      "coffeeType": this.state.type,
      "customerId": 1
    })
    .then(response => {
      console.log("Order Success");
      console.log(response.data);
      console.log(response.data.orderId);
      this.setState({
        orderID: response.data.orderId,
        isOrder: true
      });
      this.checkStatus(); 
      console.log("Async call function");
    })
    .catch(error=> {
      console.log("Order Fail");
      console.log(error);
    });
  }

 sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

  async checkStatus() {
    if (this.state.orderID=='-1') {
      console.log("order id -1 break");
      return;
    }
    console.log("check status...")
    var requestUrl = API_URL.GET_ORDER_STATUS + this.state.orderID;
    while(true) {
      console.log("wait...")
      await this.sleep(15*1000);

      if (!this.state.isDone) {
        console.log("checking...")
        axios.get(
          requestUrl
        ).then(response=> {
          console.log(response.data.orderState);
          if (response.data.orderState === "DONE") {
            this.setState({
                isDone: true,
                comment: "Your order is ready!"
            })
          }
        }).catch(error=> {
          console.log("ERROR check status...")
        });
      }
      else {
        break;
      }
    }
  }

  render() {
  const { isOrder, found_loc } = this.state;
  return( 
    <div className='home__base'>
      { this.state.isOrder?
        <div className='order__done__box'> 
          <div> {this.state.comment} </div> 
          <p> OrderID : {this.state.orderID} </p>
          <div> Location: {this.state.address} </div>
          <div> Type: {this.state.type} </div>
          <div> Size: {this.state.size} </div>
        </div>
        :
        <div>
        <div>
          <h1 className='welcome__text'> Order coffee </h1>
          <img className='welcome__pic' src={Logo}/>
        </div>

        <div className='order__base'>
          <form className="order__form" onSubmit={this.handleOrder} >
            <div className='order__line'> 
                <label className='order__label'>Location</label>
                <input className='order__input' list="location" onChange={this.handleLocationChange} />
                <datalist id="location">
                  {this.state.found_loc ?
                      this.state.found_loc.map((loc)=> [
                              <option key={loc.account} value={loc.address} />
                      ]):
                      <option value="No available" />
                  }
                </datalist>
            </div>
            <div className='order__line'> 
                <label className='order__label'>Coffee</label>
                <input list="coffee" onChange={this.handleTypeChange}/>
                    <datalist id="coffee">
                      <option value='AMERICANO' />
                      <option value='ESPRESSO' />
                      <option value='CAPPUCCINO' />
                    </datalist>
            </div>
            <div className='order__line'> 
              <label className='order__label'>Size</label>
            <input list="size" onChange={this.handleSizeChange}/>
                <datalist id="size">
                  <option value='XL' />
                  <option value='L' />
                  <option value='M' />
                  <option value='S' />
                </datalist>
            </div>
            <div className='order__btn_div'>
              <button className='order__btn' type="submit">Order</button>
            </div>
          </form> 
        </div>
        </div>
      }
    </div>

  )}
}

export default Home;