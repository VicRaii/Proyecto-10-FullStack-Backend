const Champion = require("../models/Champion");

const getChampions = async (req, res, next) => {
  try {
    const champions = await Champion.find();
    return res.status(200).json(champions);
  } catch (error) {
    return next(error); // Pasar el error al middleware de manejo de errores
  }
};

const getChampionsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar si el ID es válido
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const champion = await Champion.findById(id);

    // Verificar si se encontró el campeón
    if (!champion) {
      return res.status(404).json({ message: "Campeón no encontrado" });
    }

    return res.status(200).json(champion);
  } catch (error) {
    return next(error);
  }
};

const getChampionsByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    const champions = await Champion.find({ role });

    // Verificar si se encontraron campeones con ese rol
    if (champions.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron campeones con ese rol" });
    }

    return res.status(200).json(champions);
  } catch (error) {
    return next(error);
  }
};

const postChampions = async (req, res, next) => {
  try {
    const newChampion = new Champion(req.body);
    const championSaved = await newChampion.save();
    return res.status(201).json(championSaved);
  } catch (error) {
    // Si ocurre un error de validación, responde con un 400
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return next(error);
  }
};

const updateChampions = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar si el ID es válido
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const newChampion = req.body;
    const championUpdated = await Champion.findByIdAndUpdate(id, newChampion, {
      new: true,
      runValidators: true, // Validar datos antes de actualizar
    });

    // Verificar si se encontró el campeón
    if (!championUpdated) {
      return res.status(404).json({ message: "Campeón no encontrado" });
    }

    return res.status(200).json(championUpdated);
  } catch (error) {
    return next(error);
  }
};

const deleteChampions = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar si el ID es válido
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const championDeleted = await Champion.findByIdAndDelete(id);

    // Verificar si se encontró y eliminó el campeón
    if (!championDeleted) {
      return res.status(404).json({ message: "Campeón no encontrado" });
    }

    return res.status(200).json({ message: "Campeón eliminado correctamente" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getChampions,
  getChampionsById,
  getChampionsByRole,
  postChampions,
  updateChampions,
  deleteChampions,
};
