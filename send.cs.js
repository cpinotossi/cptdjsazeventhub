#!/usr/bin/env node

const os = require('os');
let networkInterfaces = os.networkInterfaces();
let currentNetworkInterfacce = networkInterfaces.eth0[0];

const { EventHubProducerClient } = require("@azure/event-hubs");
// Load the .env file if it exists
require("dotenv").config();

// Event hubs 
let args=process.argv;
// const eventHubsResourceName = process.env["EVENTHUB_NAME"];
const eventHubName = process.env["EVENTHUB_NAME"];
const connectionString =  process.env["CS"];

// const eventHubsResourceName = "EVENT HUBS RESOURCE NAME";
// const fullyQualifiedNamespace = `${process.env["EVENTHUB_RESOURCE_NAME"]}.servicebus.windows.net`; 

// Azure Identity - passwordless authentication
// const credential = new DefaultAzureCredential();

async function main() {
  // Create a producer client to send messages to the event hub.
  const producer = new EventHubProducerClient(connectionString, eventHubName);
  // Prepare a batch of three events.
  const batch = await producer.createBatch();
  batch.tryAdd({ body: currentNetworkInterfacce });

  // Send the batch to the event hub.
  await producer.sendBatch(batch);

  // Close the producer client.
  await producer.close();

  console.log(`Did send message: ${JSON.stringify(currentNetworkInterfacce)}`);
}

main().catch((err) => {
  console.log("Error occurred: ", err);
});