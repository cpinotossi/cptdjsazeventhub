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


## Misc
### github
~~~ bash
prefix=cptdjsazeventhub
gh repo create $prefix --public
git init
git remote remove origin
git remote add origin https://github.com/cpinotossi/$prefix.git
git status
git add .gitignore
git add *
git commit -m"init"
git push origin main
git push --recurse-submodules=on-demand
git rm README.md # unstage
git --help
git config advice.addIgnoredFile false
git pull origin main
git merge 
origin main
git config pull.rebase false
~~~


