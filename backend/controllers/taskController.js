const Task = require("../db/models/Task");
const Project = require("../db/models/Project");

exports.createTask = async (
  { title, description, assignedTo, status, projectId },
  userId
) => {
  // Vérifie l'accès au projet
  const project = await Project.findOne({
    _id: projectId,
    $or: [{ owner: userId }, { collaborators: userId }],
  }).populate("owner collaborators", "_id");

  if (!project) {
    const error = new Error("Accès refusé au projet");
    error.statusCode = 403;
    throw error;
  }

  // Vérifie que assignedTo est autorisé sur le projet
  const assignedUserId = assignedTo || userId;

  const authorizedUserIds = [
    project.owner._id.toString(),
    ...project.collaborators.map((collab) => collab._id.toString()),
  ];

  if (!authorizedUserIds.includes(assignedUserId.toString())) {
    const error = new Error("L'utilisateur assigné n'a pas accès à ce projet");
    error.statusCode = 403;
    throw error;
  }

  const task = await Task.create({
    title,
    description: description || null,
    user: userId,
    assignedTo: assignedTo || userId,
    ...(status && { status }),
    project: projectId,
  });

  const populatedTask = await task.populate(["assignedTo", "user"]);

  return populatedTask;
};

exports.getTaskById = async (userId, taskId) => {
  const task = await Task.findOne({
    _id: taskId,
    $or: [{ user: userId }, { assignedTo: userId }],
  }).populate(["user", "assignedTo"]);

  if (!task) {
    throw new Error("La tâche n'existe pas ou vous n'avez pas les droits");
  }

  return task;
};

exports.deleteTaskById = async (userId, taskId) => {
  const result = await Task.deleteOne({
    _id: taskId,
    user: userId,
  });

  if (result.deletedCount === 0) {
    throw new Error("Tâche introuvable ou accès refusé");
  }
  return { message: "Tâche supprimée avec succès" };
};

exports.updateTask = async (title, description, assignedTo, userId, taskId) => {
  // 1. Récupère tâche + projet populé
  const task = await Task.findOne({ _id: taskId, user: userId }).populate({
    path: "project",
    populate: {
      path: "owner collaborators",
      select: "_id",
    },
  });

  if (!task) {
    throw new Error("Tâche introuvable ou accès refusé");
  }

  // 2. Vérifie assignedTo si fourni
  if (assignedTo !== undefined) {
    const authorizedUserIds = [
      task.project.owner._id.toString(),
      ...task.project.collaborators.map((c) => c._id.toString()),
    ];

    if (!authorizedUserIds.includes(assignedTo.toString())) {
      throw new Error("L'utilisateur assigné n'a pas accès à ce projet");
    }
  }

  // 3. Modifie directement l'objet task
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (assignedTo !== undefined) task.assignedTo = assignedTo;

  // 4. Sauvegarder et populer
  await task.save();
  await task.populate(["user", "assignedTo"]);

  return task;
};

exports.updateStatus = async (userId, { status, taskId }) => {
  const newStatus = await Task.findOneAndUpdate(
    {
      _id: taskId,
      $or: [{ user: userId }, { assignedTo: userId }],
    },
    { $set: { status: status } },
    { new: true, runValidators: true, select: "status -_id" }
  );
  if (!newStatus) {
    throw new Error("Tâche introuvable ou accès refusé");
  }

  return newStatus;
};
