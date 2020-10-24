const getCommonAdminData = (req, title) => {
    // common data for unauthenticated admin pages
    const commonData = {
        title
    }

    // appends data for authenticated admin pages
    if (req.isAuthenticated() && req.user) {
        return {
            ...commonData,
            name: req.user.name,
            email: req.user.email
        }
    }
    return commonData;
}

module.exports = {
    getCommonAdminData
}