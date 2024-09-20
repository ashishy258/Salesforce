import { LightningElement,wire } from "lwc";
import searchDrug from '@salesforce/apex/DrugController.searchDrug';
import pubsub from "c/pubsub";
export default class Subscriber extends LightningElement {
  name;
  inventory;
  price;
  product;
  image;
  bool = false;


  connectedCallback() {
    this.regiser();
   
  }

  regiser() {
    pubsub.register("simple_event", this.handleEvent.bind(this));
  }

  handleEvent(messageFromEvt) {
    this.name = messageFromEvt.name;
    this.inventory = messageFromEvt.inventoryLeft;
    this.price = messageFromEvt.price;
    this.product = messageFromEvt.productType;
    this.image = messageFromEvt.image;
    this.bool = true;

    console.log(messageFromEvt);
  }

  

  
}
