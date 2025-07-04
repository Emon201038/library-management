## 1 Create Book

This endpoint allows you to add a new book to the system. You can provide details such as the title, author, genre, ISBN, description, number of copies, and availability status.

### Request

**Method:** POST  
**URL:** `http://localhost:4000/api/books`

**Request Body (JSON):**

| Parameter | Type | Description |
| --- | --- | --- |
| title | string | The title of the book. |
| author | string | The author of the book. |
| genre | string | The genre of the book (e.g., FANTASY). |
| isbn | string | The ISBN number of the book. |
| description | string(optional) | A brief description of the book. |
| copies | number | The number of copies available. |
| available | boolean(optional) | Indicates if the book is currently available. |

### Response

**Status Codes:**

- `200 OK`: The book was successfully added.
    
- `500 Internal Server Error`: An error occurred while processing the request.
    

**Response Body (JSON):**

On success:

``` json
{
  "success": true,
  "message": "Book created successfully.",
  "data": {
    "_id": "6855540473da0e5b567395da",
    "title": "Harry Potter and the Sorcerer's Stone",
    "author": "J.K. Rowling",
    "description": "A young boy discovers he's a wizard and attends a magical school called Hogwarts.",
    "genre": "FANTASY",
    "isbn": 9780590353427,
    "copies": 6,
    "available": true,
    "createdAt": "2025-06-20T12:28:52.431Z",
    "updatedAt": "2025-06-20T12:42:42.031Z"
  }
}

 ```

On error:

``` json
{
  "success": false,
  "message": "Book validation failed: author: Author is required",
  "error": {
    "name": "ValidationError",
    "errors": {
      "author": {
          "name": "ValidatorError",
          "message": "Author is required",
          "properties": {
            "message": "Author is required",
            "type": "required",
            "path": "author"
          },
          "kind": "required",
          "path": "author"
      }
    }
  }
}

 ```

### Notes

- Ensure that all required fields are provided in the request body.
    
- The server may return an error response if there are issues with the provided data, particularly for the author field.



## 2 Get Books

This endpoint retrieves a list of books based on specified query parameters.

### Query Parameters

- **limit** (integer): Specifies the maximum number of book records to return. In this case, it is set to `5`, meaning the response will include up to five books.
    
- **filter** (string): This parameter allows users to filter the books by category. Here, it is set to `BIOGRAPHY`, which means only books in the biography category will be returned. Multiple genre can be support in this format `BIOGRAPHY,FANTASY,...`
    
- **search** (string): This parameter allows users to search the books by title and author.
    
- **page** (integer): This parameter allows users to paginate the books.
    

### Example Request

``` plaintext
GET http://localhost:4000/api/books?limit=5&filter=BIOGRAPHY

 ```

### Response

The response will include a list of up to five biography books based on the filtering criteria provided.

This endpoint retrieves a list of books available in the system. When a GET request is made to `http://localhost:4000/api/books`, it returns a collection of book records, each containing details such as title, author, and publication information. The expected outcome is a JSON response that includes an array of book objects, allowing users to access and display the available books in their application.

### Purpose

This endpoint retrieves a list of books from the database. It allows users to access information about available books, including their titles, authors, and other relevant details.

### Request Format

- **Method**: GET
    
- **URL**: `http://localhost:4000/api/books`
    
- **Request Body**: None required for this GET request.
    

### Response Structure

The response will be in JSON format and includes an array of book objects. Each book object contains the following fields:

- `_id`: Unique identifier for the book (objectID).
    
- `title`: Title of the book (string).
    
- `author`: Author of the book (string).
    
- `publishedDate`: Date when the book was published (string, formatted as YYYY-MM-DD).
    
- `genre`: Genre of the book (string).
    
- `description`: Brief description of the book (string).

- `copies`: How many copies available of the book (number).

- `available`: The book is availabe or not (boolean).

- `createdAt`: When the book is created (string, formatted as YYYY-MM-DD).

- `updatedAt`: When the book was last updated (string, formatted as YYYY-MM-DD).

    

### Example Response

``` json
{
  "success": true,
  "message": "Books retrieved successfull.",
  "data": [
    {
      "_id": "6854ffa3f67749cae06ce4de",
      "title": "Steve Jobs",
      "author": "Walter Isaacson",
      "description": "The authorized biography of Steve Jobs.",
      "genre": "BIOGRAPHY",
      "isbn": 9781451648539,
      "copies": 4,
      "available": true,
      "createdAt": "2025-06-20T06:28:51.331Z",
      "updatedAt": "2025-06-20T06:28:51.331Z"
    },
    ...
  ]
}

 ```

This endpoint is essential for applications that need to display a catalog of books to users, enabling them to browse through available titles.


## 3 Get Book By ID

This endpoint retrieves the details of a specific book using its unique identifier (ID). The ID must be in the correct format to successfully fetch the book details.

#### Request

- **Method**: GET
    
- **Endpoint**: `http://localhost:4000/api/books/{bookId}`
    
- **Path Parameter**:
    
    - `bookId` (string): The unique identifier for the book. It must conform to the expected format.
        

#### Response

On successful retrieval, the response will return a JSON object containing the book details. However, if the provided `bookId` is not in the desired format, the API will respond with an error.

##### Expected Error Response Format (if ID is not in the desired format):

- **Status**: 500
    
- **Content-Type**: application/json
    
- 
``` json
{ 
  "success": false, 
  "message": "", 
  "error": { 
    "name": "", 
    "errors": { 
      "bookId": { 
        "message": "Invalid book ID format.", 
        "properties": { 
          "message": "Invalid book ID format.", 
          "type": "string"
        }, 
        "path": "bookId", 
        "kind": "ObjectId", 
        "value": "invalid_id" 
      } 
    } 
  }
}
 ```
    

This structure indicates that the `bookId` provided does not meet the expected format requirements, and the error object provides additional details about the validation issue.

This endpoint retrieves the details of a specific book identified by its unique ID.

#### Request Format

- **Method**: GET
    
- **URL**: `http://localhost:4000/api/books/{bookId}`
    
    - Replace `{bookId}` with the actual ID of the book you want to retrieve.
        

#### Response Format

- **Status**: 200 OK
    
- **Content-Type**: application/json
    

- **Fields in Response**:
    
    - `success`: Indicates if the request was successful.
        
    - `message`: Any additional information or error messages (if applicable).
        
    - `data`: An object containing the book details:
        
        - `_id`: The unique identifier of the book.
            
        - `title`: The title of the book.
            
        - `author`: The author of the book.
            
        - `description`: A brief description of the book.
            
        - `genre`: The genre of the book.
            
        - `isbn`: The ISBN number of the book.
            
        - `copies`: The total number of copies available.
            
        - `available`: A boolean indicating if the book is currently available.
            
        - `createdAt`: The timestamp when the book was created.
            
        - `updatedAt`: The timestamp when the book details were last updated.

## Example Response
``` json
{
  "success": true,
  "message": "Book retrieved successfully.",
  "data": {
    "_id": "6855540473da0e5b567395da",
    "title": "Harry Potter and the Sorcerer's Stone",
    "author": "J.K. Rowling",
    "description": "A young boy discovers he's a wizard and attends a magical school called Hogwarts.",
    "genre": "FANTASY",
    "isbn": 9780590353427,
    "copies": 6,
    "available": true,
    "createdAt": "2025-06-20T12:28:52.431Z",
    "updatedAt": "2025-06-20T12:42:42.031Z"
  }
}
```


## 4 Update Book

This endpoint allows you to update the number of copies, available, title, description, author, genre and available for a specific book identified by its unique ID. 
**Note:** if book available is false and copies field is updated (not 0) then available will set true and after update of copies filed if its 0 then available field will be false

### HTTP Method

`PUT`

### Endpoint

`http://localhost:4000/api/books/{bookId}`

### Request Parameters

- **bookId** (path parameter): The unique identifier of the book you want to update. In this example, the book ID is `685557e81aa8a049bb9c0f5b`.
    
- **copies** (body parameter, type: integer): The new number of copies available for the book. In the provided example, the value is `5`.
    
- **title** (body parameter, type: string): The title of the book.
    
- **description** (body parameter, type: string): The description of the book.
    
- **genre** (body parameter, type: string): The genre of the book.
    
- **author** (body parameter, type: string): The author of the book.
    
- **available** (body parameter, type: boolean): The available of the book.
    

### Request Body Example

``` json
{
  "copies": 5
}

 ```

### Response Format

On a successful update, the response will return a status code of `200` along with a JSON object containing the following keys:

- **success** (boolean): Indicates whether the update was successful.
    
- **message** (string): A message related to the request (may be empty).
    
- **data** (object): Contains the updated book information, including:
    
    - **_id** (string): The unique ID of the book.
        
    - **title** (string): The title of the book.
        
    - **author** (string): The author of the book.
        
    - **description** (string): A description of the book.
        
    - **genre** (string): The genre of the book.
        
    - **isbn** (integer): The ISBN number of the book.
        
    - **copies** (integer): The updated number of copies available.
        
    - **available** (boolean): Indicates if the book is currently available.
        
    - **createdAt** (string): Timestamp of when the book was created.
        
    - **updatedAt** (string): Timestamp of when the book was last updated.
        
On Error this endpoint will return this following structured data
On a successful request, the API will return a JSON object with the following structure:

- **success** (boolean): Indicates whether the operation was successful.
    
- **message** (string): A message providing additional context (may be empty).
    
- **error** (object): Contains details about any errors encountered during the request, including:
    
    - **name** (string): The name of the error.
        
    - **errors** (object): A collection of field-specific errors, where each field can provide:
        
        - **name** (string): The name of the field that caused the error.
            
        - **message** (string): A message describing the error.
            
        - **properties** (object): Additional properties related to the error, including the invalid value and constraints.

**Example Response (successfull):**

``` json
{
  "success": true,
  "message": "",
  "data": {
    "_id": "",
    "title": "",
    "author": "",
    "description": "",
    "genre": "",
    "isbn": 0,
    "copies": 0,
    "available": true,
    "createdAt": "",
    "updatedAt": ""
  }
}

 ```

 **Example of response:(Failed)**

``` json
{
  "success": false,
  "message": "",
  "error": {
    "name": "",
    "errors": {
      "copies": {
        "name": "",
        "message": "",
        "properties": {
          "message": "",
          "type": "",
          "min": 0,
          "path": "",
          "fullPath": "",
          "value": 0
        },
        "kind": "",
        "path": "",
        "value": 0
      }
    }
  }
}

 ```

This endpoint allows you to update the number of copies for a specific book identified by its unique ID.


### Notes
    
This endpoint is useful for managing book inventory by allowing updates selected fields of a book.


## 5 DELETE BOOk

This endpoint is used to delete a specific book from the database using its unique identifier (`bookId`). The deletion is permanent, and once executed, the book will no longer be accessible through the API.
**Note:** deleted books related borrwed items will delete. this is done by post hook

#### Request Parameters

- **bookId** (path parameter): The unique identifier of the book to be deleted. This should be a valid book ID string.
    

#### Response Structure(success)

On a successful deletion, the API will return a JSON response with the following structure:

- **success** (boolean): Indicates whether the deletion was successful or not.
    
- **message** (string): A message providing additional information about the deletion process. This may be empty.
    

#### Example Response

``` json
{
  "success": true,
  "message": "Book deleted successfull",
  "data": null
}

 ```

#### Status Codes

- **200 OK**: The request was successful, and the book has been deleted.
    
- Other status codes may indicate errors or issues with the request.

**Error Response:**

In case if wronge formatted id provided then this error response will show

``` json
{
  "success": false,
  "message": "Invalid book id. Please provide a valid book id.",
  "error": {
    "name": "InvalidMongooseID",
    "errors": {
      "bookId": {
        "message": "Invalid book id. Please provide a valid book id.",
        "properties": {
          "message": "Invalid book id. Please provide a valid book id.",
          "type": "string"
        },
        "path": "bookId",
        "kind": "string",
        "value": "68553e78f3d6e9fef4647a6"
      }
    }
  }
}

```

If book is not available then this error will return

``` json
{
  "success":false,
  "message": "Book is not found"
}

```


## 6 Borrow a Book

This endpoint allows users to borrow a book by specifying the details of the borrowing request. When a user wants to borrow a book, they need to provide the due date for the return, the quantity of books they wish to borrow, and the specific book identifier.
**Note:** after borrow a book. Book copies will reduce as borrow quantity done by static method.

### Request

**Method:** POST  
**Endpoint:** `http://localhost:4000/api/borrow`

#### Request Body

The request body must be in JSON format and include the following parameters:

- **dueDate** (string): The date by which the book should be returned. It should be formatted as "DD Month YYYY" (e.g., "27 July 2025").
    
- **quantity** (integer): The number of copies of the book that the user wishes to borrow. This should be a positive integer.
    
- **book** (string): The unique identifier of the book being borrowed. This is typically a string that corresponds to a specific book in the database.
    

**Example Request Body:**

``` json
{
  "dueDate": "27 July 2025",
  "quantity": 1,
  "book": "685557e81aa8a049bb9c0f5b"
}

 ```

### Response

Upon successful processing of the request, the API will return a response with a status code of 201 (Created). The response will contain the following structure:

- **success** (boolean): Indicates whether the borrowing request was successful.
    
- **message** (string): A message providing additional information about the request (may be empty).
    
- **data** (object): Contains details about the borrowing transaction, including:
    
    - **book** (string): The identifier of the borrowed book.
        
    - **quantity** (integer): The number of books borrowed.
        
    - **dueDate** (string): The due date for returning the book.
        
    - **_id** (string): The unique identifier for the borrowing transaction.
        
    - **createdAt** (string): Timestamp of when the borrowing transaction was created.
        
    - **updatedAt** (string): Timestamp of when the borrowing transaction was last updated.
        

**Example Response:**

``` json
{
  "success": true,
  "message": "Book borrowed successfull.",
  "data": {
    "book": "",
    "quantity": 0,
    "dueDate": "",
    "_id": "",
    "createdAt": "",
    "updatedAt": ""
  }
}

 ```

**Error Response:**

In case if user input invalid type request body then a generic error will return
``` json
{
    "success": false,
    "message": "Borrow validation failed: quantity: Quantity must be greater than 0",
    "error": {
        "name": "ValidationError",
        "errors": {
            "quantity": {
                "name": "ValidatorError",
                "message": "Quantity must be greater than 0",
                "properties": {
                    "message": "Quantity must be greater than 0",
                    "type": "min",
                    "min": 1,
                    "path": "quantity",
                    "value": -1
                },
                "kind": "min",
                "path": "quantity",
                "value": -1
            }
        }
    }
}
```

if book is `Not Found` with provided id, then this error will return:

``` json
{
  "success": false,
  "message": "Book is not found"
}

```
### Summary

This API endpoint is essential for managing book borrowing requests, ensuring that users can specify their borrowing needs while the system tracks the necessary details for each transaction.


## 7 GET Borrowed Books Summary

This endpoint retrieves a list of borrowed books along with their total quantity. It is designed to provide users with information about the books they have borrowed from the library or service.

### Request

**Method:** GET  
**Endpoint:** `http://localhost:4000/api/borrow`

### Request Parameters

There are no input parameters required for this request.

### Response Structure

The response will return a JSON object with the following structure:

- **success** (boolean): Indicates whether the request was successful.
    
- **message** (string): A message providing additional information about the request (can be empty).
    
- **data** (array): An array containing details of the borrowed books. Each object in the array has the following properties:
    
    - **book** (object): Contains information about the book.
        
        - **title** (string): The title of the book.
            
        - **isbn** (integer): The ISBN number of the book.
            
    - **totalQuantity** (integer): The total quantity of the borrowed book.
        

### Example Response

``` json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully.",
  "data": [
    {
      "book": {
        "title": "",
        "isbn": 0
      },
      "totalQuantity": 0
    }
  ]
}

 ```

This endpoint is useful for users to track their borrowed books and manage their borrowing history effectively.


## 8 Update Borrow (only quantity)

this end point allow user to update a borrowed book quantity by specific borrowID. It will update book copies as updated value.
if borrow quantity increased then book copies will decreased and if borrow quantity decreased then book copies will increased.

### Request

**Method:** PUT  
**Endpoint:** `http://localhost:4000/api/borrow/{borroID}`

**Request Body:**
``` json
{
  "quantity":5
}
```

### Example Response

``` json
{
  "success": true,
  "message": "Borrowed book is updated successfully.",
  "data": {
    "_id": "68559ee22d999cf2e37db435",
    "book": "685557e81aa8a049bb9c0f5b",
    "quantity": 5,
    "dueDate": "2025-07-26T18:00:00.000Z",
    "createdAt": "2025-06-20T17:48:18.771Z",
    "updatedAt": "2025-06-21T04:15:39.015Z"
  }
}

 ```


## 9 Delete Borrow

this end point will allow to delete a singe borrow with its corresponding id. it will increment the quantity of related books copies.

### Request

**Method:** `DELETE`
**Endpoint:** `http://localhost:4000/api/borrow/{borrowID}`

### Response 
``` json 
{
  "success": true,
  "message": "Borrow is deleted successfully.",
  "data": null
}
