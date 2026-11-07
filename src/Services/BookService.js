// import { products } from "../Data/products";

// export async function getBookById(id) {
//     const book = products.find((item)=> item.id === id);

//     if (!book) {
//         throw new Error("Book not found");
//     }

//     return book;
// }

// export async function getBookById(id) {
//   const response = await fetch(`/api/books/${encodeURIComponent(id)}`);

//   if (!response.ok) {
//     throw new Error("Unable to load book");
//   }

//   return response.json();
// }

import { API_BASE_URL } from "../Config/api";

export async function getBookById(id) {
  const response = await fetch(
    `${API_BASE_URL}/api/products/${encodeURIComponent(id)}`,
  );

  if (!response.ok) {
    throw new Error(
      response.status === 404 ? "Book not found" : "Unable to load book",
    );
  }

  const data = await response.json();
  const book = data.product;

  if (!book) {
    throw new Error("Book not found");
  }

  return {
    ...book,
    id: Number(book.id),

    // Public preview endpoint
    pdfUrl: book.hasPdf
      ? `${API_BASE_URL}/api/products/${book.id}/preview`
      : null,

    // Do not expose the complete DOCX file publicly
    docxUrl: null,

    // Limited public preview text API
    previewTextUrl: book.hasDocx
      ? `${API_BASE_URL}/api/products/${book.id}/preview-text`
      : null,

    hasPdf: Boolean(book.hasPdf),
    hasDocx: Boolean(book.hasDocx),
  };
}
