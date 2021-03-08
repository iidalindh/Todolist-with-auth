const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");

const {
  homeRender,
  addTodo,
  removeTodo,
  editTodo,
  editSubmit,
  cancelEdit,
  checkTodo,
  sortTodo,
  showMoreTodos,
  showLessTodos,
} = require("../controller/homeController");

router.get("/", verifyUser, homeRender);
router.post("/", verifyUser, addTodo);

router.get("/remove/:id", verifyUser, removeTodo);

router.get("/edit/:id", verifyUser, editTodo);
router.post("/edit/:id", verifyUser, editSubmit);
router.get("/cancelEdit", verifyUser, editSubmit);

router.get("/checked/:id", verifyUser, checkTodo);

router.post("/sort", verifyUser, sortTodo);

router.get("/showmore", verifyUser, showMoreTodos);
router.get("/showless", verifyUser, showLessTodos);

router.get("/logout", (req, res) => {
  res.clearCookie("jwtToken").redirect("/login");
});

module.exports = router;
