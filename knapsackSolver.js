function solveKnapsack(items, maxCapacity) {
  const n = items.length;
  
  // 1. Initialize the 2D DP table with zeros
  // Size: (n + 1) rows by (maxCapacity + 1) columns
  const K = Array(n + 1).fill(0).map(() => Array(maxCapacity + 1).fill(0));

  // 2. Build the table using the bottom-up approach
  for (let i = 1; i <= n; i++) {
    const currentItem = items[i - 1];
    const w = currentItem.weight;
    const v = currentItem.priority;

    for (let j = 0; j <= maxCapacity; j++) {
      if (w <= j) {
        // Item fits: take the max of excluding it or including it
        K[i][j] = Math.max(K[i - 1][j], K[i - 1][j - w] + v);
      } else {
        // Item is too heavy: carry over the previous value
        K[i][j] = K[i - 1][j];
      }
    }
  }

  // 3. Backtrack to find which items were selected
  let res = K[n][maxCapacity];
  const maximumAchievedPriority = res;
  let wRemaining = maxCapacity;
  
  const itemsSelectedForLoading = [];
  let totalPayloadWeightKg = 0;

  // Start from the bottom right of the table and work backward
  for (let i = n; i > 0 && res > 0; i--) {
    // If the value came from the row above, the item was NOT included
    if (res === K[i - 1][wRemaining]) {
      continue;
    } else {
      // The item WAS included
      const selectedItem = items[i - 1];
      
      // Add it to the front of our results array
      itemsSelectedForLoading.unshift(selectedItem);
      
      // Deduct its priority and weight to find the next cell to check
      res -= selectedItem.priority;
      wRemaining -= selectedItem.weight;
      totalPayloadWeightKg += selectedItem.weight;
    }
  }

  // 4. Return the unified optimization metrics formatted for main.js
  return {
    maximumAchievedPriority,
    totalPayloadWeightKg,
    remainingVehicleCapacityKg: maxCapacity - totalPayloadWeightKg,
    itemsSelectedForLoading
  };
}

module.exports = { solveKnapsack };