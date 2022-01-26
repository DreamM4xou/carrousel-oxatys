# carrousel-oxatis

- node.js v16 required
- npm v7 required


run :
- npm install
- npm run vite

-> preview on hhtp://localhost:3000

I implemented a carousel add with a button.
The second carousel always has text next to it.

You can configure the carousel, if you are an admin (props) : height, number of thumbnails, images, scrolling style.
With the carousel id (props) you can get the data in the vuex storage.
Each modification of a carousel will update the store, so we can plug an update into the database.

NB : Adding our own images is not implemented, but file type validation is.
  => 7 images are on the demo. The button add image is disabled when the carrousel has 7 images.
  For the demo, you can add images "carrousel (X).jpg" and change the value on the line 106, on src/components/Carrousel.html file.
