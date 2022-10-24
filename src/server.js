require("dotenv-safe").config();

const app = require("./app");

app.listen(process.env.PORT);

console.log(`Server listen at port: ${process.env.PORT}`);
