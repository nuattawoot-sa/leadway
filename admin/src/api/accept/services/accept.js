'use strict';

/**
 * accept service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::accept.accept');
