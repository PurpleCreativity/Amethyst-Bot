import Route from "../../classes/Route.js";

export default new Route({
    method: "GET",
    rateLimit: {
        windowMs: 1000,
        limit: 1,
    },

    function: async (req, res) => {
        res.send("Hello, World!");
    },
});
