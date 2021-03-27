import $ from 'jquery';
import { formatMoney, stripZeroCents } from './currency';
import { getSizedImageUrl } from './image';

/**
 * Formats the cart object to be consumed by the handlebars template
 *
 * @param {object} cart - JSON representation of the cart.  See https://help.shopify.com/themes/development/getting-started/using-ajax-api#get-cart
 * @return {object} 
 */
export const formatCart = (cart) => {
  if (cart && cart.is_formatted) {
    return cart;
  }

  // Make adjustments to the cart object contents before we pass it off to the handlebars template
  cart.total_price = stripZeroCents(formatMoney(cart.total_price));

  cart.items.map((item) => {
    item.image = getSizedImageUrl(item.image, '500x');
    item.price = stripZeroCents(formatMoney(item.price));
    item.multiple_quantities = item.quantity > 1;

    // Adjust the item's variant options to add "name" and "value" properties
    if (item.hasOwnProperty('product')) {
      const product = item.product;

      for (let i = item.variant_options.length - 1; i >= 0; i--) {
        const name  = product.options[i];
        const value = item.variant_options[i];

        item.variant_options[i] = { name, value };

        // Don't show this info if it's the default variant that Shopify creates
        if (value === 'Default Title') {
          delete item.variant_options[i];
        }
      }
    }
    else {
      delete item.variant_options; // skip it and use the variant title instead
    }

    if (item.variant_title === 'Default Title') {
      item.variant_title = null;
    }

    return item;
  });

  cart.is_formatted = true;

  return cart;
}

/**
 * Retrieve a JSON respresentation of the users cart
 *
 * @return {Promise} - JSON cart
 */
export const getCart = () => {
  const promise = $.Deferred();

  $.ajax({
    type: 'get',
    url: '/cart?view=json',
    success: (data) => {
      // Theme editor adds HTML comments to JSON response, strip these
      data = data.replace(/<\/?[^>]+>/gi, '');
      
      const cart = JSON.parse(data)

      promise.resolve(formatCart(cart))
    },
    error: () => {
      promise.reject({
        message: 'Could not retrieve cart items'
      });
    }
  });

  return promise;
}

/**
 * AJAX submit an 'add to cart' form
 *
 * @param {jQuery} $form - jQuery instance of the form
 * @return {Promise} - Resolve returns JSON cart | Reject returns an error message
 */
export const addItemFromForm = ($form) => {
  const promise = $.Deferred()

  $.ajax({
    type: 'post',
    dataType: 'json',
    url: '/cart/add.js',
    data: $form.serialize(),
    success: () => {
      getCart().then((cart) => {
        promise.resolve(cart)
      });
    },
    error: () => {
      promise.reject({
        message: 'The quantity you entered is not available.'
      })
    }
  })

  return promise;
}

/**
 * Change the quantity of an item in the users cart
 * Item is specified by line_item index (Shopify index which starts at 1 not 0)
 *
 * @param {Integer} line - Cart line
 * @param {Integer} qty - New quantity of the variant
 * @return {Promise} - JSON cart
 */
export const changeLineItemQuantity = (line, qty) => {
  const promise = $.Deferred();

  $.ajax({
    type: 'post',
    dataType: 'json',
    url: '/cart/change.js',
    data: `quantity=${qty}&line=${line}`,
    success: () => {
      getCart().then((cart) => {
        promise.resolve(cart)
      })
    },
    error: () => {
      const message = 'Something went wrong.'
      
      promise.reject({ message })
    }
  });

  return promise;
}
