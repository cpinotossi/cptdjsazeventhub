# Azure Event Hub with Node.js

~~~bash
prefix=cptdazsa
npm install @azure/event-hubs
npm install @azure/identity
npm install avsc
npm install @azure/schema-registry-avro
npm install @azure/logger
myobjectid=$(az ad user list --query '[?displayName==`ga`].id' -o tsv)
az eventhubs namespace list -g $prefix
ehnsid=$(az eventhubs namespace show -g $prefix -n $prefix --query id)

node send.js $prefix $prefix

# az servicebus namespace list -g $prefix --query id
# az servicebus namespace show -g $prefix -n $prefix --query id
# az role assignment create --assignee "<user@domain>" \
# --role "Azure Event Hubs Data Owner" \
# --scope "<your-resource-id>"
~~~