const Organization = require('../../modules/organization/organization.model');

const tenantResolver = async (req, res, next) => {
  try {
    const host = req.headers.host;

   if (host.includes('localhost')) {
  let org = await Organization.findOne();
  if (!org) {
    org = await Organization.create({
      name: "Local Dummy Tenant",
      subdomain: "localtenant",
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  req.tenant = org;

  // Make dummy tenant ID globally available for auth service
  global.dummyTenantId = org._id;

  return next();
}

    // Production subdomain logic
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