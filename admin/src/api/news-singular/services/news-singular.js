'use strict';

/**
 * news-singular service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::news-singular.news-singular');
