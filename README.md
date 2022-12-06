## Run this command
npm install <br>
npm start<br>
Ready to go!!

# Setup your database using:
create a db.js file in the config folder
module.exports = {
    MongoURI:'<your databasename or ur db url>'
}

### Date format
date.toDateString() // "Thu Dec 29 2011"
date.toUTCString()  // "Fri, 30 Dec 2011 02:14:56 GMT"
date.getMonth()     // 11
date.getDate()      // 29
date.getFullYear()  // 2011

### logic
problem was to display the same inout format in output like if in next paragraph, then it should display in next line for taht using javascript. First need to break by /n and then storing it in array and then agin displaying it
<% var x=jobprofile[i].job_desc.split("\n") %>
                        <% for(var j=0; j<x.length; j++) { %>
                            <%= x[j] %>
                         <% } %> 


### Merging document 
collection: book
{
    "isbn": "978-3-16-148410-0",
    "title": "Some cool book",
    "author": "John Doe"
}
{
    "isbn": "978-3-16-148999-9",
    "title": "Another awesome book",
    "author": "Jane Roe"
}

collection: book_selling_data
{
    "_id": ObjectId("56e31bcf76cdf52e541d9d26"),
    "isbn": "978-3-16-148410-0",
    "copies_sold": 12500
}
{
    "_id": ObjectId("56e31ce076cdf52e541d9d28"),
    "isbn": "978-3-16-148999-9",
    "copies_sold": 720050
}
{
    "_id": ObjectId("56e31ce076cdf52e541d9d29"),
    "isbn": "978-3-16-148999-9",
    "copies_sold": 1000
}

Combining - aggregating
db.books.aggregate([{
    $lookup: {
            from: "books_selling_data",
            localField: "isbn",
            foreignField: "isbn",
            as: "copies_sold"
        }
}])

ouput: books
{
    "isbn": "978-3-16-148410-0",
    "title": "Some cool book",
    "author": "John Doe",
    "copies_sold": [
        {
            "_id": ObjectId("56e31bcf76cdf52e541d9d26"),
            "isbn": "978-3-16-148410-0",
            "copies_sold": 12500
        }
    ]
}
{
    "isbn": "978-3-16-148999-9",
    "title": "Another awesome book",
    "author": "Jane Roe",
    "copies_sold": [
        {
            "_id": ObjectId("56e31ce076cdf52e541d9d28"),
            "isbn": "978-3-16-148999-9",
            "copies_sold": 720050
        },
        {
            "_id": ObjectId("56e31ce076cdf52e541d9d28"),
            "isbn": "978-3-16-148999-9",
            "copies_sold": 1000
        }
    ]
}

https://recruitment.careerbuilder.com/ecomm-jobposting/jobdetailsv2/title/Software%20Engineer?TrackingCode=ResumeMatching'

npm i alert -> for alert box
let alert = require('alert');  
alert("message")


indexing
db.jobs.createIndex({job_role : "text"})
 db.jobs.find({job_role : {$regex : /Dat/}}).pretty()

 
