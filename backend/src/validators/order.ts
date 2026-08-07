const { body } = require('express-validator');

const createOrderRules = [
  body('orderItems')
    .isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('orderItems.*.product')
    .isMongoId().withMessage('Invalid product ID'),
  body('orderItems.*.size')
    .notEmpty().withMessage('Size is required'),
  body('orderItems.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('orderItems.*.price')
    .isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('shippingAddress')
    .notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.name')
    .trim()
    .notEmpty().withMessage('Shipping name is required'),
  body('shippingAddress.phone')
    .trim()
    .notEmpty().withMessage('Shipping phone is required'),
  body('shippingAddress.street')
    .trim()
    .notEmpty().withMessage('Shipping street is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty().withMessage('Shipping city is required'),
  body('shippingAddress.state')
    .trim()
    .notEmpty().withMessage('Shipping state is required'),
  body('shippingAddress.zip')
    .optional({ values: 'falsy' })
    .trim(),
  body('shippingAddress.country')
    .trim()
    .notEmpty().withMessage('Shipping country is required'),
  body('billingAddress')
    .notEmpty().withMessage('Billing address is required'),
  body('billingAddress.name')
    .trim()
    .notEmpty().withMessage('Billing name is required'),
  body('billingAddress.phone')
    .trim()
    .notEmpty().withMessage('Billing phone is required'),
  body('billingAddress.street')
    .trim()
    .notEmpty().withMessage('Billing street is required'),
  body('billingAddress.city')
    .trim()
    .notEmpty().withMessage('Billing city is required'),
  body('billingAddress.state')
    .trim()
    .notEmpty().withMessage('Billing state is required'),
  body('billingAddress.zip')
    .optional({ values: 'falsy' })
    .trim(),
  body('billingAddress.country')
    .trim()
    .notEmpty().withMessage('Billing country is required'),
  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer', 'cash_on_delivery'])
    .withMessage('Invalid payment method'),
  body('subtotal')
    .isFloat({ min: 0 }).withMessage('Subtotal must be positive'),
  body('tax')
    .isFloat({ min: 0 }).withMessage('Tax must be non-negative'),
  body('shippingCost')
    .isFloat({ min: 0 }).withMessage('Shipping cost must be non-negative'),
  body('total')
    .isFloat({ min: 0 }).withMessage('Total must be positive'),
  body('coupon')
    .optional()
    .isMongoId().withMessage('Invalid coupon ID'),
  body('guestInfo.email')
    .optional()
    .trim()
    .isEmail().withMessage('Valid email is required for guest orders'),
  body('guestInfo.name')
    .optional()
    .trim(),
  body('guestInfo.phone')
    .optional()
    .trim(),
];

const updateStatusRules = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'confirmed', 'packed', 'shipped', 'delivering', 'delivered', 'cancelled', 'refunded'])
    .withMessage('Invalid status'),
  body('note')
    .optional()
    .trim(),
];

module.exports = { createOrderRules, updateStatusRules };

export {};
