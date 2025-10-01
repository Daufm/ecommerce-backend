# 📘 Category API Documentation

**Base URL:**  
`http://localhost:3000/api/categories`

---

## 1. Create a Category (Admin only)

**Endpoint:**  
`POST /`

**Description:**  
Create a new category.

**Headers:**  
`Authorization: Bearer <accessToken>` (Admin required)

**Request Body (JSON):**

```json
{
  "name": "Electronics",
  "parent": "652f3a7c1c9b9d1234567890", // optional: ObjectId of parent category
  "image": "https://example.com/category-banner.jpg" // optional
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "652f3a7c1c9b9d1234567890",
    "name": "Electronics",
    "slug": "electronics",
    "parent": null,
    "image": "https://example.com/category-banner.jpg",
    "createdAt": "2025-09-28T10:00:00.000Z",
    "updatedAt": "2025-09-28T10:00:00.000Z"
  }
}
```

---

## 2. Get All Categories

**Endpoint:**  
`GET /`

**Description:**  
Retrieve all categories.

**Query Params (optional):**

- `parent` → filter by parent category ID
- `isActive` → filter by active/inactive categories

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "652f3a7c1c9b9d1234567890",
      "name": "Electronics",
      "slug": "electronics",
      "parent": null,
      "image": null
    },
    {
      "_id": "652f3a7c1c9b9d1234567891",
      "name": "Laptops",
      "slug": "laptops",
      "parent": "652f3a7c1c9b9d1234567890"
    }
  ]
}
```

---

## 3. Get Category by Slug

**Endpoint:**  
`GET /:slug`

**Description:**  
Retrieve details of a single category by its slug.

**Example:**  
`GET /api/categories/electronics`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "652f3a7c1c9b9d1234567890",
    "name": "Electronics",
    "slug": "electronics",
    "parent": null,
    "image": null
  }
}
```

---

## 4. Update a Category (Admin only)

**Endpoint:**  
`PUT /:slug`

**Description:**  
Update category details.

**Headers:**  
`Authorization: Bearer <accessToken>` (Admin required)

**Request Body (JSON):**

```json
{
  "name": "Electronics & Gadgets",
  "image": "https://example.com/new-banner.jpg"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "652f3a7c1c9b9d1234567890",
    "name": "Electronics & Gadgets",
    "slug": "electronics-gadgets",
    "image": "https://example.com/new-banner.jpg"
  }
}
```

---

## 5. Delete a Category (Admin only)

**Endpoint:**  
`DELETE /:slug`

**Description:**  
Delete a category by slug.

**Headers:**  
`Authorization: Bearer <accessToken>` (Admin required)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```
