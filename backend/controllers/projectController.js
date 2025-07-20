const Project = require("../db/models/Project");
const Task = require("../db/models/Task");

exports.createProject = async (
  { title, description, collaborators },
  userId
) => {
  const project = await Project.create({
    title,
    description: description || null,
    owner: userId,
    collaborators: collaborators || [],
  });

  const populatedProject = await project.populate(["owner", "collaborators"]);

  return populatedProject;
};

exports.getAllProjects = async (userId) => {
  const projects = await Project.find({
    $or: [{ owner: userId }, { collaborators: userId }],
  }).populate(["owner", "collaborators"], ["userName", "email"]);
  return projects;
};

exports.getProjectById = async (userId, projectId) => {
  const project = await Project.findOne({
    _id: projectId,
    $or: [{ owner: userId }, { collaborators: userId }],
  }).populate(["owner", "collaborators"]);

  if (!project) {
    throw new Error("Le projet n'existe pas ou vous n'avez pas les droits");
  }

  const tasks = await Task.find({ project: project._id })
    .populate("user assignedTo", "userName email")
    .sort({ createdAt: -1 });

  return { project, tasks };
};

exports.deleteProjectById = async (userId, projectId) => {
  const result = await Project.deleteOne({
    _id: projectId,
    owner: userId,
  });

  if (result.deletedCount === 0) {
    throw new Error("Projet introuvable ou accès refusé");
  }
  return { message: "Projet supprimé avec succès" };
};

exports.updateProject = async (
  title,
  description,
  collaborators,
  userId,
  projectId
) => {
  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (collaborators !== undefined) updates.collaborators = collaborators;

  const updatedProject = await Project.findOneAndUpdate(
    { _id: projectId, owner: userId },
    { $set: updates },
    { new: true, runValidators: true }
  ).populate(["owner", "collaborators"]);

  if (!updatedProject) throw new Error("Projet introuvable ou accès refusé");

  return updatedProject;
};
