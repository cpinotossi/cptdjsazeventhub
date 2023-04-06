// Copyright (c) Microsoft Corporation.
// Licensed under the MIT Licence.

/**
 * @summary Demonstrates how to instantiate EventHubsClient using AAD token credentials obtained from using service principal secrets.
 */

/*
 * Setup :
 *   Register a new application in AAD and assign the "Azure Event Hubs Data Owner" role to it
 *    - See https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app
 *      to register a new application in the Azure Active Directory.
 *    - Note down the CLIENT_ID and TENANT_ID from the above step.
 *    - In the "Certificates & Secrets" tab, create a secret and note that down.
 *    - In the Azure portal, go to your Even Hubs resource and click on the Access control (IAM)
 *      tab. Here, assign the "Azure Event Hubs Data Owner" role to the registered application.
 *    - For more information on Event Hubs RBAC setup, learn more at https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-role-based-access-control)
 *
 */

const { EventHubConsumerClient } = require("@azure/event-hubs");
const { EventHubProducerClient } = require("@azure/event-hubs");
const { EventHubBufferedProducerClient, createEventDataAdapter } = require("@azure/event-hubs");
const { DefaultAzureCredential } = require("@azure/identity");
const { AvroSerializer } = require("@azure/schema-registry-avro");
const { SchemaRegistryClient } = require("@azure/schema-registry");
const { setLogLevel } = require("@azure/logger");

setLogLevel("info");

// Load the .env file if it exists
require("dotenv").config();

// Define Event Hubs Endpoint and related entity name here here
const eventHubsFullyQualifiedName = process.env["EVENTHUB_FQDN"] || ""; // <your-eventhubs-namespace>.servicebus.windows.net
const eventHubName = process.env["EVENTHUB_NAME"] || "";
const consumerGroup = process.env["CONSUMER_GROUP_NAME"] || "";
// The fully qualified namespace for schema registry
const schemaRegistryFullyQualifiedNamespace =
  process.env["SCHEMA_REGISTRY_ENDPOINT"] || "<endpoint>";

// The schema group to use for schema registeration or lookup
const groupName = process.env["SCHEMA_REGISTRY_GROUP"] || "AzureSdkSampleGroup";


const client = new SchemaRegistryClient(
  eventHubsFullyQualifiedName,
  new DefaultAzureCredential()
);

// Description of the schema for registration
const schema = JSON.stringify({
  type: 'record',
  name: 'cptdazsa',
  // namespace: eventHubName,
  fields: [{ name: 'message', type: 'string' }],
});


async function main() {
  console.log(`Running usingAadAuth sample`);

  const credential = new DefaultAzureCredential();
  // Create a new client
  const schemaRegistryClient = new SchemaRegistryClient(
    schemaRegistryFullyQualifiedNamespace,
    credential
  );
  // Create a new serializer backed by the client
  const serializer = new AvroSerializer(schemaRegistryClient, {
    groupName,
    messageAdapter: createEventDataAdapter()
  });

  
  // serialize an object that matches the schema
  const value = { message: 'chpinoto' };
  const messageAvro = await serializer.serialize(value, schema);
  console.log("Created message:");
  console.log(messageAvro);

  
  //   const client = new EventHubConsumerClient(
  //     consumerGroup,
  //     eventHubsFullyQualifiedName,
  //     eventHubName,
  //     credential
  //   );
  //   /*
  //      Refer to other samples, and place your code here
  //      to send/receive events
  //     */
  //   await client.close();


  // // Create a producer client to send messages to the event hub.
  // const eventHubsBufferedProducerClient = new EventHubBufferedProducerClient(
  //   eventHubsConnectionString,
  //   eventHubName,
  //   {
  //     onSendEventsErrorHandler: handleError,
  //   }
  // );
  const producer = new EventHubProducerClient(
    eventHubsFullyQualifiedName, 
    eventHubName, 
    credential);
  // Prepare a batch of three events.
  const batch = await producer.createBatch();
  // var message = {
  //     text: "hello world",
  //     date: new Date(Date.now()).toUTCString()
  // }
  batch.tryAdd(messageAvro);
  // batch.tryAdd(JSON.stringify(message));

  // Send the batch to the event hub.
  await producer.sendBatch(batch);
  // Close the producer client.
  await producer.close();

  console.log("send:" + messageAvro);
  console.log(`Exiting usingAadAuth sample`);
}

main().catch((error) => {
  console.error("Error running sample:", error);
});

module.exports = { main };