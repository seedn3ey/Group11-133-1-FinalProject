function createItem(id, name, weight, priority) {
  return {
    id: id,
    name: name,
    weight: weight,
    priority: priority
  };
}

module.exports = { createItem };