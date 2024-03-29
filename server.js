const path = require("path");
const Koa = require("koa");
const serve = require("koa-static");
const Router = require("@koa/router");
const multer = require("@koa/multer");
const cors = require("@koa/cors");
const { url } = require("inspector");

const app = new Koa();
const router = new Router();

const PORT = 3002;

const UPLOAD_DIR = path.join(__dirname, "/uploadFiles");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

router.get("/", async (ctx) => {
  ctx.body = "Hello friends!";
});

router.post("/uploadFiles", upload.fields([{ name: "file" }]), (ctx) => {
  let urls = ctx.files.file.map(
    (file) => `http://localhost:${PORT}/uploadFiles/${file.originalname}`
  );
  ctx.body = {
    status: true,
    message: `upload done`,
    urls //message to client
    // urls
  };
});

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());
app.use(serve(UPLOAD_DIR));

app.listen(PORT, () => {
  console.log(`app starting at port ${PORT}`);
});