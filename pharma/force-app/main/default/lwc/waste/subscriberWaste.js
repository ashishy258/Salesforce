import { LightningElement } from "lwc";
import pubsub from "c/pubsub";
export default class PubsubSubscriber extends LightningElement {
  message;

  connectedCallback() {
    this.regiser();
  }

  regiser() {
    pubsub.register("simplevt", this.handleEvent.bind(this));
  }

  handleEvent(messageFromEvt) {
    this.message = messageFromEvt;
  }
}
