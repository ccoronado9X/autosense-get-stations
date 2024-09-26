# autosense-get-stations
## Create an endpoint to get the stations within a bounding box

### The task
You are tasked with writing a small web service that returns all charging stations within a geographical
area. The task is conceptually very simple and can be resolved with less than 100 lines of code but
helps us gauge your familiarity with Node.js internals and modern language features.

### Backend Requirements
Technologies:
• Language: JavaScript or TypeScript
• Platform: Node.js
• Frameworks, libraries: Feel free to use whatever you are familiar with

### Functionality
You are tasked with implementing a single endpoint that takes a geographical area as an input,
analyses the large set of known electric vehicle charging stations sourced from our S3 bucket and
returns only the stations that are within the requested geographical area.
The endpoint can take geographical area as either a bounding box (coordinates for the southwest
and northeast corner of the geographical box) or some other standardized format
(WKT/WKB/GeoJSON) etc. It then must request the list of all stations from our S3 bucket (linked
below), analyse all the stations in the list and return all the stations that are within the requested
area. An important aspect of this is that the list of all stations should be fetched every time the
endpoint is called. The list of stations is a large JSON file (about 7MB) and the retrieval, parsing,
processing of the list and sending the response back to the client should block the event loop as little
as possible. The response should be a JSON array.
