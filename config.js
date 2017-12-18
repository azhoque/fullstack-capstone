exports.DATABASE_URL = process.env.DATABASE_URL ||
global.DATABASE_URL ||
'mongodb://localhost/ontrack';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = "secret44";
exports.JWT_EXPIRY = '7d';