const express = require('express');
const path = require('path');
const router = express.Router();

/**
 * @swagger
 * /.well-known/assetlinks.json:
 *   get:
 *     summary: Android App Links verification file
 *     tags: [Well-known]
 *     responses:
 *       200:
 *         description: Android App Links verification file
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   relation:
 *                     type: array
 *                     items:
 *                       type: string
 *                   target:
 *                     type: object
 *                     properties:
 *                       namespace:
 *                         type: string
 *                       package_name:
 *                         type: string
 *                       sha256_cert_fingerprints:
 *                         type: array
 *                         items:
 *                           type: string
 */
router.get('/assetlinks.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.sendFile(path.join(__dirname, '../../public/.well-known/assetlinks.json'));
});

/**
 * @swagger
 * /.well-known/apple-app-site-association:
 *   get:
 *     summary: iOS Universal Links verification file
 *     tags: [Well-known]
 *     responses:
 *       200:
 *         description: iOS Universal Links verification file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applinks:
 *                   type: object
 *                   properties:
 *                     apps:
 *                       type: array
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           appID:
 *                             type: string
 *                           paths:
 *                             type: array
 *                             items:
 *                               type: string
 */
router.get('/apple-app-site-association', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.sendFile(path.join(__dirname, '../../public/.well-known/apple-app-site-association'));
});

module.exports = router;
