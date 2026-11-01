const asyncHandler = require('./asyncHandler');

// Builds standard create/list/get/update/delete handlers for a Sequelize model.
// options.include lets callers eager-load associations on list/get.
function buildCrudController(Model, options = {}) {
  const { include = [] } = options;

  const create = asyncHandler(async (req, res) => {
    const record = await Model.create(req.body);
    res.status(201).json(record);
  });

  const list = asyncHandler(async (req, res) => {
    const { limit = 50, offset = 0, ...filters } = req.query;
    const records = await Model.findAndCountAll({
      where: filters,
      include,
      limit: Math.min(parseInt(limit, 10) || 50, 200),
      offset: parseInt(offset, 10) || 0,
      order: [['id', 'DESC']]
    });
    res.json({ total: records.count, items: records.rows });
  });

  const getById = asyncHandler(async (req, res) => {
    const record = await Model.findByPk(req.params.id, { include });
    if (!record) return res.status(404).json({ error: `${Model.name} not found` });
    res.json(record);
  });

  const update = asyncHandler(async (req, res) => {
    const record = await Model.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: `${Model.name} not found` });
    await record.update(req.body);
    res.json(record);
  });

  const remove = asyncHandler(async (req, res) => {
    const record = await Model.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: `${Model.name} not found` });
    await record.destroy();
    res.status(204).send();
  });

  return { create, list, getById, update, remove };
}

module.exports = buildCrudController;
