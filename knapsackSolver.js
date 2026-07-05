function buildDpTable(items, maxCapacity) {
  const itemCount = items.length;

  // (itemCount + 1) rows x (maxCapacity + 1) columns, initialized to 0
  const dpTable = Array.from({ length: itemCount + 1 }, () =>
    new Array(maxCapacity + 1).fill(0)
  );

  for (let i = 1; i <= itemCount; i++) {
    const currentItem = items[i - 1];
    const itemWeight = currentItem.weight;
    const itemPriority = currentItem.priority;

    for (let capacity = 0; capacity <= maxCapacity; capacity++) {
      const excludeValue = dpTable[i - 1][capacity];

      if (itemWeight <= capacity) {
        const includeValue = dpTable[i - 1][capacity - itemWeight] + itemPriority;
        dpTable[i][capacity] = Math.max(excludeValue, includeValue);
      } else {
        // Item does not fit at this capacity; carry the previous row forward
        dpTable[i][capacity] = excludeValue;
      }
    }
  }

  return dpTable;
}

function backtrackSelectedItems(dpTable, items, maxCapacity) {
  const selectedItems = [];
  let remainingCapacity = maxCapacity;
  let totalWeight = 0;

  for (let i = items.length; i > 0; i--) {
    const includedThisItem = dpTable[i][remainingCapacity] !== dpTable[i - 1][remainingCapacity];

    if (includedThisItem) {
      const chosenItem = items[i - 1];
      selectedItems.unshift(chosenItem);
      totalWeight += chosenItem.weight;
      remainingCapacity -= chosenItem.weight;
    }
  }

  return { selectedItems, totalWeight };
}

function solveKnapsack(items, maxCapacity) {
  if (!Number.isInteger(maxCapacity) || maxCapacity < 0) {
    throw new Error("maxCapacity must be a non-negative integer.");
  }

  const dpTable = buildDpTable(items, maxCapacity);
  const { selectedItems, totalWeight } = backtrackSelectedItems(dpTable, items, maxCapacity);

  return {
    maximumAchievedPriority: dpTable[items.length][maxCapacity],
    totalPayloadWeightKg: totalWeight,
    remainingVehicleCapacityKg: maxCapacity - totalWeight,
    itemsSelectedForLoading: selectedItems,
  };
}

module.exports = { solveKnapsack, buildDpTable, backtrackSelectedItems };
