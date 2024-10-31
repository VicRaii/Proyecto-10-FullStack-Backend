const Champion = require("../models/Champion");

const getChampions = async (req, res, next) => {
  try {
    const champions = await Champion.find();
    return res.status(200).json(champions);
  } catch (error) {
    return next(error);
  }
};

const getChampionsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const champion = await Champion.findById(id);

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
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return next(error);
  }
};

const updateChampions = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const newChampion = req.body;
    const championUpdated = await Champion.findByIdAndUpdate(id, newChampion, {
      new: true,
      runValidators: true,
    });

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

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const championDeleted = await Champion.findByIdAndDelete(id);

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
