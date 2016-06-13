# shiny-toot

Is a web application to federate clinical, biological and imaging data. 

It has two main components. The first component is the front end which includes forms to input data and interactive data visualization using d3.js[https://d3js.org/]. The visualization tools enable group selection for clinical trials and hypothesis testing. 

The second components is the back end which includes the orchestration to data repositories. The data repositories use couchdb[http://couchdb.apache.org/] to store patient, clinical and imaging data in the form of attachments. 

## Depedencies 

1. clusterpost-server[https://www.npmjs.com/package/clusterpost-server]
