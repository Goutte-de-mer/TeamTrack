var express = require("express");
var router = express.Router();
const projectController = require("../controllers/projectController");
const {
  handleValidationErros,
  createProjectValidations,
  validateIdParam,
  updateProjectValidations,
} = require("../middlewares/validations");
const { authenticateToken } = require("../middlewares/auth");

router.post(
  "/new",
  authenticateToken,
  createProjectValidations,
  handleValidationErros,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const result = await projectController.createProject(req.body, userId);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get("/all", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const projects = await projectController.getAllProjects(userId);
    return res.status(200).json({ projects });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get(
  "/:id",
  authenticateToken,
  validateIdParam,
  handleValidationErros,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const projectId = req.params.id;

      const project = await projectController.getProjectById(userId, projectId);
      return res.status(200).json(project);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/:id",
  authenticateToken,
  validateIdParam,
  handleValidationErros,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const projectId = req.params.id;

      const result = await projectController.deleteProjectById(
        userId,
        projectId
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.patch(
  "/update",
  authenticateToken,
  updateProjectValidations,
  handleValidationErros,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const { title, description, collaborators, projectId } = req.body;

      if (!title && !description && !collaborators) {
        return res.status(400).json({ error: "Au moins un champs est requis" });
      }

      const updatedProject = await projectController.updateProject(
        title,
        description,
        collaborators,
        userId,
        projectId
      );

      return res.status(200).json(updatedProject);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
