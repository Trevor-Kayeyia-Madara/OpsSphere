const Organization = require('../../modules/organization/organization.model');

const tenantResolver = async (req, res, next) => {
  try {
    const host = req.headers.host;

    // LOCALHOST TESTING — skip subdomain logic
    if (host.includes('localhost')) {
      req.tenant = null;
      return next();
    }

    // Extract subdomain
    const subdomain = host.split('.')[0];

    const org = await Organization.findOne({ subdomain });

    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    req.tenant = org;
    next();

  } catch (err) {
    console.error('Tenant resolver error:', err);
    next(err);
  }
};

module.exports = tenantResolver;
