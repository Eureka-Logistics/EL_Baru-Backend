const fs = require('fs');
const path = require('path');

function initModels(sequelize) {
  const models = {};
  const modelsDir = __dirname;

  // Read all files in the models directory
  const files = fs.readdirSync(modelsDir);

  // Filter out non-model files
  const modelFiles = files.filter(file => {
    return (
      file.endsWith('.js') &&
      file !== 'index.js' &&
      file !== 'init-models.js'
    );
  });

  // Load each model file
  modelFiles.forEach(file => {
    try {
      const modelPath = path.join(modelsDir, file);
      const modelFunction = require(modelPath);
      
      // Check if it's a function (model file)
      if (typeof modelFunction === 'function') {
        const model = modelFunction(sequelize, sequelize.Sequelize.DataTypes);
        
        // Use the model name (from sequelize.define first parameter)
        // In Sequelize v6, the model name is available via model.name
        if (model) {
          // Try to get the model name from various possible locations
          const modelName = model.name || 
                          (model.options && model.options.name) ||
                          model.tableName;
          
          if (modelName) {
            models[modelName] = model;
          }
        }
      }
    } catch (error) {
      // Skip files that can't be loaded (e.g., non-model files)
      // Only log if it's not a "Cannot find module" error for dependencies
      if (!error.message.includes('Cannot find module') || error.message.includes(modelsDir)) {
        console.warn(`Warning: Could not load model from ${file}:`, error.message);
      }
    }
  });

  return models;
}

module.exports = initModels;
