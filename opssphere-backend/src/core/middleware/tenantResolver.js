const Organization = require('../../modules/organization/organization.model');

const tenantResolver = async (req, res, next) => {
  try {
    // Extract subdomain from host header
    const host = req.headers.host; // e.g., campus.opssphere.com
    const subdomain = host.split('.')[0];

    // Find organization by subdomain
    const org = await Organization.findOne({ subdomain });
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Attach tenant info to request
    req.tenant = org;
    next();
  } catch (err) {
    console.error('Tenant resolver error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = tenantResolver;
