# LuxeMart — E-Commerce Storefront Case Study

## Overview

LuxeMart is a fully functional mini e-commerce storefront built entirely with vanilla HTML, CSS, and JavaScript — no frameworks or build tools required. The app fetches real product data from the Fake Store API and provides a complete shopping experience: browsing, searching, filtering, viewing product details, managing a persistent shopping cart, and completing checkout. This capstone project consolidates skills from all five prior weeks of the internship, including DOM manipulation, API integration, localStorage persistence, hash-based SPA routing, responsive design, and reusable component architecture.

## Key Technical Decisions

I chose a single-page application architecture using hash-based routing (`#/`, `#/product/:id`, `#/cart`, `#/checkout`) to deliver a smooth, app-like navigation experience without requiring a server or build system. The cart uses an observer pattern — components subscribe to state changes and re-render automatically — which keeps the UI consistent across the header badge, cart page, and checkout summary without tightly coupling them. I reused all four Week 5 UI kit components (buttons, cards, modals, toasts) to demonstrate the value of a pre-built component library: the modal handles cart removal confirmations and checkout success dialogs, while toasts provide non-intrusive feedback for add/remove actions. The Fake Store API responses are cached in memory to minimize network requests and improve perceived performance, and the cart is serialized to localStorage on every mutation so it survives page refreshes.

## What I'd Improve With More Time

Given more time, I would add a wishlist feature with its own persistence layer, implement product sorting (by price, rating, or name), and build an image gallery or carousel for the product detail page. I'd also introduce CSS custom properties for a dark-mode toggle, add end-to-end tests with Playwright, and improve accessibility by implementing a focus-trap inside modals and managing ARIA live regions for dynamic content updates more granularly.
