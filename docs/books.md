# Books API Specification

## Insert New Book
Endpoint: POST /books

Request Body:
```json
    {
        "code": "JK-45",
        "title": "Harry Potter",
        "author": "J.K Rowling",
        "stock": 1
    }
```
response Body success:
```json
    {
        "code": "JK-45",
        "title": "Harry Potter",
        "author": "J.K Rowling",
        "stock": 1
    }
```
response Body Errors
```json
    {
        "error": "Invalid request body"
    }
```


## GET all books
Endpoint: GET /books

response Body success:
```json
    [
        {
            "code": "JK-45",
            "title": "Harry Potter",
            "author": "J.K Rowling",
            "stock": 1
        }
    ]
```

## GET All Borrowed Book
Endpoint: GET /books/

