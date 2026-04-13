"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("@public/index");
const index_2 = require("@express/index");
describe('Express Adapter Integration', () => {
    it('should securely mount plugin routes and apply topological middleware', async () => {
        const app = (0, express_1.default)();
        const system = (0, index_1.createPluginSystem)({ lifecycles: [] });
        // A fake auth plugin that requires custom state
        const authPlugin = (0, index_1.definePlugin)({
            name: 'auth',
            middleware: {
                handler: (ctx) => (req, res, next) => {
                    req.user = 'test-user';
                    next();
                }
            }
        });
        // A feature plugin that REQUIRES 'auth', meaning it mounts its routes AFTER auth middleware is registered
        const featurePlugin = (0, index_1.definePlugin)({
            name: 'billing',
            dependencies: ['auth'],
            routeBasePath: '/api/billing',
            routes: async (ctx, router) => {
                router.get('/status', (req, res) => {
                    res.json({ active: true, user: req.user });
                });
            }
        });
        system.register(featurePlugin);
        system.register(authPlugin);
        await system.init();
        await (0, index_2.mountMiddleware)(app, system);
        await (0, index_2.mountRoutes)(app, system);
        const res = await (0, supertest_1.default)(app).get('/api/billing/status');
        expect(res.status).toBe(200);
        // Evaluates true only if 'auth' executed middleware injection before routes bounds hit
        expect(res.body).toEqual({ active: true, user: 'test-user' });
    });
});
//# sourceMappingURL=express-adapter.spec.js.map