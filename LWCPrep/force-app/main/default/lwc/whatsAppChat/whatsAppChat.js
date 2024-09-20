import { LightningElement, track, wire } from 'lwc';
import getWhatsAppChats from '@salesforce/apex/WhatsappCalloutService.getWhatsAppChats';
import sendWhatsAppMessage from '@salesforce/apex/WhatsappCalloutService.sendWhatsAppMessage';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
import { gql, graphql } from "lightning/uiGraphQLApi";

export default class WhatsAppChat extends LightningElement {

    showModal = false;
    phoneNumber;
    contactName;
    @track chatData = [];
    textMessage;
    isDataArrived = false;
    genericRecordList;

    channelName = '/data/Whatsapp_Chat__ChangeEvent';
    isSubscribeDisabled = false;
    isUnsubscribeDisabled = !this.isSubscribeDisabled;
    errors;
    subscription = {};

    @wire(graphql, {
        query: gql`
          query AccountWithName {
            uiapi {
              query {
                Account(first: 50) {
                  edges {
                    node {
                      Id
                      Name {
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        `,
    })
    graphqlQueryResult({ data, errors }) {
        if (data) {
          this.genericRecordList = data.uiapi.query.Account.edges.map((edge) => {
                                return {Id: edge.node.Id, Name: edge.node.Name.value};
                            });
          console.log('genericRecordList: ', JSON.parse(JSON.stringify(this.genericRecordList)));
        }
        this.errors = errors;
    }

    connectedCallback() {
        this.handleSubscribe();
        // Register error listener
        this.registerErrorListener();
    }

    handleAccountChange(event){
        console.log(event.detail.recordId);
    }

    // Handles subscribing
    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        const messageCallback = (response) => {
            console.log('New message received: ', JSON.stringify(response));
            // Response contains the payload of the new message received
            this.handleNotification(response);
        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
            this.handleNotification(response);
        });
    }

    //this method checks if current record got updated and shows message on UI
    handleNotification(response){
        if(response.hasOwnProperty('data')){
            let jsonObj = response.data;
            
            if(jsonObj.hasOwnProperty('payload') && jsonObj.payload.Is_Inbound__c === true && jsonObj.payload.ChangeEventHeader.changeType === 'CREATE'){
                console.log('inside phone number: ', this.phoneNumber);  
                getWhatsAppChats({phoneNumber : this.phoneNumber})
                .then(data => {
                    this.isDataArrived = true;
                    this.chatData = data;
                    console.log(this.chatData);
                })
                .catch(error => {
                    console.log(error);
                });
            }
        }
    }

    handleClick(){
        this.showModal = true;
        getWhatsAppChats({phoneNumber : this.phoneNumber})
        .then(data => {
            this.isDataArrived = true;
            this.chatData = data;
            console.log(this.chatData);
        })
        .catch(error => {
            console.log(error);
        });
    }

    hideModal(){
        this.showModal = false;
        this.chatData = [];
        this.isDataArrived = false;
    }

    handleContactSelection(event){
        console.log('phone number: ', event.detail);
        this.phoneNumber = event.detail;
    }

    handleNameSelect(event){
        console.log('contact name: ', event.detail);
        this.contactName = event.detail;
    }

    handleGenericSelection(event){
        console.log('generic Data: ', event.detail);
    }

    handleSend(){
        sendWhatsAppMessage({phoneNumer : this.phoneNumber, textMessage : this.textMessage})
        .then(data => {
            console.log(data);
            this.chatData.push(data);
            console.log(this.chatData);
            this.textMessage = '';
        })
        .catch(error => {
            console.log(error);
        });
    }

    handleInputChange(event){
        this.textMessage = event.target.value;
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError((error) => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }
}