import { products } from "../Data/products";

export async function getBookById(id) {
    const book = products.find((item)=> item.id === id);
    

    if (!book) {
        throw new Error("Book not found");
    }

    return book;
}


// export async function getBookById(id) {
//   const response = await fetch(`/api/books/${encodeURIComponent(id)}`);

//   if (!response.ok) {
//     throw new Error("Unable to load book");
//   }

//   return response.json();
// }