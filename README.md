# E-Commerce Shopping Cart Single-Page Application

## Summary
This project is a dynamic Single-Page Application (SPA) designed to simulate a fully functional e-commerce storefront. It solves the problem of providing a seamless user shopping experience without disruptive page reloads. Users can view a catalog of products, selectively add items to their shopping cart, dynamically edit quantities, and remove items. The system ensures robust inventory management through a mock checkout process while also offering an administrative interface for full inventory control.

## Technical Stack
* **Frontend:** React.js (bootstrapped with Vite) utilizing the Context API for global state management.
* **Styling:** Tailwind CSS integrated with customized animations and utility classes.
* **Routing:** SPA Conditional component rendering (dynamically rewriting the current page data without an external library).
* **Backend:** Node.js with Express.js handling REST API routes.
* **Database:** MongoDB (Atlas/Local) configured with the Mongoose ODM for structured schemas.

## Feature List
* **True Single-Page Application:** Seamless interface utilizing Drawers and Modals to swap data dynamically on a single HTML layout.
* **Complete CRUD Capabilities:** Create, Read, Update, and Delete operations fully implemented for managing both the shopping cart logs and the administrative product catalog.
* **Interactive Cart Manipulation:** Users can add, modify, and remove products directly through a side-drawer interface.
* **Real-time Stock Validation:** State-aware checkout system that queries the database stock bounds before successfully completing a transaction.
* **Secure Admin Portal:** Authenticated administrative access for updating store layout and available inventory.
* **Responsive Mobile Design:** Designed to perfectly adapt across desktop, tablet, and mobile orientations.

## Folder Structure
The workspace is split into two distinct environments to cleanly separate the client and server:
* `client/` - Houses the React frontend rendering environment.
  * `client/src/components/` - Isolated and reusable UI components (`Navbar`, `ProductGrid`, `CartDrawer`).
  * `client/src/services/` - Contains 'api.js' which acts as the abstraction layer fetching data from the backend endpoints.
* `server/` - Houses the Express.js business logic and database integration.
  * `server/src/models/` - Mongoose schemas enforcing structured data models for Products and Cart Items.
  * `server/src/routes/` - Dedicated API controllers separating logic for products, admin authorization, and cart mutations.
  * `images/` - Directory holding local high-resolution binary image assets served back to the React app via Express static proxying.

## Challenges Overcome
Ensuring strict synchronization between the client’s asynchronous React state and the persistent MongoDB backend proved challenging, specifically regarding cart management. A situation frequently arose where an item could be deleted by an administrator while a user concurrently retained that product inside their cart, leading to fatal checkout API crashes due to orphaned database references. This problem was resolved by overhauling the database retrieval logic; the server now dynamically validates and prunes orphaned `CartItems` actively upon every `GET` request. Furthermore, unified frontend error handling was implemented to silently resynchronize the cart state should discrepancies occur, preventing any hard crashes in the browser. 
