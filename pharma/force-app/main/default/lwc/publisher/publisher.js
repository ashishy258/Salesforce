import { LightningElement } from "lwc";
import { fire } from "c/pubsub";
export default class Publisher extends LightningElement {
  handleClick() {
    let message = {
      message: "Hello PubSub",
      name: "Amit Singh",
      channel: "SFDCPnather"
    };
    fire("simplevt", message);
    fire("simple_event", message);
  }
}
